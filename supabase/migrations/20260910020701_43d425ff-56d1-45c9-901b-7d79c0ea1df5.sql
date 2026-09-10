CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Personal',
  image_urls text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are publicly viewable"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX projects_created_at_idx ON public.projects (created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();