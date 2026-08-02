-- SAFE DATABASE CLEANUP

-- 1. Identify fake users (e.g. usernames with test, demo, or user_178...)
-- We'll delete them from auth.users which cascades to profiles, posts, etc.
DO $$
DECLARE
    fake_user RECORD;
BEGIN
    FOR fake_user IN 
        SELECT id, username FROM public.profiles 
        WHERE username ILIKE '%test%' 
           OR username ILIKE '%demo%' 
           OR username ILIKE 'user_17%'
    LOOP
        -- Delete auth user (cascades to profiles, posts, stories, wallets, etc. because of ON DELETE CASCADE)
        DELETE FROM auth.users WHERE id = fake_user.id;
        RAISE NOTICE 'Deleted fake user: %', fake_user.username;
    END LOOP;
END $$;

-- 2. Fix RLS Policies for Profiles
-- Drop the potentially insecure update policy and recreate it with WITH CHECK
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Users can update own profile." 
    ON public.profiles 
    FOR UPDATE 
    USING ( auth.uid() = id )
    WITH CHECK ( auth.uid() = id );
    
-- Add delete policy for users to delete their own profile just in case
DROP POLICY IF EXISTS "Users can delete own profile." ON public.profiles;
CREATE POLICY "Users can delete own profile." 
    ON public.profiles 
    FOR DELETE 
    USING ( auth.uid() = id );

