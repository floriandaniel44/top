-- Add DELETE policy for admin to allow data deletion (GDPR compliance)
CREATE POLICY "Admins can delete applications"
ON public.applications
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create a rate limiting table to track submissions
CREATE TABLE IF NOT EXISTS public.application_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  submission_count integer DEFAULT 1,
  first_submission_at timestamp with time zone DEFAULT now(),
  last_submission_at timestamp with time zone DEFAULT now(),
  blocked_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE public.application_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only admins can view rate limit data
CREATE POLICY "Admins can view rate limits"
ON public.application_rate_limits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create index for fast IP lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip ON public.application_rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limits_last_submission ON public.application_rate_limits(last_submission_at);