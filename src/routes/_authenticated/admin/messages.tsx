import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Download,
  Loader2,
  LogOut,
  Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  exportContactMessagesCsv,
  isCurrentUserAdmin,
  listContactMessages,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortBy = "created_at" | "name" | "email";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  head: () => ({
    meta: [
      { title: "Contact messages — Jack Studio Admin" },
      {
        name: "description",
        content: "Search, sort, page through and export contact form submissions.",
      },
      { property: "og:title", content: "Contact messages — Jack Studio Admin" },
      {
        property: "og:description",
        content: "Private admin view of portfolio contact form submissions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const navigate = useNavigate();
  const checkAdmin = useServerFn(isCurrentUserAdmin);
  const list = useServerFn(listContactMessages);
  const exportCsv = useServerFn(exportContactMessagesCsv);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [exporting, setExporting] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const adminQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => checkAdmin(),
  });

  const isAdmin = adminQuery.data?.isAdmin ?? false;

  const messagesQuery = useQuery({
    queryKey: ["contact-messages", search, sortBy, sortDir, page, pageSize, dateFrom, dateTo, status],
    queryFn: () =>
      list({ data: { search, sortBy, sortDir, page, pageSize, dateFrom, dateTo, status } }),
    enabled: isAdmin,
    placeholderData: (prev) => prev,
  });


  const total = messagesQuery.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const rows = useMemo(() => messagesQuery.data?.rows ?? [], [messagesQuery.data]);

  function toggleSort(column: SortBy) {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir(column === "created_at" ? "desc" : "asc");
    }
    setPage(1);
  }

  async function handleExport() {
    setExporting(true);
    try {
      const result = await exportCsv({ data: { search, sortBy, sortDir } });
      const blob = new Blob([`\uFEFF${result.csv}`], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contact-messages-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (adminQuery.isLoading) {
    return (
      <Shell>
        <div className="flex items-center gap-2 text-white/60">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking access…
        </div>
      </Shell>
    );
  }

  if (!isAdmin) {
    return (
      <Shell>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8">
          <h1 className="mb-2 text-xl font-semibold text-white">No access</h1>
          <p className="text-sm text-white/60">
            This account is not an admin, so contact messages stay hidden.
          </p>
          <Button variant="outline" className="mt-6" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Contact messages</h1>
          <p className="text-sm text-white/50">{total} total submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} disabled={exporting || total === 0}>
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export CSV
          </Button>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, email or message"
            className="border-white/15 bg-transparent pl-9 text-white"
          />
        </div>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => {
            setPageSize(Number(v));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[130px] border-white/15 bg-transparent text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-white/70">
            <tr>
              <SortHeader label="Name" column="name" {...{ sortBy, sortDir, toggleSort }} />
              <SortHeader label="Email" column="email" {...{ sortBy, sortDir, toggleSort }} />
              <th className="px-4 py-3 font-medium">Message</th>
              <SortHeader
                label="Received"
                column="created_at"
                {...{ sortBy, sortDir, toggleSort }}
              />
            </tr>
          </thead>
          <tbody>
            {messagesQuery.isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-white/50">
                  Loading…
                </td>
              </tr>
            )}
            {!messagesQuery.isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-white/50">
                  No messages found.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-white/10 align-top text-white/80">
                <td className="px-4 py-3 whitespace-nowrap">{row.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <a href={`mailto:${row.email}`} className="hover:underline">
                    {row.email}
                  </a>
                </td>
                <td className="max-w-[420px] px-4 py-3 whitespace-pre-wrap">{row.message}</td>
                <td className="px-4 py-3 whitespace-nowrap text-white/60">
                  {new Date(row.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-white/60">
        <span>
          Page {page} of {pageCount}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </Shell>
  );
}

function SortHeader({
  label,
  column,
  sortBy,
  sortDir,
  toggleSort,
}: {
  label: string;
  column: SortBy;
  sortBy: SortBy;
  sortDir: "asc" | "desc";
  toggleSort: (c: SortBy) => void;
}) {
  const active = sortBy === column;
  return (
    <th className="px-4 py-3 font-medium">
      <button
        type="button"
        onClick={() => toggleSort(column)}
        className="inline-flex items-center gap-1 hover:text-white"
      >
        {label}
        {active &&
          (sortDir === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          ))}
      </button>
    </th>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="min-h-screen px-6 py-12"
      style={{ backgroundColor: "#0C0C0C", fontFamily: "'Kanit', sans-serif" }}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </main>
  );
}
