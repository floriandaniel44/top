-- CRITICAL SECURITY FIX: Remove the permissive INSERT policy that allows direct client access
-- This policy allows clients to bypass our secure edge function with validation, rate limiting, and spam protection
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;

-- Add explicit DENY policy for all client INSERT attempts
-- This forces ALL submissions to go through the secure edge function
CREATE POLICY "Block direct client inserts - use edge function"
ON public.applications
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

-- The edge function will continue to work because it uses the service role key,
-- which bypasses RLS entirely. This ensures:
-- 1. All submissions go through server-side validation
-- 2. Rate limiting is enforced
-- 3. Spam protection (honeypot, timing checks) is applied
-- 4. No direct client access to sensitive PII table