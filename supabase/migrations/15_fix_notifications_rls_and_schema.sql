-- Migration 15: Fix notifications schema, RLS policies, and Realtime publication

-- 1. Ensure required columns exist on public.notifications
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

-- 4. Create proper policies
-- SELECT: Users can view their own notifications or admins can view all
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (
        auth.uid() = user_id OR (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
    );

-- INSERT: Any authenticated user can create notifications for another user
CREATE POLICY "Authenticated users can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' OR auth.uid() IS NOT NULL
    );

-- UPDATE: Users can update their own notifications (e.g. mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (
        auth.uid() = user_id
    );

-- DELETE: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON public.notifications
    FOR DELETE USING (
        auth.uid() = user_id
    );

-- 5. Add notifications table to Realtime publication
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;
