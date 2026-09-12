-- ====================================================================
-- MIGRATION 11: COMPREHENSIVE FINANCIAL SECURITY, STRICT RLS & ATOMIC RPCS
-- ====================================================================

-- 1. OFFICIAL SERVER GIFT CATALOG (SINGLE SOURCE OF TRUTH FOR PRICES)
CREATE TABLE IF NOT EXISTS public.gift_catalog (
    gift_id TEXT PRIMARY KEY,
    gift_name TEXT NOT NULL,
    coin_cost INTEGER NOT NULL CHECK (coin_cost > 0),
    streamer_share_percent INTEGER DEFAULT 70 NOT NULL CHECK (streamer_share_percent BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.gift_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view gift catalog" ON public.gift_catalog;
CREATE POLICY "Anyone can view gift catalog" ON public.gift_catalog FOR SELECT USING (true);

-- Populate official gift catalog with authoritative prices
INSERT INTO public.gift_catalog (gift_id, gift_name, coin_cost, streamer_share_percent) VALUES
('g_heart', 'Heart ❤️', 10, 70),
('g_like', 'Like 👍', 20, 70),
('g_rose', 'Rose 🌹', 50, 70),
('g_coffee', 'Coffee ☕', 100, 70),
('g_chocolate', 'Chocolate 🍫', 250, 70),
('g_bouquet', 'Flower Bouquet 💐', 500, 70),
('g_crown', 'Crown 👑', 1000, 70),
('g_diamond', 'Diamond Gift 💎', 2500, 70),
('g_luxury', 'Luxury Gift 🎁', 5000, 70),
('g_car', 'Premium Car 🏎️', 10000, 70),
('g_super', 'Super Gift 🚀', 25000, 70),
-- Aliases from appConstants
('heart', 'Red Heart', 50, 70),
('kiss', 'Magic Sparkles', 100, 70),
('teddy', 'Warm Smile', 250, 70),
('ring', 'Gold Ring', 1000, 70),
('champagne', 'Celebration Wine', 1500, 70),
('sports_car', 'Sports Car', 5000, 70),
('supercar', 'VIP Supercar', 8000, 70),
('gold_bar', 'Gold Vault', 10000, 70),
('jet', 'Private Jet', 15000, 70),
('yacht', 'Luxury Yacht', 20000, 70),
('castle', 'Golden Fortress', 25000, 70),
('rocket', 'Space Rocket', 30000, 70),
('fireworks', 'VIP Fireworks', 35000, 70),
('phoenix', 'Fire Phoenix', 40000, 70),
('dragon', 'Golden Dragon', 50000, 70),
('galaxy', 'Cosmic Galaxy', 75000, 70),
('vip_star', 'Platinum Star', 100000, 70)
ON CONFLICT (gift_id) DO UPDATE 
SET gift_name = EXCLUDED.gift_name,
    coin_cost = EXCLUDED.coin_cost,
    streamer_share_percent = EXCLUDED.streamer_share_percent;


-- 2. ADMIN AUDIT LOGS TABLE FOR FINANCIAL TRACEABILITY
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    amount_coins INTEGER DEFAULT 0,
    amount_usdt NUMERIC DEFAULT 0.0,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs FOR SELECT USING (public.is_admin_user());


-- 3. AUTOMATIC USER WALLET INITIALIZATION TRIGGER
CREATE OR REPLACE FUNCTION public.trg_initialize_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id, coins, usdt_balance)
  VALUES (NEW.id, 0, 0.0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_init_wallet ON public.profiles;
CREATE TRIGGER trg_init_wallet
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.trg_initialize_user_wallet();


-- 4. STRICT RLS POLICIES FOR FINANCIAL TABLES (NO DIRECT CLIENT WRITES)
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can update own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can insert own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can delete own wallet" ON public.wallets;

CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id OR public.is_admin_user());

-- Ensure non-negative check constraints on wallets
ALTER TABLE public.wallets DROP CONSTRAINT IF EXISTS wallets_coins_non_negative;
ALTER TABLE public.wallets ADD CONSTRAINT wallets_coins_non_negative CHECK (coins >= 0);

ALTER TABLE public.wallets DROP CONSTRAINT IF EXISTS wallets_usdt_non_negative;
ALTER TABLE public.wallets ADD CONSTRAINT wallets_usdt_non_negative CHECK (usdt_balance >= 0.0);


ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;

CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id OR public.is_admin_user());
-- Direct client inserts/updates/deletes on transactions are completely BLOCKED! All inserts occur via SECURITY DEFINER RPCs.


ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payouts" ON public.payout_requests;
DROP POLICY IF EXISTS "Users can insert own payouts" ON public.payout_requests;
DROP POLICY IF EXISTS "Admins can update payouts" ON public.payout_requests;

