-- Create applications table for storing contact form submissions
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  pays TEXT NOT NULL,
  profession TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en_cours', 'traité', 'archivé')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert applications (public form submissions)
CREATE POLICY "Anyone can submit applications"
ON public.applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can view applications (for admin dashboard later)
CREATE POLICY "Authenticated users can view all applications"
ON public.applications
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can update applications
CREATE POLICY "Authenticated users can update applications"
ON public.applications
FOR UPDATE
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX idx_applications_status ON public.applications(status);