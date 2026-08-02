-- 1. DELETE FAKE/ORPHAN DATA SAFELY (Using explicit text casting to prevent operator errors)
DELETE FROM public.posts t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.user_id::text);
DELETE FROM public.streams t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.host_id::text);
DELETE FROM public.wallets t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.user_id::text);
DELETE FROM public.stories t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.user_id::text);
DELETE FROM public.conversations t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.user1_id::text) OR NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.user2_id::text);
DELETE FROM public.messages t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.sender_id::text);
DELETE FROM public.followers t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.follower_id::text) OR NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.following_id::text);
DELETE FROM public.notifications t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.user_id::text);

-- 2. ALTER COLUMNS TO UUID TO MATCH PROFILES (To prevent future type mismatch crashes)
ALTER TABLE public.posts ALTER COLUMN user_id TYPE UUID USING NULLIF(user_id::text, '')::uuid;
ALTER TABLE public.streams ALTER COLUMN host_id TYPE UUID USING NULLIF(host_id::text, '')::uuid;
ALTER TABLE public.wallets ALTER COLUMN user_id TYPE UUID USING NULLIF(user_id::text, '')::uuid;
ALTER TABLE public.stories ALTER COLUMN user_id TYPE UUID USING NULLIF(user_id::text, '')::uuid;
ALTER TABLE public.conversations ALTER COLUMN user1_id TYPE UUID USING NULLIF(user1_id::text, '')::uuid;
ALTER TABLE public.conversations ALTER COLUMN user2_id TYPE UUID USING NULLIF(user2_id::text, '')::uuid;
ALTER TABLE public.messages ALTER COLUMN sender_id TYPE UUID USING NULLIF(sender_id::text, '')::uuid;
ALTER TABLE public.followers ALTER COLUMN follower_id TYPE UUID USING NULLIF(follower_id::text, '')::uuid;
ALTER TABLE public.followers ALTER COLUMN following_id TYPE UUID USING NULLIF(following_id::text, '')::uuid;
ALTER TABLE public.notifications ALTER COLUMN user_id TYPE UUID USING NULLIF(user_id::text, '')::uuid;

-- 3. ENSURE INSERT POLICIES EXIST (To fix RLS errors on profile creation)
DROP POLICY IF EXISTS "Users can insert own wallet." ON public.wallets;
CREATE POLICY "Users can insert own wallet." ON public.wallets FOR INSERT WITH CHECK ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can update own wallet." ON public.wallets;
CREATE POLICY "Users can update own wallet." ON public.wallets FOR UPDATE USING ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING ( auth.uid() = id );

-- 4. FIX TRIGGER TO AUTOMATICALLY CREATE PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, username, name, avatar, status, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || extract(epoch from now())::text),
    COALESCE(NEW.raw_user_meta_data->>'name', 'Telegram User'),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'),
    'approved',
    'REAL_USER'
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    name = EXCLUDED.name,
    avatar = EXCLUDED.avatar;
  
  -- Insert default wallet
  INSERT INTO public.wallets (user_id, coins, usdt_balance)
  VALUES (NEW.id, 0, 0.0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
