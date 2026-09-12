-- ====================================================================
-- MIGRATION 10: ADVANCED DATABASE SECURITY, STRICT RLS & ATOMIC RPCS
-- ====================================================================

-- 1. Helper function to check if current user is an authorized Admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND (role IN ('admin', 'super_admin') OR telegram_id = 8933698119)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Prevent Privilege Escalation & Role/KYC/VIP Spoofing on Profiles
CREATE OR REPLACE FUNCTION public.guard_profile_fields_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- If executing as service_role or admin user, allow modifications
  IF current_user = 'service_role' OR public.is_admin_user() THEN
    RETURN NEW;
  END IF;

  -- Regular users CANNOT change role, is_verified, is_streamer, is_vip, status
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Unauthorized: Role modification is strictly forbidden.';
  END IF;

  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
    NEW.is_verified := OLD.is_verified;
  END IF;

  IF NEW.is_vip IS DISTINCT FROM OLD.is_vip THEN
    NEW.is_vip := OLD.is_vip;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status := OLD.status;
  END IF;

  -- Protect telegram_id from being overwritten if already bound
  IF OLD.telegram_id IS NOT NULL AND NEW.telegram_id IS DISTINCT FROM OLD.telegram_id THEN
    RAISE EXCEPTION 'Unauthorized: Bound Telegram ID cannot be changed.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_guard_profile_fields ON public.profiles;
CREATE TRIGGER trg_guard_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_profile_fields_trigger();

