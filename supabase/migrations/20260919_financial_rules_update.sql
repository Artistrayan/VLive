-- 1. Add diamonds column to wallets if it doesn't exist
ALTER TABLE public.wallets ADD COLUMN IF NOT EXISTS diamonds INTEGER DEFAULT 0;

-- 2. Create table for tracking daily match calls
CREATE TABLE IF NOT EXISTS public.daily_match_calls (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    call_count INTEGER DEFAULT 0,
    last_reset TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.daily_match_calls ENABLE ROW LEVEL SECURITY;

-- 3. Update rpc_send_gift for 71/29 split
CREATE OR REPLACE FUNCTION public.rpc_send_gift(p_receiver_id UUID, p_gift_id UUID)
RETURNS VOID AS $$
DECLARE
    v_sender_id UUID := auth.uid();
    v_gift_price INTEGER;
    v_admin_id UUID := (SELECT id FROM public.profiles WHERE telegram_id = 8933698119);
    v_admin_share INTEGER;
    v_streamer_share INTEGER;
BEGIN
    SELECT price INTO v_gift_price FROM public.gifts WHERE id = p_gift_id;
    
    -- Split: 29% Admin, 71% Streamer
    v_admin_share := FLOOR(v_gift_price * 0.29);
    v_streamer_share := v_gift_price - v_admin_share;

    UPDATE public.wallets SET coins = coins - v_gift_price WHERE user_id = v_sender_id;
    UPDATE public.wallets SET diamonds = diamonds + v_streamer_share WHERE user_id = p_receiver_id;
    UPDATE public.wallets SET coins = coins + v_admin_share WHERE user_id = v_admin_id;
    
    INSERT INTO public.transactions (user_id, tx_type, amount_coins, description)
    VALUES (v_sender_id, 'send_gift', v_gift_price, 'Sent gift to ' || p_receiver_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update rpc_charge_call_minute for 20s free rule
-- p_is_first_20s: boolean (true if within first 20s, handled by client)
CREATE OR REPLACE FUNCTION public.rpc_charge_call_minute(p_receiver_id UUID, p_is_first_20s BOOLEAN)
RETURNS VOID AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_tariff_rate INTEGER := 100; -- Example rate per minute
    v_admin_id UUID := (SELECT id FROM public.profiles WHERE telegram_id = 8933698119);
BEGIN
    IF p_is_first_20s THEN
        RETURN; -- No charge for first 20s
    END IF;

    -- Charge caller, credit Admin
    UPDATE public.wallets SET coins = coins - v_tariff_rate WHERE user_id = v_caller_id;
    UPDATE public.wallets SET coins = coins + v_tariff_rate WHERE user_id = v_admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
