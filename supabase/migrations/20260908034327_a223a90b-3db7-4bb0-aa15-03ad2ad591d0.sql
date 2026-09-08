ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS notify_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS notify_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notify_last_attempt_at timestamptz,
  ADD COLUMN IF NOT EXISTS notify_last_error text,
  ADD COLUMN IF NOT EXISTS notify_last_error_code text;

ALTER TABLE public.contact_messages
  DROP CONSTRAINT IF EXISTS contact_messages_notify_status_check;

ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_messages_notify_status_check
  CHECK (notify_status IN ('pending','sending','sent','failed','skipped'));

CREATE INDEX IF NOT EXISTS contact_messages_notify_status_idx
  ON public.contact_messages (notify_status);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
  ON public.contact_messages (created_at DESC);