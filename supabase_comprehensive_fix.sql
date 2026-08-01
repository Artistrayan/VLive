-- 1. ADD MISSING INSERT/UPDATE POLICIES FOR WALLETS
DROP POLICY IF EXISTS "Users can insert own wallet." ON public.wallets;
CREATE POLICY "Users can insert own wallet." ON public.wallets FOR INSERT WITH CHECK ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can update own wallet." ON public.wallets;
CREATE POLICY "Users can update own wallet." ON public.wallets FOR UPDATE USING ( auth.uid() = user_id );

-- 2. ADD MISSING INSERT/UPDATE POLICIES FOR PROFILES
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING ( auth.uid() = id );

-- 3. ENSURE EMAIL CONFIRMATION IS DISABLED IF USING FAKE EMAILS
-- (Note: You must disable "Confirm Email" in Supabase Auth Settings manually)

-- 4. CLEAN ORPHAN DATA IN ALL RELEVANT TABLES
DELETE FROM public.posts WHERE user_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.streams WHERE host_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.wallets WHERE user_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.stories WHERE user_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.conversations WHERE user1_id NOT IN (SELECT id FROM public.profiles) OR user2_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.messages WHERE sender_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.followers WHERE follower_id NOT IN (SELECT id FROM public.profiles) OR following_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.notifications WHERE user_id NOT IN (SELECT id FROM public.profiles);

-- Also remove ghost auth users who do not have a profile, if you want. 
-- (Optional, but safe if your app creates them simultaneously).
-- DELETE FROM auth.users WHERE id NOT IN (SELECT id FROM public.profiles);

-- 5. CREATE A ROBUST TRIGGER TO AUTOMATICALLY CREATE PROFILE & WALLET ON SIGNUP
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

