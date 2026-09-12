-- Migration 16: VIP Plans, Rules, and Authoritative Purchase RPC
CREATE TABLE IF NOT EXISTS public.vip_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_key TEXT UNIQUE NOT NULL,
    title_fa TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_fa TEXT NOT NULL,
    description_en TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for vip_rules
ALTER TABLE public.vip_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read vip_rules"
ON public.vip_rules FOR SELECT
USING (true);

-- Populate default VIP rules
INSERT INTO public.vip_rules (rule_key, title_fa, title_en, description_fa, description_en, category)
VALUES
('validity_expiry', 'مدت زمان و انقضای اشتراک', 'Subscription Expiry & Validity', 'اشتراک‌های VIP در دوره‌های ۱، ۳، ۶ و ۱۲ ماهه ارائه‌شده و پس از انقضا به صورت خودکار غیرفعال می‌گردند.', 'VIP subscriptions are offered in 1, 3, 6, and 12 month tiers and automatically expire at the end of the term.', 'general'),
('no_refund', 'عدم امکان بازگشت وجه', 'Non-Refundable Policy', 'تمامی خریدهای سکه و فعال‌سازی‌های VIP قطعی بوده و وجه پرداختی قابل استرداد نمی‌باشد.', 'All coin purchases and VIP activations are final and non-refundable.', 'billing'),
('fair_use', 'استفاده منصفانه و ضد تقلب', 'Fair Use & Anti-Fraud', 'سوءاستفاده از بج VIP، مزاحمت در لایواستریم‌ها یا اقدام به فریب کاربران موجب تعلیق حساب بدون بازگشت وجه می‌شود.', 'Misuse of VIP status, harassment in streams, or fraudulent behavior will lead to account suspension without refund.', 'security'),
('perks_benefits', 'مزایای سطح‌بندی‌شده VIP', 'Tiered VIP Perks', 'اعضای VIP از نشان اختصاصی، بوست دیده شدن پروفایل، کیفیت HD در استریم و پشتیبانی ویژه برخوردارند.', 'VIP members enjoy custom badges, profile exposure boost, HD stream quality, and priority support.', 'perks')
ON CONFLICT (rule_key) DO UPDATE SET
title_fa = EXCLUDED.title_fa,
description_fa = EXCLUDED.description_fa;

-- Improved RPC for Purchase VIP
CREATE OR REPLACE FUNCTION public.rpc_purchase_vip(
    p_plan TEXT,
    p_duration_months INTEGER DEFAULT 1,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_user_coins INTEGER;
  v_monthly_base_price INTEGER;
  v_discount_multiplier NUMERIC;
  v_official_price INTEGER;
  v_expires_at TIMESTAMP WITH TIME ZONE;
  v_cached_response JSONB;
  v_plan_clean TEXT := LOWER(COALESCE(p_plan, 'gold'));
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '401 Unauthorized');
  END IF;

  p_duration_months := COALESCE(p_duration_months, 1);
  IF p_duration_months < 1 THEN p_duration_months := 1; END IF;

  -- Determine base monthly price by plan
  IF v_plan_clean = 'silver' OR v_plan_clean = 'silver vip' THEN
    v_monthly_base_price := 300;
  ELSIF v_plan_clean = 'gold' OR v_plan_clean = 'gold vip' OR v_plan_clean = 'monthly' THEN
    v_monthly_base_price := 500;
  ELSIF v_plan_clean = 'diamond' OR v_plan_clean = 'diamond vip' THEN
    v_monthly_base_price := 1000;
  ELSIF v_plan_clean = 'elite' OR v_plan_clean = 'elite vip' THEN
    v_monthly_base_price := 2000;
  ELSIF v_plan_clean = 'adult_monthly' OR v_plan_clean = 'vip adult' THEN
    v_monthly_base_price := 799;
  ELSE
    v_monthly_base_price := 500;
  END IF;

  -- Determine discount multiplier
  IF p_duration_months >= 12 THEN
    v_discount_multiplier := 0.60; -- 40% off
  ELSIF p_duration_months >= 6 THEN
    v_discount_multiplier := 0.75; -- 25% off
  ELSIF p_duration_months >= 3 THEN
    v_discount_multiplier := 0.85; -- 15% off
  ELSE
    v_discount_multiplier := 1.00;
  END IF;

  v_official_price := ROUND(v_monthly_base_price * p_duration_months * v_discount_multiplier);

  -- Idempotency Check
  IF p_idempotency_key IS NOT NULL THEN
    SELECT response INTO v_cached_response FROM public.idempotency_keys WHERE key = p_idempotency_key AND user_id = v_user_id;
    IF v_cached_response IS NOT NULL THEN
      RETURN v_cached_response;
    END IF;
  END IF;

  -- Lock Wallet & Check Balance
  SELECT coins INTO v_user_coins FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
  IF v_user_coins IS NULL OR v_user_coins < v_official_price THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'INSUFFICIENT_FUNDS', 
      'current_coins', COALESCE(v_user_coins, 0), 
      'required_coins', v_official_price
    );
  END IF;

  v_expires_at := timezone('utc'::text, now()) + (p_duration_months || ' months')::interval;

  -- Deduct coins
  UPDATE public.wallets SET coins = coins - v_official_price WHERE user_id = v_user_id;

  -- Update Profile VIP Status
  UPDATE public.profiles 
  SET is_vip = true, 
      vip_plan = v_plan_clean,
      vip_expires_at = v_expires_at 
  WHERE id = v_user_id;

  -- Record VIP Subscription & Transaction
  INSERT INTO public.vip_subscriptions (user_id, plan, duration_months, price_coins, expires_at)
  VALUES (v_user_id, v_plan_clean, p_duration_months, v_official_price, v_expires_at);

  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (v_user_id, 'buy_vip', -v_official_price, 0.0, 'Purchased VIP Plan: ' || UPPER(v_plan_clean) || ' (' || p_duration_months || ' months)');

  v_cached_response := jsonb_build_object(
    'success', true,
    'is_vip', true,
    'vip_plan', v_plan_clean,
    'duration_months', p_duration_months,
    'price_coins', v_official_price,
    'remaining_coins', v_user_coins - v_official_price,
    'expires_at', v_expires_at
  );

  IF p_idempotency_key IS NOT NULL THEN
    INSERT INTO public.idempotency_keys (key, user_id, response)
    VALUES (p_idempotency_key, v_user_id, v_cached_response)
    ON CONFLICT (key) DO NOTHING;
  END IF;

  RETURN v_cached_response;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
