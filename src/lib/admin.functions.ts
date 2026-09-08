import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  notify_status: string;
  notify_attempts: number;
  notify_last_attempt_at: string | null;
  notify_last_error: string | null;
  notify_last_error_code: string | null;
};

const SORTABLE = ["created_at", "name", "email"] as const;
export const NOTIFY_STATUSES = ["pending", "sending", "sent", "failed", "skipped"] as const;

const SELECT_COLUMNS =
  "id, name, email, message, created_at, notify_status, notify_attempts, notify_last_attempt_at, notify_last_error, notify_last_error_code";

const listSchema = z.object({
  search: z.string().trim().max(120).optional().default(""),
  sortBy: z.enum(SORTABLE).optional().default("created_at"),
  sortDir: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(5).max(100).optional().default(10),
  dateFrom: z.string().trim().max(40).optional().default(""),
  dateTo: z.string().trim().max(40).optional().default(""),
  status: z.enum(["all", ...NOTIFY_STATUSES]).optional().default("all"),
});

function escapeFilterValue(value: string): string {
  // PostgREST `or` filters are comma/paren delimited — strip those characters.
  return value.replace(/[,()*\\]/g, " ").trim();
}

type Filters = z.infer<typeof listSchema>;

function applyFilters<T extends { or: (f: string) => T; gte: (c: string, v: string) => T; lte: (c: string, v: string) => T; eq: (c: string, v: string) => T }>(
  query: T,
  data: Pick<Filters, "search" | "dateFrom" | "dateTo" | "status">,
): T {
  let q = query;
  const term = escapeFilterValue(data.search);
  if (term) {
    q = q.or(`name.ilike.%${term}%,email.ilike.%${term}%,message.ilike.%${term}%`);
  }
  if (data.dateFrom) {
    const d = new Date(`${data.dateFrom}T00:00:00.000Z`);
    if (!Number.isNaN(d.getTime())) q = q.gte("created_at", d.toISOString());
  }
  if (data.dateTo) {
    const d = new Date(`${data.dateTo}T23:59:59.999Z`);
    if (!Number.isNaN(d.getTime())) q = q.lte("created_at", d.toISOString());
  }
  if (data.status !== "all") {
    q = q.eq("notify_status", data.status);
  }
  return q;
}


export const isCurrentUserAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) {
      console.error("[admin] role lookup failed", error);
      return { isAdmin: false };
    }
    return { isAdmin: Boolean(data) };
  });

export const listContactMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => listSchema.parse(data ?? {}))
  .handler(async ({ data, context }) => {
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;

    const query = applyFilters(
      context.supabase
        .from("contact_messages")
        .select(SELECT_COLUMNS, { count: "exact" })
        .order(data.sortBy, { ascending: data.sortDir === "asc" })
        .range(from, to),
      data,
    );


    const { data: rows, count, error } = await query;
    if (error) {
      console.error("[admin] list failed", error);
      throw new Error("Could not load messages.");
    }

    return {
      rows: (rows ?? []) as ContactMessageRow[],
      total: count ?? 0,
      page: data.page,
      pageSize: data.pageSize,
    };
  });

function csvCell(value: string): string {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export const exportContactMessagesCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    listSchema.pick({ search: true, sortBy: true, sortDir: true }).parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    let query = context.supabase
      .from("contact_messages")
      .select("id, name, email, message, created_at")
      .order(data.sortBy, { ascending: data.sortDir === "asc" })
      .limit(5000);

    const term = escapeFilterValue(data.search);
    if (term) {
      query = query.or(
        `name.ilike.%${term}%,email.ilike.%${term}%,message.ilike.%${term}%`,
      );
    }

    const { data: rows, error } = await query;
    if (error) {
      console.error("[admin] export failed", error);
      throw new Error("Could not export messages.");
    }

    const header = ["id", "name", "email", "message", "created_at"];
    const lines = [header.join(",")];
    for (const row of (rows ?? []) as ContactMessageRow[]) {
      lines.push(
        [row.id, row.name, row.email, row.message, row.created_at]
          .map((v) => csvCell(String(v ?? "")))
          .join(","),
      );
    }

    return { csv: lines.join("\r\n"), count: rows?.length ?? 0 };
  });
