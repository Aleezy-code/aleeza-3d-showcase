import { useEffect, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Clock } from "lucide-react";
import { z } from "zod";
import { FadeIn } from "./FadeIn";
import { submitContact } from "@/lib/contact.functions";

const NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.\-]{1,79}$/u;
const URL_REGEX = /\bhttps?:\/\/\S+/gi;

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is too short")
    .max(80, "Name is too long")
    .regex(NAME_REGEX, "Name contains invalid characters"),
  email: z.string().trim().email("Enter a valid email").max(254),
  message: z
    .string()
    .trim()
    .min(10, "Please write a bit more")
    .max(1000, "Message is too long")
    .refine((v) => (v.match(URL_REGEX) ?? []).length <= 5, "Too many links"),
});

type Status = "idle" | "submitting" | "success" | "error" | "rate_limited";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const inputCls =
  "w-full bg-transparent border-b border-[#D7E2EA]/30 focus:border-[#D7E2EA] text-[#D7E2EA] placeholder:text-[#D7E2EA]/40 px-0 py-3 outline-none transition-colors font-light";

export function ContactSection() {
  const submit = useServerFn(submitContact);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number>(0);
  const mountedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);
    const website = String(fd.get("website") ?? "");
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    // Validate first so real users always get proper feedback.
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !fe[key]) fe[key] = issue.message;
      }
      setErrors(fe);
      return;
    }

    // Then client-side spam gates: honeypot + submit-too-fast.
    const elapsedMs = Date.now() - mountedAtRef.current;
    if (website.length > 0 || elapsedMs < 1500) {
      // Pretend it worked so bots don't get feedback.
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("submitting");
    try {
      const result = await submit({
        data: { ...parsed.data, website, elapsedMs },
      });

      if (result.ok) {
        setStatus("success");
        form.reset();
        return;
      }

      if (result.error === "rate_limited") {
        setRetryAfter(result.retryAfterSeconds);
        setStatus("rate_limited");
        return;
      }

      setServerError(result.message ?? "Please check your input and try again.");
      setStatus("error");
    } catch (err) {
      console.error("[contact] submit failed", err);
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-20 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-24"
      style={{ backgroundColor: "#0C0C0C" }}
    >
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-12 sm:mb-16 md:mb-20"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Contact
      </FadeIn>

      <FadeIn className="max-w-2xl mx-auto">
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-8"
          data-testid="contact-form"
        >
          {/* Honeypot: real users never see or fill this. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              top: "auto",
              width: 1,
              height: 1,
              overflow: "hidden",
            }}
          >
            <label htmlFor="website">Leave this field empty</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <Field
            label="Name"
            name="name"
            type="text"
            autoComplete="name"
            error={errors.name}
            inputCls={inputCls}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            error={errors.email}
            inputCls={inputCls}
          />
          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              minLength={10}
              maxLength={1000}
              className={`${inputCls} resize-none`}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <span id="message-error" className="text-xs text-red-400">
                {errors.message}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 pt-2 flex-wrap">
            <button
              type="submit"
              disabled={status === "submitting" || status === "rate_limited"}
              className="rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              style={{
                background:
                  "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
                boxShadow:
                  "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
                outline: "2px solid white",
                outlineOffset: "-3px",
              }}
            >
              {status === "submitting" && (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              )}
              {status === "submitting" ? "Sending" : "Send Message"}
            </button>

            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 text-emerald-400 text-sm"
                  role="status"
                >
                  <CheckCircle2 className="w-4 h-4" aria-hidden />
                  Message sent — I&apos;ll be in touch.
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  key="err"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 text-red-400 text-sm"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" aria-hidden />
                  {serverError ?? "Failed to send. Try again."}
                </motion.div>
              )}
              {status === "rate_limited" && (
                <motion.div
                  key="rl"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 text-amber-400 text-sm"
                  role="alert"
                >
                  <Clock className="w-4 h-4" aria-hidden />
                  Too many attempts. Try again in {formatWait(retryAfter)}.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </FadeIn>
    </section>
  );
}

function formatWait(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.ceil(seconds / 60);
  return `${m}m`;
}

function Field({
  label,
  name,
  type,
  autoComplete,
  error,
  inputCls,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  error?: string;
  inputCls: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        className={inputCls}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span id={`${name}-error`} className="text-xs text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}
