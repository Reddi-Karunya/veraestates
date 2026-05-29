-- Allow auth-managed profile creation on signup and service-role inserts
CREATE POLICY "Allow user or service to insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR auth.uid() = id
  );
