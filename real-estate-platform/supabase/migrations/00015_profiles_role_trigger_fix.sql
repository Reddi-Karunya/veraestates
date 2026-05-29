-- Fix profile creation for new auth users when raw_user_meta_data.role is missing or invalid
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE
      WHEN NEW.raw_user_meta_data->>'role' IN ('admin', 'staff') THEN
        NEW.raw_user_meta_data->>'role'::user_role
      ELSE
        'staff'
    END
  );
  RETURN NEW;
END;
$$;
