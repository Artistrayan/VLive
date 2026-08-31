-- Migration 17: Crypto Deposits & USDT Verification
CREATE TABLE IF NOT EXISTS public.crypto_deposits (
    txid TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan TEXT NOT NULL,
    amount_usdt NUMERIC NOT NULL CHECK (amount_usdt > 0),
    recipient_address TEXT NOT NULL,
    token_contract TEXT NOT NULL,
    network TEXT NOT NULL DEFAULT 'TRON',
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crypto_deposits_user_id ON public.crypto_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_deposits_status ON public.crypto_deposits(status);
CREATE INDEX IF NOT EXISTS idx_crypto_deposits_created_at ON public.crypto_deposits(created_at);

-- RLS
ALTER TABLE public.crypto_deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deposits" 
ON public.crypto_deposits FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin_user());

-- No direct INSERT or UPDATE allowed for clients
DROP POLICY IF EXISTS "Users can insert own deposits" ON public.crypto_deposits;
DROP POLICY IF EXISTS "Users can update own deposits" ON public.crypto_deposits;

-- Create Secure RPC for USDT VIP processing
CREATE OR REPLACE FUNCTION public.rpc_process_usdt_vip(
    p_txid TEXT,
    p_user_id UUID,
    p_plan TEXT,
    p_duration_months INTEGER,
    p_amount_usdt NUMERIC,
    p_recipient TEXT,
    p_contract TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_monthly_base_price INTEGER;
    v_discount_multiplier NUMERIC;
    v_official_price_coins INTEGER;
    v_required_usdt NUMERIC;
    v_expires_at TIMESTAMP WITH TIME ZONE;
    v_plan_clean TEXT := LOWER(COALESCE(p_plan, 'gold'));
BEGIN
    -- 1. Ensure executed by service role only (backend endpoint auth)
    IF current_user != 'service_role' THEN
        RAISE EXCEPTION '403 Forbidden: Only backend service can execute this function';
    END IF;

    -- 2. Verify p_txid is unused by attempting INSERT
    -- (This guarantees atomicity and prevents Double Spend because txid is PRIMARY KEY)
    BEGIN
        INSERT INTO public.crypto_deposits (
            txid, user_id, plan, amount_usdt, recipient_address, token_contract, network, status, verified_at
        ) VALUES (
            p_txid, p_user_id, p_plan, p_amount_usdt, p_recipient, p_contract, 'TRON', 'Completed', now()
        );
    EXCEPTION WHEN unique_violation THEN
        RAISE EXCEPTION 'Double Spend Error: TXID % has already been used.', p_txid;
    END;

    -- 3. Calculate Official Pricing
    p_duration_months := COALESCE(p_duration_months, 1);
    IF p_duration_months < 1 THEN p_duration_months := 1; END IF;

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

    IF p_duration_months >= 12 THEN
        v_discount_multiplier := 0.60;
    ELSIF p_duration_months >= 6 THEN
        v_discount_multiplier := 0.75;
    ELSIF p_duration_months >= 3 THEN
        v_discount_multiplier := 0.85;
    ELSE
        v_discount_multiplier := 1.00;
    END IF;

    v_official_price_coins := ROUND(v_monthly_base_price * p_duration_months * v_discount_multiplier);
    -- 50 Coins = 1 USDT -> v_required_usdt = v_official_price_coins / 50.0
    v_required_usdt := v_official_price_coins / 50.0;

    -- 4. Verify Amount
    IF p_amount_usdt < v_required_usdt THEN
        -- Rollback deposit record
        DELETE FROM public.crypto_deposits WHERE txid = p_txid;
        RAISE EXCEPTION 'Insufficient Amount: Required % USDT, but received % USDT', v_required_usdt, p_amount_usdt;
    END IF;

    -- 5. Activate VIP
    v_expires_at := timezone('utc'::text, now()) + (p_duration_months || ' months')::interval;
    
    UPDATE public.profiles 
    SET is_vip = true, 
        vip_plan = v_plan_clean,
        vip_expires_at = v_expires_at 
    WHERE id = p_user_id;

    -- 6. Record VIP Subscription
    INSERT INTO public.vip_subscriptions (user_id, plan, duration_months, price_coins, expires_at)
    VALUES (p_user_id, v_plan_clean, p_duration_months, v_official_price_coins, v_expires_at);

    -- 7. Record Transaction
    INSERT INTO public.transactions (user_id, tx_type, amount_coins, amount_usdt, description)
    VALUES (p_user_id, 'buy_vip_usdt', 0, p_amount_usdt, 'VIP Plan via USDT: ' || UPPER(v_plan_clean) || ' (' || p_duration_months || ' months) TXID: ' || p_txid);

    RETURN jsonb_build_object(
        'success', true,
        'is_vip', true,
        'vip_plan', v_plan_clean,
        'duration_months', p_duration_months,
        'amount_usdt', p_amount_usdt,
        'expires_at', v_expires_at,
        'txid', p_txid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
