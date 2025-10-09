-- SECURITY FIX: Remove redundant blocking policy that prevents even admins from accessing data
-- 
-- PROBLEM: Having two RESTRICTIVE SELECT policies where one is always false (USING false)
-- means ALL RESTRICTIVE policies must pass, so even admins are blocked.
--
-- SOLUTION: Remove the redundant "Block public access" policy.
-- The "Only admins can view all applications" RESTRICTIVE policy is sufficient because:
-- 1. No PERMISSIVE SELECT policies exist (default deny for non-admins)
-- 2. The single RESTRICTIVE policy only allows admins
-- 3. This achieves the same security goal without breaking admin access

DROP POLICY IF EXISTS "Block public access to applications" ON public.applications;

-- The remaining policy structure now correctly allows ONLY admins to read:
-- ✓ "Only admins can view all applications" - RESTRICTIVE SELECT for admins
-- ✓ No PERMISSIVE SELECT policies = default deny for everyone else
-- ✓ "Block direct client inserts" - Prevents direct writes (edge function only)
-- ✓ Admin-only UPDATE/DELETE policies

-- This is the recommended security pattern: one RESTRICTIVE policy defining who CAN access,
-- with no PERMISSIVE policies meaning everyone else is blocked by default.