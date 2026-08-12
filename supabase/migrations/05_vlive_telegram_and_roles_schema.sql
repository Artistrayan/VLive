-- Migration 05: Add telegram_id, telegram_username, and role to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telegram_id BIGINT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telegram_username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Ensure unique constraint on telegram_id when not null
CREATE UNIQUE INDEX IF NOT EXISTS profiles_telegram_id_unique_idx ON public.profiles (telegram_id) WHERE telegram_id IS NOT NULL;

-- Ensure admin role for Super Admin Telegram ID 8933698119
UPDATE public.profiles SET role = 'admin' WHERE telegram_id = 8933698119;
UPDATE public.profiles SET role = 'user' WHERE role IS NULL OR (role = 'admin' AND telegram_id IS DISTINCT FROM 8933698119);
