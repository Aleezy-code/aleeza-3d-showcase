
-- Contact form: stored submissions + best-effort per-IP rate limiting.

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  ip_hash text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies: only the server-side admin client writes/reads.
CREATE POLICY "service_role manages contact_messages"
  ON public.contact_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX contact_messages_created_at_idx
  ON public.contact_messages (created_at DESC);

CREATE TABLE public.contact_rate_limits (
  ip_hash text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  count integer NOT NULL DEFAULT 0,
  hour_window_start timestamptz NOT NULL DEFAULT now(),
  hour_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.contact_rate_limits TO service_role;
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role manages contact_rate_limits"
  ON public.contact_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