CREATE POLICY "Users can view own payouts" ON public.payout_requests FOR SELECT USING (auth.uid() = user_id OR public.is_admin_user());


-- 5. ATOMIC STORED PROCEDURES (RPCS)

-- 5.1 SECURE RPC: SEND GIFT (Server resolves price from catalog, client CANNOT send price)
CREATE OR REPLACE FUNCTION public.rpc_send_gift(
    p_receiver_id UUID,
    p_gift_id TEXT,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_sender_id UUID := auth.uid();
  v_gift RECORD;
  v_sender_coins INTEGER;
  v_streamer_share INTEGER;
  v_platform_fee INTEGER;
  v_gift_tx_id UUID;
  v_cached_response JSONB;
BEGIN
  IF v_sender_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '401 Unauthorized: Valid session required');
  END IF;

  IF v_sender_id = p_receiver_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot send gifts to yourself');
  END IF;

  -- Idempotency Check
  IF p_idempotency_key IS NOT NULL THEN
    SELECT response INTO v_cached_response FROM public.idempotency_keys WHERE key = p_idempotency_key AND user_id = v_sender_id;
    IF v_cached_response IS NOT NULL THEN
      RETURN v_cached_response;
    END IF;
  END IF;

  -- Resolve authoritative price from server catalog
  SELECT * INTO v_gift FROM public.gift_catalog WHERE gift_id = p_gift_id;
  IF v_gift IS NULL THEN
    -- Fallback for legacy gift IDs if not in catalog: default price 50
    v_gift := ROW(p_gift_id, 'Gift', 50, 70, now())::public.gift_catalog;
  END IF;

  -- Lock Sender Wallet Row
  SELECT coins INTO v_sender_coins FROM public.wallets WHERE user_id = v_sender_id FOR UPDATE;
  IF v_sender_coins IS NULL OR v_sender_coins < v_gift.coin_cost THEN
    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_FUNDS', 'current_coins', COALESCE(v_sender_coins, 0), 'required_coins', v_gift.coin_cost);
  END IF;

  -- Ensure Receiver Wallet Row exists and Lock
  INSERT INTO public.wallets (user_id, coins, usdt_balance)
  VALUES (p_receiver_id, 0, 0.0)
  ON CONFLICT (user_id) DO NOTHING;

  PERFORM 1 FROM public.wallets WHERE user_id = p_receiver_id FOR UPDATE;

  -- Calculate shares
  v_streamer_share := FLOOR((v_gift.coin_cost * v_gift.streamer_share_percent) / 100.0);
  v_platform_fee := v_gift.coin_cost - v_streamer_share;

  -- Atomic update: Deduct from sender, Credit receiver
  UPDATE public.wallets SET coins = coins - v_gift.coin_cost WHERE user_id = v_sender_id;
  UPDATE public.wallets SET coins = coins + v_streamer_share WHERE user_id = p_receiver_id;

  -- Record Gift Transaction
  INSERT INTO public.gift_transactions (sender_id, receiver_id, gift_id, gift_name, coin_cost, streamer_coins, platform_fee_coins)
  VALUES (v_sender_id, p_receiver_id, v_gift.gift_id, v_gift.gift_name, v_gift.coin_cost, v_streamer_share, v_platform_fee)
  RETURNING id INTO v_gift_tx_id;

  -- Record Sender Transaction
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (v_sender_id, 'send_gift', -v_gift.coin_cost, 0.0, 'Sent gift: ' || v_gift.gift_name);

  -- Record Receiver Transaction
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (p_receiver_id, 'receive_gift', v_streamer_share, 0.0, 'Received gift: ' || v_gift.gift_name);

  v_cached_response := jsonb_build_object(
    'success', true,
    'new_coins', v_sender_coins - v_gift.coin_cost,
    'gift_cost', v_gift.coin_cost,
    'streamer_earned', v_streamer_share,
    'gift_tx_id', v_gift_tx_id
  );

  IF p_idempotency_key IS NOT NULL THEN
    INSERT INTO public.idempotency_keys (key, user_id, response)
    VALUES (p_idempotency_key, v_sender_id, v_cached_response)
    ON CONFLICT (key) DO NOTHING;
  END IF;

  RETURN v_cached_response;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5.2 SECURE RPC: SEND TIP (Server validates amount and policy)
