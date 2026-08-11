-- Migration 05: Permanent Unique Username Handle System
-- Format: Vlive + Atomic Sequence Number (Vlive1001, Vlive1002, ...)

-- 1. Create atomic sequence for handle numbers
CREATE SEQUENCE IF NOT EXISTS public.vlive_handle_seq START WITH 1001 INCREMENT BY 1;

-- 2. Add username_handle column to public.profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username_handle TEXT;

-- 3. Function to get next Vlive handle
CREATE OR REPLACE FUNCTION public.generate_vlive_handle()
RETURNS TEXT AS $$
BEGIN
    RETURN 'Vlive' || nextval('public.vlive_handle_seq')::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Backfill existing profiles with unique Vlive handles in order of creation
DO $$
DECLARE
    p RECORD;
    h_num INTEGER;
BEGIN
    FOR p IN 
        SELECT id 
        FROM public.profiles 
        WHERE username_handle IS NULL OR username_handle NOT SIMILAR TO 'Vlive[0-9]+' 
        ORDER BY created_at ASC, id ASC 
    LOOP
        SELECT nextval('public.vlive_handle_seq') INTO h_num;
        UPDATE public.profiles 
        SET username_handle = 'Vlive' || h_num,
            username = COALESCE(username, 'Vlive' || h_num)
        WHERE id = p.id;
    END LOOP;
END $$;

-- 5. Fix any potential duplicates among existing rows
DO $$
DECLARE
    p RECORD;
    h_num INTEGER;
BEGIN
    FOR p IN
        SELECT id, username_handle,
               ROW_NUMBER() OVER (PARTITION BY username_handle ORDER BY created_at ASC, id ASC) as rnum
        FROM public.profiles
        WHERE username_handle IS NOT NULL
    LOOP
        IF p.rnum > 1 THEN
            SELECT nextval('public.vlive_handle_seq') INTO h_num;
            UPDATE public.profiles 
            SET username_handle = 'Vlive' || h_num,
                username = 'Vlive' || h_num
            WHERE id = p.id;
        END IF;
    END LOOP;
END $$;

-- 6. Ensure sequence is positioned after the highest existing allocated handle
SELECT setval('public.vlive_handle_seq', COALESCE((
    SELECT MAX(NULLIF(regexp_replace(username_handle, '^Vlive', ''), '')::bigint)
    FROM public.profiles
    WHERE username_handle ~ '^Vlive[0-9]+$'
), 1000) + 1, false);

-- 7. Enforce NOT NULL & UNIQUE CONSTRAINT on username_handle
ALTER TABLE public.profiles ALTER COLUMN username_handle SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_username_handle_key'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_handle_key UNIQUE (username_handle);
    END IF;
END $$;

-- 8. Immutability trigger on public.profiles (Prevents changing username_handle)
CREATE OR REPLACE FUNCTION public.enforce_username_handle_immutable()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.username_handle IS NOT NULL THEN
        -- Force username_handle to remain OLD value
        NEW.username_handle := OLD.username_handle;
    ELSIF NEW.username_handle IS NULL THEN
        NEW.username_handle := 'Vlive' || nextval('public.vlive_handle_seq');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_username_handle_immutable ON public.profiles;
CREATE TRIGGER trg_enforce_username_handle_immutable
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_username_handle_immutable();

-- 9. Update handle_new_user trigger function for auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    new_handle TEXT;
BEGIN
    new_handle := 'Vlive' || nextval('public.vlive_handle_seq');

    -- Insert into profiles
    INSERT INTO public.profiles (
        id,
        username_handle,
        username,
        name,
        avatar,
        status
    ) VALUES (
        NEW.id,
        new_handle,
        new_handle,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Telegram User'),
        COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'),
        'approved'
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert default wallet
    INSERT INTO public.wallets (user_id, coins, usdt_balance)
    VALUES (NEW.id, 0, 0.0)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
