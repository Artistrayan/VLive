-- Enforce case-insensitive unique username constraint on profiles
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx ON public.profiles (LOWER(username));
