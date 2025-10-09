-- Secure the rate limiting table to prevent bypass attacks
-- Only the backend service (using service role key) should be able to modify this table

-- Add INSERT policy that denies all client access
-- (Service role key bypasses RLS, so edge function can still insert)
CREATE POLICY "Only backend can insert rate limit records"
ON public.application_rate_limits
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

-- Add UPDATE policy that denies all client access
CREATE POLICY "Only backend can update rate limit records"
ON public.application_rate_limits
FOR UPDATE
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- Add DELETE policy that only allows admins
CREATE POLICY "Only admins can delete rate limit records"
ON public.application_rate_limits
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));