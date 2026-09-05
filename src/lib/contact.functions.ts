import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash } from "node:crypto";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

/**
 * Public-facing schema. Kept in sync with client-side validation in
 * ContactSection.tsx so what the browser blocks matches what the server rejects.
 */
const NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.\-]{1,79}$/u;
const URL_REGEX = /\bhttps?:\/\/\S+/gi;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is too short")
    .max(80, "Name is too long")
    .regex(NAME_REGEX, "Name contains invalid characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email")
    .max(254, "Email is too long")
    .refine((v) => !v.includes(".."), "Email is not valid")
    .refine((v) => !/\+.*test/i.test(v), "Email is not valid"),
  message: z
    .string()
    .trim()
    .min(10, "Message is too short")
    .max(1000, "Message is too long")
    .refine((v) => /\p{L}/u.test(v), "Message must contain text")
    .refine((v) => (v.match(URL_REGEX) ?? []).length <= 5, "Too many links"),
  website: z.string().max(0, "Spam detected").optional().default(""),
  elapsedMs: z.number().int().nonnegative().optional().default(0),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { ok: true; id: string }
  | { ok: true; skipped: "spam" }
  | { ok: false; error: "rate_limited"; retryAfterSeconds: number }
  | { ok: false; error: "validation"; message: string };

const RATE_LIMIT_10MIN = 3;
const RATE_LIMIT_1H = 10;

function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }): Promise<ContactResult> => {
    // 1. Honeypot + timing check — silently succeed so bots don't retune.
    if ((data.website ?? "").length > 0 || data.elapsedMs < 1500) {
      console.warn("[contact] spam trap triggered", {
        honeypot: (data.website ?? "").length > 0,
        elapsedMs: data.elapsedMs,
      });
      return { ok: true, skipped: "spam" };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const salt = process.env.CONTACT_IP_HASH_SALT ?? "";
    const rawIp = getRequestIP({ xForwardedFor: true }) ?? "0.0.0.0";
    const ipHash = salt ? hashIp(rawIp, salt) : null;
    const userAgent = getRequestHeader("user-agent") ?? null;

    // 2. Rate limiting (best-effort, per hashed IP).
    if (ipHash) {
      const now = new Date();
      const { data: existing } = await supabaseAdmin
        .from("contact_rate_limits")
        .select("*")
        .eq("ip_hash", ipHash)
        .maybeSingle();

      const tenMinMs = 10 * 60 * 1000;
      const hourMs = 60 * 60 * 1000;

      const currentTenWindowStart =
        existing && now.getTime() - new Date(existing.window_start).getTime() < tenMinMs
          ? new Date(existing.window_start)
          : now;
      const currentTenCount =
        existing && now.getTime() - new Date(existing.window_start).getTime() < tenMinMs
          ? existing.count + 1
          : 1;

      const currentHourWindowStart =
        existing && now.getTime() - new Date(existing.hour_window_start).getTime() < hourMs
          ? new Date(existing.hour_window_start)
          : now;
      const currentHourCount =
        existing && now.getTime() - new Date(existing.hour_window_start).getTime() < hourMs
          ? existing.hour_count + 1
          : 1;

      if (currentTenCount > RATE_LIMIT_10MIN) {
        const retryAfterSeconds = Math.ceil(
          (tenMinMs - (now.getTime() - currentTenWindowStart.getTime())) / 1000,
        );
        return { ok: false, error: "rate_limited", retryAfterSeconds };
      }
      if (currentHourCount > RATE_LIMIT_1H) {
        const retryAfterSeconds = Math.ceil(
          (hourMs - (now.getTime() - currentHourWindowStart.getTime())) / 1000,
        );
        return { ok: false, error: "rate_limited", retryAfterSeconds };
      }

      await supabaseAdmin.from("contact_rate_limits").upsert(
        {
          ip_hash: ipHash,
          window_start: currentTenWindowStart.toISOString(),
          count: currentTenCount,
          hour_window_start: currentHourWindowStart.toISOString(),
          hour_count: currentHourCount,
          updated_at: now.toISOString(),
        },
        { onConflict: "ip_hash" },
      );
    }

    // 3. Persist.
    const { data: inserted, error } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        name: data.name,
        email: data.email,
        message: data.message,
        ip_hash: ipHash,
        user_agent: userAgent,
      })
      .select("id")
      .single();

    if (error || !inserted) {
      console.error("[contact] insert failed", error);
      throw new Error("Could not save your message. Please try again.");
    }

    // 4. Notification email — enabled once a sender domain is set up.
    if (process.env.CONTACT_NOTIFICATION_EMAIL) {
      console.info("[contact] message stored; notification email pending sender domain setup");
    }


    return { ok: true, id: inserted.id };
  });
