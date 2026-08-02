-- 1. CLEAN ORPHAN DATA SAFELY & ALTER COLUMNS TO UUID (only if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'posts') THEN
        EXECUTE 'DELETE FROM public.posts t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.user_id::text)';
        EXECUTE 'ALTER TABLE public.posts ALTER COLUMN user_id TYPE UUID USING NULLIF(user_id::text, '''')::uuid';
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'streams') THEN
        EXECUTE 'DELETE FROM public.streams t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.host_id::text)';
        EXECUTE 'ALTER TABLE public.streams ALTER COLUMN host_id TYPE UUID USING NULLIF(host_id::text, '''')::uuid';
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'wallets') THEN
        EXECUTE 'DELETE FROM public.wallets t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.user_id::text)';
        EXECUTE 'ALTER TABLE public.wallets ALTER COLUMN user_id TYPE UUID USING NULLIF(user_id::text, '''')::uuid';
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'stories') THEN
        EXECUTE 'DELETE FROM public.stories t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.user_id::text)';
        EXECUTE 'ALTER TABLE public.stories ALTER COLUMN user_id TYPE UUID USING NULLIF(user_id::text, '''')::uuid';
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'conversations') THEN
        EXECUTE 'DELETE FROM public.conversations t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.user1_id::text) OR NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.user2_id::text)';
        EXECUTE 'ALTER TABLE public.conversations ALTER COLUMN user1_id TYPE UUID USING NULLIF(user1_id::text, '''')::uuid';
        EXECUTE 'ALTER TABLE public.conversations ALTER COLUMN user2_id TYPE UUID USING NULLIF(user2_id::text, '''')::uuid';
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'messages') THEN
        EXECUTE 'DELETE FROM public.messages t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.sender_id::text)';
        EXECUTE 'ALTER TABLE public.messages ALTER COLUMN sender_id TYPE UUID USING NULLIF(sender_id::text, '''')::uuid';
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'followers') THEN
        EXECUTE 'DELETE FROM public.followers t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.follower_id::text) OR NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.following_id::text)';
        EXECUTE 'ALTER TABLE public.followers ALTER COLUMN follower_id TYPE UUID USING NULLIF(follower_id::text, '''')::uuid';
        EXECUTE 'ALTER TABLE public.followers ALTER COLUMN following_id TYPE UUID USING NULLIF(following_id::text, '''')::uuid';
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
        EXECUTE 'DELETE FROM public.notifications t WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id::text = t.user_id::text)';
        EXECUTE 'ALTER TABLE public.notifications ALTER COLUMN user_id TYPE UUID USING NULLIF(user_id::text, '''')::uuid';
    END IF;
END $$;

-- 2. CREATE MISSING TABLES IF THEY DONT EXIST
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now() + interval '24 hours') NOT NULL
);

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user1_id, user2_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.followers (
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ENABLE RLS & POLICIES
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Stories viewable by everyone" ON public.stories;
CREATE POLICY "Stories viewable by everyone" ON public.stories FOR SELECT USING ( true );

DROP POLICY IF EXISTS "Users can insert own stories" ON public.stories;
CREATE POLICY "Users can insert own stories" ON public.stories FOR INSERT WITH CHECK ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING ( auth.uid() IN (user1_id, user2_id) );

DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.messages;
CREATE POLICY "Users can view messages in own conversations" ON public.messages FOR SELECT USING ( 
    EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND auth.uid() IN (c.user1_id, c.user2_id))
);

DROP POLICY IF EXISTS "Followers viewable by everyone" ON public.followers;
CREATE POLICY "Followers viewable by everyone" ON public.followers FOR SELECT USING ( true );

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING ( auth.uid() = user_id );

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
