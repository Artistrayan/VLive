-- ====================================================================
-- MIGRATION 12: REAL CALL SESSIONS, SIGNALING AND MESSAGING POLICIES
-- ====================================================================

-- 1. Create Call Sessions Table for 1-to-1 Voice & Video Calls
CREATE TABLE IF NOT EXISTS public.call_sessions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    caller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    call_type TEXT NOT NULL DEFAULT 'video' CHECK (call_type IN ('audio', 'video', 'adult_video')),
    status TEXT NOT NULL DEFAULT 'ringing' CHECK (status IN ('ringing', 'accepted', 'rejected', 'ended', 'missed', 'busy')),
    room_name TEXT NOT NULL,
    tariff_per_min INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_sec INTEGER DEFAULT 0,
    total_coins INTEGER DEFAULT 0
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for Call Sessions (Strict access control)
DROP POLICY IF EXISTS "Users can view own call sessions" ON public.call_sessions;
CREATE POLICY "Users can view own call sessions" ON public.call_sessions
    FOR SELECT USING (auth.uid() IN (caller_id, receiver_id) OR public.is_admin_user());

DROP POLICY IF EXISTS "Callers can create call sessions" ON public.call_sessions;
CREATE POLICY "Callers can create call sessions" ON public.call_sessions
    FOR INSERT WITH CHECK (auth.uid() = caller_id);

DROP POLICY IF EXISTS "Participants can update own call sessions" ON public.call_sessions;
CREATE POLICY "Participants can update own call sessions" ON public.call_sessions
    FOR UPDATE USING (auth.uid() IN (caller_id, receiver_id) OR public.is_admin_user());

-- 4. Conversations RLS Policy Hardening
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
CREATE POLICY "Users can view own conversations" ON public.conversations
    FOR SELECT USING (auth.uid() IN (user1_id, user2_id) OR public.is_admin_user());

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() IN (user1_id, user2_id));

-- 5. Messages RLS Policy Hardening
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.messages;
CREATE POLICY "Users can view messages in own conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations c 
            WHERE c.id = messages.conversation_id 
              AND (auth.uid() IN (c.user1_id, c.user2_id) OR public.is_admin_user())
        )
    );

DROP POLICY IF EXISTS "Users can insert messages to own conversations" ON public.messages;
CREATE POLICY "Users can insert messages to own conversations" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id 
        AND EXISTS (
            SELECT 1 FROM public.conversations c 
            WHERE c.id = messages.conversation_id 
              AND auth.uid() IN (c.user1_id, c.user2_id)
        )
    );

-- 6. Add Tables to Realtime Publication
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.call_sessions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
