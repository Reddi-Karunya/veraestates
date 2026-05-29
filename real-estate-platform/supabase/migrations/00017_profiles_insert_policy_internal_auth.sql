-- Adjust profiles insert policy to allow new user profile creation from Supabase auth internals
DROP POLICY IF EXISTS "Allow user or service to insert own profile" ON public.profiles;

CREATE POLICY "Allow user or service to insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR auth.uid() = id
    OR auth.role() IS NULL
  );
