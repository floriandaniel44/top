-- Ensure trigger exists to create profile and assign first admin on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill missing profiles for existing users (if trigger was missing before)
INSERT INTO public.profiles (id, email)
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- Grant admin role to the current user if no admin exists yet
-- User from recent signup logs: d5e86fe7-ee0a-4505-92ea-08554c446bf6
INSERT INTO public.user_roles (user_id, role)
SELECT 'd5e86fe7-ee0a-4505-92ea-08554c446bf6'::uuid, 'admin'::app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles WHERE role = 'admin'
);
