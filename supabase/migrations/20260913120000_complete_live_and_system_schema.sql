-- =========================================================================
-- V.LIVE MASTER COMPREHENSIVE COMPATIBILITY & SYSTEM SCHEMA MIGRATION
-- Safe, Idempotent, Non-destructive for existing production data.
-- =========================================================================

-- 1. STREAMS TABLE EXTENSIONS
ALTER TABLE public.streams 
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_heartbeat_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_streams_status_heartbeat ON public.streams(status, last_heartbeat_at);
CREATE INDEX IF NOT EXISTS idx_streams_host_id ON public.streams(host_id);

-- 2. LIVE STREAM VIEWERS
CREATE TABLE IF NOT EXISTS public.live_stream_viewers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    stream_id TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (stream_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_live_viewers_stream ON public.live_stream_viewers(stream_id);

-- 3. LIVE STREAM COMMENTS
CREATE TABLE IF NOT EXISTS public.live_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    stream_id TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT,
    avatar TEXT,
    text TEXT NOT NULL,
    is_vip BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_live_comments_stream ON public.live_comments(stream_id, created_at);

-- 4. LIVE & SYSTEM REPORTS
CREATE TABLE IF NOT EXISTS public.live_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    stream_id TEXT,
    reason TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reported_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CALL REVIEWS
CREATE TABLE IF NOT EXISTS public.call_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    streamer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rating INTEGER DEFAULT 5,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BLOCKED USERS
CREATE TABLE IF NOT EXISTS public.blocked_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, blocked_id)
);
CREATE INDEX IF NOT EXISTS idx_blocked_users_pair ON public.blocked_users(user_id, blocked_id);

-- 7. STREAMER PROFILES
CREATE TABLE IF NOT EXISTS public.streamer_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    bio TEXT,
    hourly_rate NUMERIC DEFAULT 0,
    rating NUMERIC DEFAULT 5.0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. APP SETTINGS & UI CONFIGURATION
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.theme_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    settings JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_layouts (
    page_id TEXT PRIMARY KEY,
    layout JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.component_positions (
    component_id TEXT PRIMARY KEY,
    position JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ui_settings (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INTERESTS & USER INTERESTS
CREATE TABLE IF NOT EXISTS public.interests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_interests (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    interest_id UUID REFERENCES public.interests(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, interest_id)
);

-- 10. ADULT ACCESS LOGS
CREATE TABLE IF NOT EXISTS public.adult_access_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ENABLE RLS & GRANTS
ALTER TABLE public.live_stream_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streamer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adult_access_logs ENABLE ROW LEVEL SECURITY;

-- Permissive public read & authenticated write policies
DO $$
BEGIN
    -- live_stream_viewers
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read live_stream_viewers') THEN
        CREATE POLICY "Public read live_stream_viewers" ON public.live_stream_viewers FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth insert live_stream_viewers') THEN
        CREATE POLICY "Auth insert live_stream_viewers" ON public.live_stream_viewers FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- live_comments
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read live_comments') THEN
        CREATE POLICY "Public read live_comments" ON public.live_comments FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth insert live_comments') THEN
        CREATE POLICY "Auth insert live_comments" ON public.live_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    -- blocked_users
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own blocks') THEN
        CREATE POLICY "Users can manage own blocks" ON public.blocked_users FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- app_settings
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read app_settings') THEN
        CREATE POLICY "Public read app_settings" ON public.app_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth update app_settings') THEN
        CREATE POLICY "Auth update app_settings" ON public.app_settings FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- interests & user_interests
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read interests') THEN
        CREATE POLICY "Public read interests" ON public.interests FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage user_interests') THEN
        CREATE POLICY "Users manage user_interests" ON public.user_interests FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;
