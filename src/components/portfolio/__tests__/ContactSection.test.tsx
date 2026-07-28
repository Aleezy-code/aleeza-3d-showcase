import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the server function module BEFORE importing the component under test.
const { submitContactMock } = vi.hoisted(() => ({ submitContactMock: vi.fn() }));
vi.mock("@/lib/contact.functions", () => ({
  submitContact: submitContactMock,
}));

// TanStack's useServerFn just returns the passed function in our runtime.
vi.mock("@tanstack/react-start", () => ({
  useServerFn: <T,>(fn: T) => fn,
}));

// Simplify FadeIn so framer-motion's whileInView doesn't hide content in jsdom.
vi.mock("@/components/portfolio/FadeIn", () => ({
  FadeIn: ({ children, as: As = "div" }: { children: React.ReactNode; as?: any }) => (
    <As>{children}</As>
  ),
}));

import { ContactSection } from "@/components/portfolio/ContactSection";

const VALID = {
  name: "Alex Doe",
  email: "alex@example.com",
  message: "Hi Jack, I'd love to work with you on a project.",
};

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), VALID.name);
  await user.type(screen.getByLabelText(/email/i), VALID.email);
  await user.type(screen.getByLabelText(/^message$/i), VALID.message);
}

describe("ContactSection", () => {
  beforeEach(() => {
    submitContactMock.mockReset();
  });

  it("shows validation errors and does not call the server for an empty submit", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/name is too short/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/please write a bit more/i)).toBeInTheDocument();
    expect(submitContactMock).not.toHaveBeenCalled();
  });

  it("submits successfully and shows a confirmation", async () => {
    // Advance mounted-at so the 1.5s anti-bot timer passes.
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactSection />);
    vi.advanceTimersByTime(2000);

    submitContactMock.mockResolvedValueOnce({ ok: true, id: "row-1" });

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(submitContactMock).toHaveBeenCalledTimes(1));
    const call = submitContactMock.mock.calls[0][0];
    expect(call.data).toMatchObject({
      name: VALID.name,
      email: VALID.email,
      message: VALID.message,
      website: "",
    });
    expect(call.data.elapsedMs).toBeGreaterThanOrEqual(1500);

    expect(await screen.findByRole("status")).toHaveTextContent(/message sent/i);
    vi.useRealTimers();
  });

  it("shows an error message when the server throws", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactSection />);
    vi.advanceTimersByTime(2000);

    submitContactMock.mockRejectedValueOnce(new Error("Boom"));

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/boom/i);
    expect(submitContactMock).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("silently succeeds without calling the server when the honeypot is filled", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactSection />);
    vi.advanceTimersByTime(2000);

    // Populate the visually-hidden honeypot directly.
    const honeypot = document.querySelector<HTMLInputElement>('input[name="website"]');
    expect(honeypot).not.toBeNull();
    honeypot!.value = "http://spam.example.com";

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await screen.findByRole("status");
    expect(submitContactMock).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("shows a rate-limited notice when the server reports throttling", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactSection />);
    vi.advanceTimersByTime(2000);

    submitContactMock.mockResolvedValueOnce({
      ok: false,
      error: "rate_limited",
      retryAfterSeconds: 120,
    });

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/too many attempts/i);
    vi.useRealTimers();
  });
});