-- 3. Ensure tables exist for Payouts, Streamer Applications, Gifts & Idempotency
CREATE TABLE IF NOT EXISTS public.payout_requests (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount_usdt NUMERIC NOT NULL CHECK (amount_usdt > 0),
    method TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Processing', 'Completed')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.streamer_applications (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    category TEXT,
    sample_url TEXT,
    experience TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.gift_transactions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    gift_id TEXT NOT NULL,
    gift_name TEXT NOT NULL,
    coin_cost INTEGER NOT NULL CHECK (coin_cost > 0),
    streamer_coins INTEGER NOT NULL DEFAULT 0,
    platform_fee_coins INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.vip_subscriptions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan TEXT NOT NULL,
    duration_months INTEGER NOT NULL CHECK (duration_months > 0),
    price_coins INTEGER NOT NULL CHECK (price_coins >= 0),
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.idempotency_keys (
    key TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    response JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Secure KYC & Streamer & Payout Triggers (Anti-Spoofing)
CREATE OR REPLACE FUNCTION public.guard_kyc_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'Pending';
    NEW.user_id := auth.uid();
  ELSIF TG_OP = 'UPDATE' THEN
    IF NOT public.is_admin_user() AND current_user != 'service_role' THEN
      RAISE EXCEPTION 'Unauthorized: Only administrators can update KYC verification status.';
    END IF;
    -- When KYC is approved, update profile verification
    IF NEW.status = 'Approved' AND OLD.status != 'Approved' THEN
      UPDATE public.profiles SET is_verified = true WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_guard_kyc ON public.kyc_applications;
CREATE TRIGGER trg_guard_kyc
  BEFORE INSERT OR UPDATE ON public.kyc_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_kyc_trigger();

CREATE OR REPLACE FUNCTION public.guard_streamer_app_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'Pending';
    NEW.user_id := auth.uid();
  ELSIF TG_OP = 'UPDATE' THEN
    IF NOT public.is_admin_user() AND current_user != 'service_role' THEN
      RAISE EXCEPTION 'Unauthorized: Only administrators can update Streamer application status.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_guard_streamer_app ON public.streamer_applications;
CREATE TRIGGER trg_guard_streamer_app
  BEFORE INSERT OR UPDATE ON public.streamer_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_streamer_app_trigger();

CREATE OR REPLACE FUNCTION public.guard_payout_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'Pending';
    NEW.user_id := auth.uid();
  ELSIF TG_OP = 'UPDATE' THEN
    IF NOT public.is_admin_user() AND current_user != 'service_role' THEN
      RAISE EXCEPTION 'Unauthorized: Only administrators can update Payout status.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_guard_payout ON public.payout_requests;
CREATE TRIGGER trg_guard_payout
  BEFORE INSERT OR UPDATE ON public.payout_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_payout_trigger();

-- 5. Wallet Security: Drop Insecure Direct Client Update Policies
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can update own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can insert own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can delete own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can view own wallet." ON public.wallets;
DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallets;

CREATE POLICY "Users can view own wallet"
  ON public.wallets FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin_user());

-- Add check constraint for non-negative balance
ALTER TABLE public.wallets DROP CONSTRAINT IF EXISTS wallets_coins_non_negative;
ALTER TABLE public.wallets ADD CONSTRAINT wallets_coins_non_negative CHECK (coins >= 0);

ALTER TABLE public.wallets DROP CONSTRAINT IF EXISTS wallets_usdt_non_negative;
ALTER TABLE public.wallets ADD CONSTRAINT wallets_usdt_non_negative CHECK (usdt_balance >= 0.0);

-- Enable RLS on newly created tables
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streamer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idempotency_keys ENABLE ROW LEVEL SECURITY;

-- Payouts Policies
DROP POLICY IF EXISTS "Users can view own payouts" ON public.payout_requests;
CREATE POLICY "Users can view own payouts" ON public.payout_requests FOR SELECT USING (auth.uid() = user_id OR public.is_admin_user());
DROP POLICY IF EXISTS "Users can insert own payouts" ON public.payout_requests;
CREATE POLICY "Users can insert own payouts" ON public.payout_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can update payouts" ON public.payout_requests;
CREATE POLICY "Admins can update payouts" ON public.payout_requests FOR UPDATE USING (public.is_admin_user());

-- Streamer Apps Policies
DROP POLICY IF EXISTS "Users can view own streamer apps" ON public.streamer_applications;
CREATE POLICY "Users can view own streamer apps" ON public.streamer_applications FOR SELECT USING (auth.uid() = user_id OR public.is_admin_user());
DROP POLICY IF EXISTS "Users can insert own streamer app" ON public.streamer_applications;
CREATE POLICY "Users can insert own streamer app" ON public.streamer_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can update streamer app" ON public.streamer_applications;
CREATE POLICY "Admins can update streamer app" ON public.streamer_applications FOR UPDATE USING (public.is_admin_user());

-- Gift Transactions Policies
DROP POLICY IF EXISTS "Users can view own gift transactions" ON public.gift_transactions;
CREATE POLICY "Users can view own gift transactions" ON public.gift_transactions FOR SELECT USING (auth.uid() IN (sender_id, receiver_id) OR public.is_admin_user());

-- VIP Subscriptions Policies
DROP POLICY IF EXISTS "Users can view own VIP subscriptions" ON public.vip_subscriptions;
CREATE POLICY "Users can view own VIP subscriptions" ON public.vip_subscriptions FOR SELECT USING (auth.uid() = user_id OR public.is_admin_user());

-- Idempotency Keys Policies
DROP POLICY IF EXISTS "Users can view own idempotency keys" ON public.idempotency_keys;
CREATE POLICY "Users can view own idempotency keys" ON public.idempotency_keys FOR SELECT USING (auth.uid() = user_id);


-- ====================================================================
-- 6. ATOMIC STORED PROCEDURES (RPCS) WITH ROW-LEVEL LOCKING & DOUBLE-SPEND PROTECTION
-- ====================================================================

-- 6.1 ATOMIC SEND GIFT
CREATE OR REPLACE FUNCTION public.rpc_send_gift(
    p_receiver_id UUID,
    p_gift_id TEXT,
    p_gift_name TEXT,
    p_coin_cost INTEGER,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_sender_id UUID := auth.uid();
  v_sender_coins INTEGER;
  v_rec_coins INTEGER;
  v_streamer_share INTEGER;
  v_platform_fee INTEGER;
  v_gift_tx_id UUID;
  v_cached_response JSONB;
BEGIN
  IF v_sender_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '401 Unauthorized');
  END IF;

  IF v_sender_id = p_receiver_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot send gifts to yourself');
  END IF;

  IF p_coin_cost <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid gift coin cost');
  END IF;

  -- Idempotency Check (Prevent Double-Spending)
  IF p_idempotency_key IS NOT NULL THEN
    SELECT response INTO v_cached_response FROM public.idempotency_keys WHERE key = p_idempotency_key AND user_id = v_sender_id;
    IF v_cached_response IS NOT NULL THEN
      RETURN v_cached_response;
    END IF;
  END IF;

  -- Lock Sender Wallet row
  SELECT coins INTO v_sender_coins FROM public.wallets WHERE user_id = v_sender_id FOR UPDATE;
  IF v_sender_coins IS NULL OR v_sender_coins < p_coin_cost THEN
    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_FUNDS', 'current_coins', COALESCE(v_sender_coins, 0));
  END IF;

  -- Ensure Receiver Wallet row exists & lock
  INSERT INTO public.wallets (user_id, coins, usdt_balance)
  VALUES (p_receiver_id, 0, 0.0)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT coins INTO v_rec_coins FROM public.wallets WHERE user_id = p_receiver_id FOR UPDATE;

  -- 70% to streamer, 30% platform fee
  v_streamer_share := FLOOR(p_coin_cost * 0.70);
  v_platform_fee := p_coin_cost - v_streamer_share;

  -- Deduct from sender
  UPDATE public.wallets SET coins = coins - p_coin_cost WHERE user_id = v_sender_id;

  -- Credit to receiver
  UPDATE public.wallets SET coins = coins + v_streamer_share WHERE user_id = p_receiver_id;

  -- Record Gift Transaction
  INSERT INTO public.gift_transactions (sender_id, receiver_id, gift_id, gift_name, coin_cost, streamer_coins, platform_fee_coins)
  VALUES (v_sender_id, p_receiver_id, p_gift_id, p_gift_name, p_coin_cost, v_streamer_share, v_platform_fee)
  RETURNING id INTO v_gift_tx_id;

  -- Record Sender Transaction
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (v_sender_id, 'send_gift', -p_coin_cost, 0.0, 'Sent gift: ' || p_gift_name);

  -- Record Receiver Transaction
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (p_receiver_id, 'receive_gift', v_streamer_share, 0.0, 'Received gift: ' || p_gift_name);

  v_cached_response := jsonb_build_object(
    'success', true,
    'new_coins', v_sender_coins - p_coin_cost,
    'streamer_earned', v_streamer_share,
    'gift_tx_id', v_gift_tx_id
  );

  -- Store Idempotency
  IF p_idempotency_key IS NOT NULL THEN
    INSERT INTO public.idempotency_keys (key, user_id, response)
    VALUES (p_idempotency_key, v_sender_id, v_cached_response)
    ON CONFLICT (key) DO NOTHING;
  END IF;

  RETURN v_cached_response;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6.2 ATOMIC PURCHASE VIP
CREATE OR REPLACE FUNCTION public.rpc_purchase_vip(
    p_plan TEXT,
    p_duration_months INTEGER,
    p_coin_cost INTEGER,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_user_coins INTEGER;
  v_expires_at TIMESTAMP WITH TIME ZONE;
  v_cached_response JSONB;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '401 Unauthorized');
  END IF;

  IF p_coin_cost < 0 OR p_duration_months <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid VIP parameters');
  END IF;

  -- Idempotency Check
  IF p_idempotency_key IS NOT NULL THEN
    SELECT response INTO v_cached_response FROM public.idempotency_keys WHERE key = p_idempotency_key AND user_id = v_user_id;
    IF v_cached_response IS NOT NULL THEN
      RETURN v_cached_response;
    END IF;
  END IF;

  -- Lock Wallet
  SELECT coins INTO v_user_coins FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
  IF v_user_coins IS NULL OR v_user_coins < p_coin_cost THEN
    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_FUNDS', 'current_coins', COALESCE(v_user_coins, 0));
  END IF;

  -- Calculate expiration date
  v_expires_at := timezone('utc'::text, now()) + (p_duration_months || ' months')::interval;

  -- Deduct coins
  IF p_coin_cost > 0 THEN
    UPDATE public.wallets SET coins = coins - p_coin_cost WHERE user_id = v_user_id;
  END IF;

  -- Update Profile VIP Status (bypass user trigger via security definer)
  UPDATE public.profiles 
  SET is_vip = true, 
      vip_plan = p_plan,
      vip_expires_at = v_expires_at 
  WHERE id = v_user_id;

  -- Record VIP Subscription
  INSERT INTO public.vip_subscriptions (user_id, plan, duration_months, price_coins, expires_at)
  VALUES (v_user_id, p_plan, p_duration_months, p_coin_cost, v_expires_at);

  -- Record Transaction
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (v_user_id, 'buy_vip', -p_coin_cost, 0.0, 'Purchased VIP Plan: ' || p_plan || ' (' || p_duration_months || ' months)');

  v_cached_response := jsonb_build_object(
    'success', true,
    'new_coins', v_user_coins - p_coin_cost,
    'vip_plan', p_plan,
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


-- 6.3 ATOMIC REQUEST PAYOUT (WITHDRAWAL)
CREATE OR REPLACE FUNCTION public.rpc_request_payout(
    p_amount_usdt NUMERIC,
    p_method TEXT,
    p_destination_address TEXT,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_current_usdt NUMERIC;
  v_payout_id UUID;
  v_cached_response JSONB;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '401 Unauthorized');
  END IF;

  IF p_amount_usdt < 50.0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Minimum withdrawal amount is 50 USDT');
  END IF;

  IF TRIM(COALESCE(p_destination_address, '')) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Destination wallet address is required');
  END IF;

  -- Idempotency Check
  IF p_idempotency_key IS NOT NULL THEN
    SELECT response INTO v_cached_response FROM public.idempotency_keys WHERE key = p_idempotency_key AND user_id = v_user_id;
    IF v_cached_response IS NOT NULL THEN
      RETURN v_cached_response;
    END IF;
  END IF;

  -- Lock Wallet
  SELECT usdt_balance INTO v_current_usdt FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
  IF v_current_usdt IS NULL OR v_current_usdt < p_amount_usdt THEN
    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_USDT_BALANCE', 'current_usdt', COALESCE(v_current_usdt, 0.0));
  END IF;

  -- Deduct USDT balance immediately to prevent double-spending
  UPDATE public.wallets SET usdt_balance = usdt_balance - p_amount_usdt WHERE user_id = v_user_id;

  -- Insert Payout Request
  INSERT INTO public.payout_requests (user_id, amount_usdt, method, destination_address, status)
  VALUES (v_user_id, p_amount_usdt, p_method, p_destination_address, 'Pending')
  RETURNING id INTO v_payout_id;

  -- Record Transaction
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (v_user_id, 'withdraw', 0, -p_amount_usdt, 'Withdrawal request to ' || p_method || ' (' || SUBSTRING(p_destination_address, 1, 8) || '...)');

  v_cached_response := jsonb_build_object(
    'success', true,
    'new_usdt_balance', v_current_usdt - p_amount_usdt,
    'payout_id', v_payout_id,
    'status', 'Pending'
  );

  IF p_idempotency_key IS NOT NULL THEN
    INSERT INTO public.idempotency_keys (key, user_id, response)
    VALUES (p_idempotency_key, v_user_id, v_cached_response)
    ON CONFLICT (key) DO NOTHING;
  END IF;

  RETURN v_cached_response;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6.4 ATOMIC CONVERT COINS TO USDT
CREATE OR REPLACE FUNCTION public.rpc_convert_coins_to_usdt(
    p_coins INTEGER,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_current_coins INTEGER;
  v_current_usdt NUMERIC;
  v_usdt_converted NUMERIC;
  v_cached_response JSONB;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '401 Unauthorized');
  END IF;

  IF p_coins < 100 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Minimum 100 coins required for conversion');
  END IF;

  -- Rate: 50 coins = 1 USDT
  v_usdt_converted := ROUND((p_coins / 50.0)::numeric, 2);

  -- Idempotency Check
  IF p_idempotency_key IS NOT NULL THEN
    SELECT response INTO v_cached_response FROM public.idempotency_keys WHERE key = p_idempotency_key AND user_id = v_user_id;
    IF v_cached_response IS NOT NULL THEN
      RETURN v_cached_response;
    END IF;
  END IF;

  -- Lock Wallet
  SELECT coins, usdt_balance INTO v_current_coins, v_current_usdt FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
  IF v_current_coins IS NULL OR v_current_coins < p_coins THEN
    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_FUNDS', 'current_coins', COALESCE(v_current_coins, 0));
  END IF;

  -- Update balances
  UPDATE public.wallets 
  SET coins = coins - p_coins,
      usdt_balance = usdt_balance + v_usdt_converted
  WHERE user_id = v_user_id;

  -- Record Transaction
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (v_user_id, 'convert', -p_coins, v_usdt_converted, 'Converted ' || p_coins || ' coins to $' || v_usdt_converted || ' USDT');

  v_cached_response := jsonb_build_object(
    'success', true,
    'new_coins', v_current_coins - p_coins,
    'new_usdt_balance', v_current_usdt + v_usdt_converted,
    'converted_usdt', v_usdt_converted
  );

  IF p_idempotency_key IS NOT NULL THEN
    INSERT INTO public.idempotency_keys (key, user_id, response)
    VALUES (p_idempotency_key, v_user_id, v_cached_response)
    ON CONFLICT (key) DO NOTHING;
  END IF;

  RETURN v_cached_response;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6.5 ATOMIC CHARGE CALL MINUTE
CREATE OR REPLACE FUNCTION public.rpc_charge_call_minute(
    p_session_id TEXT,
    p_receiver_id UUID,
    p_tariff_rate INTEGER,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID := auth.uid();
  v_caller_coins INTEGER;
  v_receiver_share INTEGER;
  v_cached_response JSONB;
BEGIN
  IF v_caller_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '401 Unauthorized');
  END IF;

  IF p_tariff_rate <= 0 THEN
    RETURN jsonb_build_object('success', true, 'charged', 0);
  END IF;

  -- Idempotency Check
  IF p_idempotency_key IS NOT NULL THEN
    SELECT response INTO v_cached_response FROM public.idempotency_keys WHERE key = p_idempotency_key AND user_id = v_caller_id;
    IF v_cached_response IS NOT NULL THEN
      RETURN v_cached_response;
    END IF;
  END IF;

  -- Lock Caller Wallet
  SELECT coins INTO v_caller_coins FROM public.wallets WHERE user_id = v_caller_id FOR UPDATE;
  IF v_caller_coins IS NULL OR v_caller_coins < p_tariff_rate THEN
    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_FUNDS');
  END IF;

  -- 80% to receiver
  v_receiver_share := FLOOR(p_tariff_rate * 0.80);

  -- Deduct from caller
  UPDATE public.wallets SET coins = coins - p_tariff_rate WHERE user_id = v_caller_id;

  -- Credit to receiver
  IF p_receiver_id IS NOT NULL THEN
    INSERT INTO public.wallets (user_id, coins, usdt_balance)
    VALUES (p_receiver_id, 0, 0.0)
    ON CONFLICT (user_id) DO NOTHING;

    UPDATE public.wallets SET coins = coins + v_receiver_share WHERE user_id = p_receiver_id;

    INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
    VALUES (p_receiver_id, 'receive_call_income', v_receiver_share, 0.0, 'Earnings from private call (' || p_session_id || ')');
  END IF;

  -- Record caller transaction
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (v_caller_id, 'paid_call_minute', -p_tariff_rate, 0.0, 'Private call rate (' || p_session_id || ')');

  v_cached_response := jsonb_build_object(
    'success', true,
    'new_coins', v_caller_coins - p_tariff_rate,
    'charged_coins', p_tariff_rate
  );

  IF p_idempotency_key IS NOT NULL THEN
    INSERT INTO public.idempotency_keys (key, user_id, response)
    VALUES (p_idempotency_key, v_caller_id, v_cached_response)
    ON CONFLICT (key) DO NOTHING;
  END IF;

  RETURN v_cached_response;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6.6 ADMIN PROCESS PAYOUT (APPROVE / REJECT WITH REFUND)
CREATE OR REPLACE FUNCTION public.rpc_admin_process_payout(
    p_payout_id UUID,
    p_new_status TEXT,
    p_admin_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_payout RECORD;
BEGIN
  IF NOT public.is_admin_user() AND current_user != 'service_role' THEN
    RETURN jsonb_build_object('success', false, 'error', '403 Forbidden: Admin privileges required.');
  END IF;

  SELECT * INTO v_payout FROM public.payout_requests WHERE id = p_payout_id FOR UPDATE;
  IF v_payout IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payout request not found');
  END IF;

  IF v_payout.status != 'Pending' AND v_payout.status != 'Processing' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payout already processed');
  END IF;

  IF p_new_status = 'Rejected' THEN
    -- Refund USDT balance back to user's wallet
    UPDATE public.wallets SET usdt_balance = usdt_balance + v_payout.amount_usdt WHERE user_id = v_payout.user_id;

    INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
    VALUES (v_payout.user_id, 'refund_payout', 0, v_payout.amount_usdt, 'Refunded rejected payout request (' || p_payout_id || ')');
  END IF;

  UPDATE public.payout_requests 
  SET status = p_new_status,
      admin_notes = COALESCE(p_admin_notes, admin_notes),
      updated_at = timezone('utc'::text, now())
  WHERE id = p_payout_id;

  RETURN jsonb_build_object('success', true, 'payout_id', p_payout_id, 'status', p_new_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
