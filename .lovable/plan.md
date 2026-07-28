
Five changes to the existing contact flow. Two require enabling Lovable Cloud (our built-in backend) because they need a database table and email sending.

## 1. Vitest + React Testing Library tests

Add test tooling (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`) and a `vitest.config.ts` + `src/test/setup.ts`.

New tests in `src/components/portfolio/__tests__/ContactSection.test.tsx`:
- validation error when submitting empty form (no server call)
- successful submission → server function called with clean payload → success message shown, fields reset
- failed submission (server throws) → error message shown, form not reset
- honeypot filled → submit is a no-op showing success UI but server function NOT called

The server function is mocked via `vi.mock('@/lib/contact.functions')` so tests never hit the network.

## 2. Honeypot + stricter validation

- Add a hidden `website` input (label "Leave this field empty", `tabIndex={-1}`, absolutely positioned off-screen, `autoComplete="off"`). If it comes back non-empty, we pretend to succeed but skip the send.
- Tighten Zod schema on both client and server:
  - `name`: min 2, max 80, letters/spaces/`-'.` only
  - `email`: valid email, max 254, reject obvious throwaway patterns (`+test`, consecutive dots)
  - `message`: min 10, max 1000, must contain at least one letter, reject if >5 URLs
  - `website` (honeypot): must be empty string
  - client-side "time to submit" check: if the form was submitted in <1.5s from mount, treat as bot

## 3. Save messages to a database table

After enabling Lovable Cloud, add a migration creating `public.contact_messages`:

```text
contact_messages
  id           uuid pk
  name         text not null
  email        text not null
  message      text not null
  ip_hash      text            -- sha256(ip + salt), for rate limiting only
  user_agent   text
  created_at   timestamptz default now()
```

- RLS enabled. Only `service_role` gets full access; no `anon`/`authenticated` grants (nobody reads these from the browser).
- Server function inserts using the admin client (loaded inside the handler).
- You can review submissions in Cloud → Table editor → `contact_messages`.

## 4. Email notification on submission

Uses Lovable's built-in email infrastructure (requires Cloud + a verified sender domain you own — I'll open the email-domain setup dialog in the follow-up if none is configured).

- New React Email template `src/lib/email-templates/contact-notification.tsx` with the submitter's name, email, and message.
- After a successful insert, the server function calls `sendTemplateEmail('contact-notification', <your-email>, { templateData })` with an idempotency key based on the row id.
- Send failures are logged but don't fail the form submission (the message is already stored).

**I need from you:** the email address that should receive notifications.

## 5. Rate limiting

The backend has no standard rate-limiting primitive on this stack. I'll implement an ad-hoc limit backed by a small table:

```text
contact_rate_limits (ip_hash text pk, window_start timestamptz, count int)
```

Rules: max 3 submissions per IP per 10 minutes, max 10 per hour. Enforced in the server function before insert; returns a typed error the UI displays as "Too many attempts, try again later." IP is hashed with a server-side salt so we don't store raw IPs.

Caveat: this is best-effort — a determined attacker rotating IPs can defeat it. Real DDoS/spam protection would need edge-level rate limiting (Cloudflare rules, Turnstile, etc.), which isn't in scope here.

## Order of operations

1. Enable Lovable Cloud.
2. Apply DB migration (`contact_messages`, `contact_rate_limits`).
3. Ask you for the notification email address, then scaffold email templates and set up your sender domain.
4. Update `submitContact` server function: honeypot check → rate-limit check → validate → insert → send email.
5. Update `ContactSection.tsx` with honeypot, stricter validation, submit-time guard, and a "rate limited" UI state.
6. Add Vitest config, setup, and the four tests above.

## Trade-offs / assumptions

- Honeypot + timing check catches naive bots; sophisticated ones need CAPTCHA (Turnstile) — happy to add later.
- Rate limiting is per hashed-IP in Postgres, which is fine at low traffic but not a fortress.
- Email notifications need your own verified domain; a Lovable-hosted default isn't available for app-to-user email.
- Tests mock the server function; they don't exercise the Cloud stack (that would be an integration test).

## One question before I start

**What email address should receive contact notifications?** Everything else I can proceed with once you confirm this plan.
