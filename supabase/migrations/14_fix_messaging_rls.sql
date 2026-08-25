-- 1. Fix public.conversations policies
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
CREATE POLICY "Users can view own conversations" ON public.conversations
    FOR SELECT USING (
        auth.uid() = user1_id OR auth.uid() = user2_id OR public.is_admin_user()
    );

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (
        auth.uid() = user1_id OR auth.uid() = user2_id
    );

-- 2. Fix public.messages policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.messages;
CREATE POLICY "Users can view messages in own conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations c 
            WHERE c.id = messages.conversation_id 
              AND (auth.uid() = c.user1_id OR auth.uid() = c.user2_id OR public.is_admin_user())
        )
    );

DROP POLICY IF EXISTS "Users can insert messages to own conversations" ON public.messages;
CREATE POLICY "Users can insert messages to own conversations" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id 
        AND EXISTS (
            SELECT 1 FROM public.conversations c 
            WHERE c.id = messages.conversation_id 
              AND (auth.uid() = c.user1_id OR auth.uid() = c.user2_id)
        )
    );
