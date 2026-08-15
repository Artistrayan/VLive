CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    tx_type TEXT NOT NULL, -- 'buy_coins', 'send_gift', 'receive_gift', 'convert', 'withdraw'
    amount_coins INTEGER DEFAULT 0,
    amount_usdt NUMERIC DEFAULT 0.0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own wallets for now (mock payment gateway)
DROP POLICY IF EXISTS "Users can update own wallet" ON public.wallets;
CREATE POLICY "Users can update own wallet" ON public.wallets FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Ensure wallets exist for all profiles (data integrity)
INSERT INTO public.wallets (user_id, coins, usdt_balance)
SELECT id, 0, 0.0 FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;
