import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ConversationNav } from "./ConversationNav";

function mockFetch(response: Response) {
  global.fetch = vi.fn(() => Promise.resolve(response));
}

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("ConversationNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the empty conversation state", async () => {
    mockFetch(jsonResponse({ items: [] }));

    render(<ConversationNav activeConversationId={undefined} onSelect={vi.fn()} />);

    expect(screen.getByRole("button", { name: "New chat" })).toBeInTheDocument();
    expect(await screen.findByText("No conversations yet"))
      .toBeInTheDocument();
  });

  test("marks the active conversation", async () => {
    mockFetch(jsonResponse({
      items: [{ id: "conv-1", title: "Design review", created_at: "2026-06-16T00:00:00Z" }],
    }));

    render(<ConversationNav activeConversationId="conv-1" onSelect={vi.fn()} />);

    const activeItem = await screen.findByRole("button", { name: "Design review" });
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  test("selects a conversation", async () => {
    const onSelect = vi.fn();
    mockFetch(jsonResponse({
      items: [{ id: "conv-1", title: "Design review", created_at: "2026-06-16T00:00:00Z" }],
    }));

    render(<ConversationNav activeConversationId={undefined} onSelect={onSelect} />);

    await userEvent.click(await screen.findByRole("button", { name: "Design review" }));
    expect(onSelect).toHaveBeenCalledWith("conv-1");
  });

  test("shows an inline error when conversations fail to load", async () => {
    mockFetch(new Response("", { status: 500 }));

    render(<ConversationNav activeConversationId={undefined} onSelect={vi.fn()} />);

    expect(await screen.findByRole("status")).toHaveTextContent("Could not load conversations: HTTP 500");
  });

  test("shows a friendly error when the API returns non-json content", async () => {
    mockFetch(
      new Response("<!DOCTYPE html>", {
        status: 200,
        headers: { "Content-Type": "text/html" },
      })
    );

    render(<ConversationNav activeConversationId={undefined} onSelect={vi.fn()} />);

    expect(await screen.findByRole("status"))
      .toHaveTextContent("Could not load conversations: Backend returned a non-JSON response");
  });
});