CREATE OR REPLACE FUNCTION public.rpc_send_tip(
    p_receiver_id UUID,
    p_amount_coins INTEGER,
    p_message TEXT DEFAULT NULL,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_sender_id UUID := auth.uid();
  v_sender_coins INTEGER;
  v_streamer_share INTEGER;
  v_platform_fee INTEGER;
  v_cached_response JSONB;
BEGIN
  IF v_sender_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '401 Unauthorized');
  END IF;

  IF v_sender_id = p_receiver_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot tip yourself');
  END IF;

  IF p_amount_coins IS NULL OR p_amount_coins <= 0 OR p_amount_coins > 1000000 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid tip amount');
  END IF;

  -- Idempotency Check
  IF p_idempotency_key IS NOT NULL THEN
    SELECT response INTO v_cached_response FROM public.idempotency_keys WHERE key = p_idempotency_key AND user_id = v_sender_id;
    IF v_cached_response IS NOT NULL THEN
      RETURN v_cached_response;
    END IF;
  END IF;

  -- Lock Sender Wallet
  SELECT coins INTO v_sender_coins FROM public.wallets WHERE user_id = v_sender_id FOR UPDATE;
  IF v_sender_coins IS NULL OR v_sender_coins < p_amount_coins THEN
    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_FUNDS', 'current_coins', COALESCE(v_sender_coins, 0));
  END IF;

  -- Lock Receiver Wallet
  INSERT INTO public.wallets (user_id, coins, usdt_balance)
  VALUES (p_receiver_id, 0, 0.0)
  ON CONFLICT (user_id) DO NOTHING;

  PERFORM 1 FROM public.wallets WHERE user_id = p_receiver_id FOR UPDATE;

  -- 80% to streamer, 20% platform fee
  v_streamer_share := FLOOR(p_amount_coins * 0.80);
  v_platform_fee := p_amount_coins - v_streamer_share;

  -- Deduct & Credit
  UPDATE public.wallets SET coins = coins - p_amount_coins WHERE user_id = v_sender_id;
  UPDATE public.wallets SET coins = coins + v_streamer_share WHERE user_id = p_receiver_id;

  -- Record Transactions
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (v_sender_id, 'send_tip', -p_amount_coins, 0.0, 'Tip sent: ' || COALESCE(p_message, 'Support Tip'));

  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (p_receiver_id, 'receive_tip', v_streamer_share, 0.0, 'Tip received');

  v_cached_response := jsonb_build_object(
    'success', true,
    'new_coins', v_sender_coins - p_amount_coins,
    'tipped_amount', p_amount_coins,
    'streamer_earned', v_streamer_share
  );

  IF p_idempotency_key IS NOT NULL THEN
    INSERT INTO public.idempotency_keys (key, user_id, response)
    VALUES (p_idempotency_key, v_sender_id, v_cached_response)
    ON CONFLICT (key) DO NOTHING;
  END IF;

  RETURN v_cached_response;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5.3 SECURE RPC: PURCHASE VIP (Server resolves price from plan catalog)
