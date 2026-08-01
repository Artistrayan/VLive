-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar TEXT,
    bio TEXT,
    gender TEXT,
    location TEXT,
    birthday DATE,
    language TEXT DEFAULT 'en',
    privacy_show_gifts BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'approved',
    user_type TEXT DEFAULT 'REAL_USER',
    is_vip BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.profiles FOR SELECT
    USING ( true );

CREATE POLICY "Users can insert their own profile."
    ON public.profiles FOR INSERT
    WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
    ON public.profiles FOR UPDATE
    USING ( auth.uid() = id );

-- Create streams table
CREATE TABLE public.streams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    thumbnail TEXT,
    category TEXT,
    is_vip BOOLEAN DEFAULT false,
    entry_fee INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Streams are viewable by everyone." ON public.streams FOR SELECT USING ( true );
CREATE POLICY "Hosts can create streams." ON public.streams FOR INSERT WITH CHECK ( auth.uid() = host_id );
CREATE POLICY "Hosts can update their streams." ON public.streams FOR UPDATE USING ( auth.uid() = host_id );

-- Create posts table
CREATE TABLE public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT,
    caption TEXT,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are viewable by everyone." ON public.posts FOR SELECT USING ( true );
CREATE POLICY "Users can insert their own posts." ON public.posts FOR INSERT WITH CHECK ( auth.uid() = user_id );
CREATE POLICY "Users can delete their own posts." ON public.posts FOR DELETE USING ( auth.uid() = user_id );

-- Create wallets table
CREATE TABLE public.wallets (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
    coins INTEGER DEFAULT 0,
    usdt_balance NUMERIC DEFAULT 0.0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own wallet." ON public.wallets FOR SELECT USING ( auth.uid() = user_id );

-- Realtime replication
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.streams;
