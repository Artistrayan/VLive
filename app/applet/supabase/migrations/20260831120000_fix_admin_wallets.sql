-- Migration: Fix Admin Wallet Management and is_admin_user helper function
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (
        LOWER(COALESCE(role, '')) IN ('admin', 'super_admin')
        OR UPPER(COALESCE(user_type, '')) IN ('ADMIN', 'SUPER_ADMIN')
        OR LOWER(COALESCE(username, '')) IN ('rayan', 'rayan_super_admin')
        OR telegram_id = 8933698119
        OR is_admin = true
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies on public.wallets for admins
DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallets;
CREATE POLICY "Users can view own wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin_user());

DROP POLICY IF EXISTS "Admins can update all wallets" ON public.wallets;
CREATE POLICY "Admins can update all wallets" ON public.wallets
  FOR UPDATE USING (public.is_admin_user() OR current_user = 'service_role');

DROP POLICY IF EXISTS "Admins can insert wallets" ON public.wallets;
CREATE POLICY "Admins can insert wallets" ON public.wallets
  FOR INSERT WITH CHECK (public.is_admin_user() OR current_user = 'service_role');

-- Ensure rpc_admin_adjust_wallet is atomic and works reliably
CREATE OR REPLACE FUNCTION public.rpc_admin_adjust_wallet(
    p_target_user_id UUID,
    p_amount_coins INTEGER,
    p_reason TEXT DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
  v_admin_id UUID := auth.uid();
  v_target_coins INTEGER := 0;
  v_new_coins INTEGER := 0;
BEGIN
  IF NOT public.is_admin_user() AND current_user != 'service_role' THEN
    RETURN jsonb_build_object('success', false, 'error', '403 Forbidden: Admin privileges required');
  END IF;

  -- Ensure wallet row exists
  INSERT INTO public.wallets (user_id, coins, usdt_balance)
  VALUES (p_target_user_id, 0, 0.0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Lock target wallet row
  SELECT coins INTO v_target_coins FROM public.wallets WHERE user_id = p_target_user_id FOR UPDATE;

  v_target_coins := COALESCE(v_target_coins, 0);
  v_new_coins := v_target_coins + p_amount_coins;

  IF v_new_coins < 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Adjustment would result in negative coin balance');
  END IF;

  -- Adjust wallet
  UPDATE public.wallets 
  SET coins = v_new_coins,
      updated_at = timezone('utc'::text, now())
  WHERE user_id = p_target_user_id;

  -- Record Transaction Log
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (
    p_target_user_id, 
    CASE WHEN p_amount_coins >= 0 THEN 'admin_deposit' ELSE 'admin_deduct' END, 
    p_amount_coins, 
    0.0, 
    'Admin Adjustment: ' || COALESCE(p_reason, 'Manual Correction')
  );

  -- Record Audit Trail if admin_audit_logs exists
  BEGIN
    INSERT INTO public.admin_audit_logs (admin_id, action, target_user_id, amount_coins, reason)
    VALUES (v_admin_id, 'ADMIN_WALLET_ADJUSTMENT', p_target_user_id, p_amount_coins, p_reason);
  EXCEPTION WHEN OTHERS THEN
    -- Ignore if audit log table structure differs
  END;

  RETURN jsonb_build_object(
    'success', true, 
    'target_user_id', p_target_user_id, 
    'old_coins', v_target_coins,
    'new_coins', v_new_coins
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