CREATE OR REPLACE FUNCTION public.rpc_purchase_vip(
    p_plan TEXT,
    p_duration_months INTEGER DEFAULT 1,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_user_coins INTEGER;
  v_official_price INTEGER;
  v_expires_at TIMESTAMP WITH TIME ZONE;
  v_cached_response JSONB;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '401 Unauthorized');
  END IF;

  -- Authoritative server pricing lookup (Client CANNOT set price)
  IF p_plan = 'monthly' OR p_plan = 'VIP Monthly' THEN
    v_official_price := 499; p_duration_months := 1;
  ELSIF p_plan = 'threeMonths' OR p_plan = 'VIP 3 Months' THEN
    v_official_price := 1299; p_duration_months := 3;
  ELSIF p_plan = 'sixMonths' OR p_plan = 'VIP 6 Months' THEN
    v_official_price := 2299; p_duration_months := 6;
  ELSIF p_plan = 'yearly' OR p_plan = 'VIP Yearly' THEN
    v_official_price := 3999; p_duration_months := 12;
  ELSIF p_plan = 'adult_monthly' OR p_plan = 'Adult VIP Monthly' THEN
    v_official_price := 799; p_duration_months := 1;
  ELSIF p_plan = 'adult_threeMonths' OR p_plan = 'Adult VIP 3 Months' THEN
    v_official_price := 2099; p_duration_months := 3;
  ELSIF p_plan = 'adult_sixMonths' OR p_plan = 'Adult VIP 6 Months' THEN
    v_official_price := 3799; p_duration_months := 6;
  ELSIF p_plan = 'adult_yearly' OR p_plan = 'Adult VIP Yearly' THEN
    v_official_price := 6499; p_duration_months := 12;
  ELSE
    v_official_price := 499; p_duration_months := 1;
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
  IF v_user_coins IS NULL OR v_user_coins < v_official_price THEN
    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_FUNDS', 'current_coins', COALESCE(v_user_coins, 0), 'required_coins', v_official_price);
  END IF;

  v_expires_at := timezone('utc'::text, now()) + (p_duration_months || ' months')::interval;

  -- Deduct coins
  UPDATE public.wallets SET coins = coins - v_official_price WHERE user_id = v_user_id;

  -- Update Profile VIP Status
  UPDATE public.profiles 
  SET is_vip = true, 
      vip_plan = p_plan,
      vip_expires_at = v_expires_at 
  WHERE id = v_user_id;

  -- Record VIP Subscription & Transaction
  INSERT INTO public.vip_subscriptions (user_id, plan, duration_months, price_coins, expires_at)
  VALUES (v_user_id, p_plan, p_duration_months, v_official_price, v_expires_at);

  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (v_user_id, 'buy_vip', -v_official_price, 0.0, 'Purchased VIP Plan: ' || p_plan || ' (' || p_duration_months || ' months)');

  v_cached_response := jsonb_build_object(
    'success', true,
    'new_coins', v_user_coins - v_official_price,
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


-- 5.4 SECURE RPC: CHARGE CALL MINUTE (Server resolves call rate from call_type)
CREATE OR REPLACE FUNCTION public.rpc_charge_call_minute(
    p_session_id TEXT,
    p_call_type TEXT,
    p_receiver_id UUID DEFAULT NULL,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID := auth.uid();
  v_caller_coins INTEGER;
  v_tariff_rate INTEGER;
  v_receiver_share INTEGER;
  v_cached_response JSONB;
BEGIN
  IF v_caller_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '401 Unauthorized');
  END IF;

  -- Server resolves official tariff rate (Client CANNOT send rate)
  IF p_call_type = 'audio' OR p_call_type = 'voice' THEN
    v_tariff_rate := 15;
  ELSIF p_call_type = 'adult_video' THEN
    v_tariff_rate := 40;
  ELSE
    v_tariff_rate := 30; -- standard video call
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
  IF v_caller_coins IS NULL OR v_caller_coins < v_tariff_rate THEN
    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_FUNDS', 'current_coins', COALESCE(v_caller_coins, 0));
  END IF;

  -- 80% to receiver
  v_receiver_share := FLOOR(v_tariff_rate * 0.80);

  -- Deduct from caller
  UPDATE public.wallets SET coins = coins - v_tariff_rate WHERE user_id = v_caller_id;

  -- Credit receiver if provided
  IF p_receiver_id IS NOT NULL AND p_receiver_id != v_caller_id THEN
    INSERT INTO public.wallets (user_id, coins, usdt_balance)
    VALUES (p_receiver_id, 0, 0.0)
    ON CONFLICT (user_id) DO NOTHING;

    UPDATE public.wallets SET coins = coins + v_receiver_share WHERE user_id = p_receiver_id;

    INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
    VALUES (p_receiver_id, 'receive_call_income', v_receiver_share, 0.0, 'Earnings from private call (' || COALESCE(p_session_id, 'session') || ')');
  END IF;

  -- Record caller transaction
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (v_caller_id, 'paid_call_minute', -v_tariff_rate, 0.0, 'Private call charge (' || COALESCE(p_session_id, 'session') || ')');

  v_cached_response := jsonb_build_object(
    'success', true,
    'new_coins', v_caller_coins - v_tariff_rate,
    'charged_coins', v_tariff_rate
  );

  IF p_idempotency_key IS NOT NULL THEN
    INSERT INTO public.idempotency_keys (key, user_id, response)
    VALUES (p_idempotency_key, v_caller_id, v_cached_response)
    ON CONFLICT (key) DO NOTHING;
  END IF;

  RETURN v_cached_response;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5.5 SECURE RPC: PLAY MINIGAME (Server verifies outcome & caps prize)
CREATE OR REPLACE FUNCTION public.rpc_play_minigame(
    p_game_name TEXT,
    p_cost_coins INTEGER,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_user_coins INTEGER;
  v_won BOOLEAN;
  v_prize_coins INTEGER := 0;
  v_net_coins INTEGER;
  v_cached_response JSONB;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '401 Unauthorized');
  END IF;

  IF p_cost_coins IS NULL OR p_cost_coins <= 0 OR p_cost_coins > 10000 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid minigame cost amount');
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
  IF v_user_coins IS NULL OR v_user_coins < p_cost_coins THEN
    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_FUNDS', 'current_coins', COALESCE(v_user_coins, 0));
  END IF;

  -- Server-side random win determination (40% chance of winning 1.8x multiplier)
  v_won := (random() < 0.40);
  IF v_won THEN
    v_prize_coins := FLOOR(p_cost_coins * 1.8);
  ELSE
    v_prize_coins := 0;
  END IF;

  v_net_coins := v_prize_coins - p_cost_coins;

  -- Update wallet
  UPDATE public.wallets SET coins = coins + v_net_coins WHERE user_id = v_user_id;

  -- Record transaction
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (
    v_user_id, 
    CASE WHEN v_net_coins >= 0 THEN 'minigame_win' ELSE 'minigame_play' END, 
    v_net_coins, 
    0.0, 
    'MiniGame: ' || COALESCE(p_game_name, 'Game') || ' (Cost: ' || p_cost_coins || ', Won: ' || v_prize_coins || ')'
  );

  v_cached_response := jsonb_build_object(
    'success', true,
    'won', v_won,
    'cost_coins', p_cost_coins,
    'prize_coins', v_prize_coins,
    'net_coins', v_net_coins,
    'new_coins', v_user_coins + v_net_coins
  );

  IF p_idempotency_key IS NOT NULL THEN
    INSERT INTO public.idempotency_keys (key, user_id, response)
    VALUES (p_idempotency_key, v_user_id, v_cached_response)
    ON CONFLICT (key) DO NOTHING;
  END IF;

  RETURN v_cached_response;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5.6 SECURE RPC: ADMIN ADJUST WALLET WITH AUDIT TRAIL
CREATE OR REPLACE FUNCTION public.rpc_admin_adjust_wallet(
    p_target_user_id UUID,
    p_amount_coins INTEGER,
    p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_admin_id UUID := auth.uid();
  v_target_coins INTEGER;
BEGIN
  IF NOT public.is_admin_user() AND current_user != 'service_role' THEN
    RETURN jsonb_build_object('success', false, 'error', '403 Forbidden: Admin privileges required');
  END IF;

  -- Lock Target Wallet
  INSERT INTO public.wallets (user_id, coins, usdt_balance)
  VALUES (p_target_user_id, 0, 0.0)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT coins INTO v_target_coins FROM public.wallets WHERE user_id = p_target_user_id FOR UPDATE;

  IF (v_target_coins + p_amount_coins) < 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Adjustment would result in negative coin balance');
  END IF;

  -- Adjust wallet
  UPDATE public.wallets SET coins = coins + p_amount_coins WHERE user_id = p_target_user_id;

  -- Record Transaction
  INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
  VALUES (p_target_user_id, CASE WHEN p_amount_coins >= 0 THEN 'admin_deposit' ELSE 'admin_deduct' END, p_amount_coins, 0.0, 'Admin Adjustment: ' || COALESCE(p_reason, 'Manual Correction'));

  -- Record Audit Trail
  INSERT INTO public.admin_audit_logs (admin_id, action, target_user_id, amount_coins, reason)
  VALUES (v_admin_id, 'ADMIN_WALLET_ADJUSTMENT', p_target_user_id, p_amount_coins, p_reason);

  RETURN jsonb_build_object('success', true, 'target_user_id', p_target_user_id, 'new_coins', v_target_coins + p_amount_coins);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
