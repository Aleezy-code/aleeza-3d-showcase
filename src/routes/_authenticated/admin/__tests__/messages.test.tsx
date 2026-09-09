import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mocks = vi.hoisted(() => ({
  isCurrentUserAdmin: vi.fn(),
  listContactMessages: vi.fn(),
  exportContactMessagesCsv: vi.fn(),
  navigate: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@tanstack/react-start", () => ({
  useServerFn: (fn: unknown) => fn,
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (opts: unknown) => opts,
  useNavigate: () => mocks.navigate,
}));

vi.mock("@/lib/admin.functions", () => ({
  isCurrentUserAdmin: mocks.isCurrentUserAdmin,
  listContactMessages: mocks.listContactMessages,
  exportContactMessagesCsv: mocks.exportContactMessagesCsv,
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { signOut: mocks.signOut } },
}));

import { MessagesPage } from "../messages";

function row(i: number, overrides: Record<string, unknown> = {}) {
  return {
    id: `id-${i}`,
    name: `Person ${i}`,
    email: `person${i}@example.com`,
    message: `Message body ${i}`,
    created_at: "2026-01-0" + ((i % 9) + 1) + "T10:00:00.000Z",
    notify_status: "sent",
    notify_attempts: 1,
    notify_last_attempt_at: "2026-01-01T10:00:00.000Z",
    notify_last_error: null,
    notify_last_error_code: null,
    ...overrides,
  };
}

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MessagesPage />
    </QueryClientProvider>,
  );
}

/** Last argument object passed to listContactMessages. */
function lastListArgs() {
  const calls = mocks.listContactMessages.mock.calls;
  return calls[calls.length - 1]?.[0]?.data;
}

describe("admin contact messages page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isCurrentUserAdmin.mockResolvedValue({ isAdmin: true });
    mocks.listContactMessages.mockResolvedValue({
      rows: [row(1), row(2, { notify_status: "failed", notify_attempts: 3, notify_last_error: "No verified sender domain", notify_last_error_code: "no_sender_domain" })],
      total: 42,
      page: 1,
      pageSize: 10,
    });
    mocks.exportContactMessagesCsv.mockResolvedValue({ csv: "id,name\r\n1,Person", count: 1 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("hides messages from non-admin accounts", async () => {
    mocks.isCurrentUserAdmin.mockResolvedValue({ isAdmin: false });
    renderPage();
    expect(await screen.findByText("No access")).toBeInTheDocument();
    expect(mocks.listContactMessages).not.toHaveBeenCalled();
  });

  it("lists messages with delivery status for an admin", async () => {
    renderPage();
    expect(await screen.findByText("Person 1")).toBeInTheDocument();
    expect(screen.getByText("42 total submissions")).toBeInTheDocument();
    expect(screen.getByText("failed")).toBeInTheDocument();
    expect(screen.getByText(/no_sender_domain/)).toBeInTheDocument();
  });

  it("searches with a debounce and resets to page one", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("Person 1");

    await user.type(screen.getByLabelText("Search messages"), "alice");

    await waitFor(() => expect(lastListArgs().search).toBe("alice"));
    expect(lastListArgs().page).toBe(1);
  });

  it("sorts by a column and flips direction on a second click", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("Person 1");

    await user.click(screen.getByRole("button", { name: /Name/ }));
    await waitFor(() => expect(lastListArgs().sortBy).toBe("name"));
    expect(lastListArgs().sortDir).toBe("asc");

    await user.click(screen.getByRole("button", { name: /Name/ }));
    await waitFor(() => expect(lastListArgs().sortDir).toBe("desc"));
  });

  it("pages forward and back and changes page size", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("Person 1");
    expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(lastListArgs().page).toBe(2));

    await user.click(screen.getByRole("button", { name: "Previous" }));
    await waitFor(() => expect(lastListArgs().page).toBe(1));

    await user.selectOptions(screen.getByLabelText("Rows per page"), "25");
    await waitFor(() => expect(lastListArgs().pageSize).toBe(25));
  });

  it("filters by date range and delivery status", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("Person 1");

    await user.type(screen.getByLabelText("From date"), "2026-01-01");
    await user.type(screen.getByLabelText("To date"), "2026-01-31");
    await user.selectOptions(screen.getByLabelText("Delivery status"), "failed");

    await waitFor(() => expect(lastListArgs().status).toBe("failed"));
    expect(lastListArgs().dateFrom).toBe("2026-01-01");
    expect(lastListArgs().dateTo).toBe("2026-01-31");

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await waitFor(() => expect(lastListArgs().status).toBe("all"));
    expect(lastListArgs().dateFrom).toBe("");
  });

  it("exports a CSV using the active filters", async () => {
    const user = userEvent.setup();
    const createUrl = vi.fn(() => "blob:csv");
    const revokeUrl = vi.fn();
    Object.assign(URL, { createObjectURL: createUrl, revokeObjectURL: revokeUrl });
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    renderPage();
    await screen.findByText("Person 1");

    await user.selectOptions(screen.getByLabelText("Delivery status"), "failed");
    await user.click(screen.getByRole("button", { name: /Export CSV/ }));

    await waitFor(() => expect(mocks.exportContactMessagesCsv).toHaveBeenCalled());
    const args = mocks.exportContactMessagesCsv.mock.calls[0][0].data;
    expect(args.status).toBe("failed");
    expect(createUrl).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("shows an empty state when there are no results", async () => {
    mocks.listContactMessages.mockResolvedValue({ rows: [], total: 0, page: 1, pageSize: 10 });
    renderPage();
    const table = await screen.findByRole("table");
    expect(await within(table).findByText("No messages found.")).toBeInTheDocument();
  });
});
