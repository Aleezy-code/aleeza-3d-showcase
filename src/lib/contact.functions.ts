import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    // Server-side handling. In a real app this would email or persist to DB.
    console.log("[contact] new submission", {
      name: data.name,
      email: data.email,
      length: data.message.length,
    });
    return { ok: true as const, receivedAt: new Date().toISOString() };
  });
