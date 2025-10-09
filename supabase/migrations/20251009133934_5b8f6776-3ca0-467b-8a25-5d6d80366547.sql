-- Fix 1: Add explicit policy to DENY anonymous/public SELECT access to applications
-- This ensures sensitive PII cannot be read by non-admins under any circumstances
CREATE POLICY "Block public access to applications"
ON public.applications
FOR SELECT
TO anon
USING (false);

-- Fix 2: Control profile creation - only allow via trigger (SECURITY DEFINER bypasses RLS)
-- Deny all direct client INSERT attempts to profiles table
CREATE POLICY "Profiles are created via auth trigger only"
ON public.profiles
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

-- Also add explicit UPDATE policy to ensure users can only update their own profile
-- (This replaces any existing less secure policies)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update only their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add explicit DELETE policy to prevent profile deletion except by admins
CREATE POLICY "Only admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));