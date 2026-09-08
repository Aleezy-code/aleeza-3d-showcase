/**
 * Notification delivery with retries.
 *
 * Sending is attempted through Lovable's managed email API. Until a sender
 * domain is configured for this project the attempt fails fast with a
 * permanent error, which is persisted so it can be audited from the admin page.
 */

export type NotifyOutcome = {
  status: "sent" | "failed" | "skipped";
  attempts: number;
  errorCode: string | null;
  errorMessage: string | null;
};

export type ContactNotification = {
  id: string;
  name: string;
  email: string;
  message: string;
};

const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 400;

/** Errors we should not waste retries on. */
const PERMANENT_CODES = new Set([
  "no_sender_domain",
  "no_recipient",
  "domain_not_verified",
  "emails_disabled",
  "recipient_suppressed",
  "invalid_request",
]);

class NotifyError extends Error {
  code: string;
  retryAfterSeconds: number | null;
  constructor(code: string, message: string, retryAfterSeconds: number | null = null) {
    super(message);
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function attemptSend(payload: ContactNotification): Promise<void> {
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!to) throw new NotifyError("no_recipient", "No notification recipient configured.");

  const senderDomain = process.env.EMAIL_SENDER_DOMAIN;
  if (!senderDomain) {
    throw new NotifyError(
      "no_sender_domain",
      "No verified sender domain is configured for this project, so the notification could not be sent.",
    );
  }

  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new NotifyError("no_api_key", "Email API key is not available.");

  const { sendLovableEmail } = await import("@lovable.dev/email-js");
  const text = `New contact form submission\n\nFrom: ${payload.name} <${payload.email}>\n\n${payload.message}`;

  try {
    await sendLovableEmail(
      {
        from: `"Portfolio" <noreply@${senderDomain}>`,
        sender_domain: senderDomain,
        to,
        subject: `New message from ${payload.name}`,
        html: `<p><strong>${escapeHtml(payload.name)}</strong> &lt;${escapeHtml(payload.email)}&gt;</p><p>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>`,
        text,
        purpose: "transactional",
        label: "contact-notification",
        idempotency_key: `contact-notification-${payload.id}`,
      } as never,
      { apiKey, sendUrl: process.env.LOVABLE_EMAIL_SEND_URL } as never,
    );
  } catch (err) {
    const e = err as { code?: string; status?: number; retryAfterSeconds?: number | null; message?: string };
    const code = e.code ?? (e.status === 429 ? "rate_limited" : "send_failed");
    throw new NotifyError(code, e.message ?? "Email send failed", e.retryAfterSeconds ?? null);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Attempts delivery up to MAX_ATTEMPTS times with exponential backoff,
 * stopping early on permanent failures.
 */
export async function sendContactNotification(
  payload: ContactNotification,
): Promise<NotifyOutcome> {
  let attempts = 0;
  let lastError: NotifyError | null = null;

  while (attempts < MAX_ATTEMPTS) {
    attempts += 1;
    try {
      await attemptSend(payload);
      return { status: "sent", attempts, errorCode: null, errorMessage: null };
    } catch (err) {
      lastError =
        err instanceof NotifyError
          ? err
          : new NotifyError("unknown", err instanceof Error ? err.message : String(err));

      if (PERMANENT_CODES.has(lastError.code)) break;
      if (attempts >= MAX_ATTEMPTS) break;

      const wait =
        lastError.code === "rate_limited"
          ? (lastError.retryAfterSeconds ?? 60) * 1000
          : BASE_DELAY_MS * 2 ** (attempts - 1);
      // Cap the in-request wait so the submission never hangs.
      await sleep(Math.min(wait, 2000));
    }
  }

  return {
    status: "failed",
    attempts,
    errorCode: lastError?.code ?? "unknown",
    errorMessage: (lastError?.message ?? "Unknown error").slice(0, 500),
  };
}
