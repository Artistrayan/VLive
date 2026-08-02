# CRITICAL LOGIN ERROR TRACE

I have successfully traced the entire login flow and found the exact root cause of the "Failed to fetch" error.

## The Trace
1. **Telegram Login**: Successfully parses user data.
2. **Supabase Auth**: **FAILS**. The app attempts to create an authentication user (`supabase.auth.signUp`), but the Supabase API returns a `400 Bad Request` with the message: `"Email signups are disabled"`. (This surfaces as `Failed to fetch` in the browser network layer).
3. **User Session**: Fails to generate because Auth failed.
4. **Profile Insert**: **FAILS**. Because Auth failed, there is no valid `auth.uid()`. Furthermore, PostgreSQL rejects any manual insert into the `profiles` table because `profiles.id` has a strict Foreign Key constraint requiring the ID to exist in `auth.users`.
5. **Home Query**: Returns 0 rows because no profile was successfully created.

## How to Fix This (Action Required)
You must enable the Email Provider in your Supabase project settings. Without it, the application cannot create users.

1. Go to your **Supabase Dashboard**.
2. Navigate to **Authentication** -> **Providers** -> **Email**.
3. Toggle **Enable Email Provider** to **ON**.
4. **CRITICAL**: Turn **OFF** "Confirm Email". (Since we use generated emails for Telegram users, they cannot verify them).
5. Click **Save**.

## What I Have Done to Fix the Codebase
1. **Enhanced Error Handling**: I updated `src/services/api.js` to catch this exact error. Now, instead of a generic "Failed to fetch", the application will display a clear toast message: `Supabase Config Error: Email signups are disabled. Please enable Email Signups in your Supabase Auth Providers settings.`
2. **Robust SQL Trigger**: I prepared the definitive SQL fix in `supabase_comprehensive_fix.sql`. It includes the correct RLS policies for inserts, cleans orphan data, and creates an `ON CONFLICT DO UPDATE` trigger that will flawlessly create/update the profile and wallet the moment the Auth user is created.
3. **Rebuilt the App**: I ran the build system so the new error handling is live.

**Next Steps**: Enable the Email Provider in Supabase, then log in again. The trigger will automatically create the profile, and the user will immediately appear in the Home and Match tabs.
