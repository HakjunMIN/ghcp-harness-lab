import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import App from "../App";

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn((input: RequestInfo | URL) => {
    const url = String(input);

    if (url === "/api/conversations") {
      return Promise.resolve(
        new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );
    }

    if (url === "/api/chat/stream") {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('event: done\ndata: {"content":"Hello back"}\n\n'));
          controller.close();
        },
      });

      return Promise.resolve(
        new Response(stream, {
          status: 200,
          headers: { "Content-Type": "text/event-stream" },
        })
      );
    }

    return Promise.resolve(new Response("", { status: 404 }));
  });
});

test("renders the redesigned app shell", async () => {
  render(<App />);

  expect(screen.getByRole("button", { name: "New chat" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "What can I help with?" })).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Message ChatGPT...")).toBeInTheDocument();
  expect(await screen.findByText("No conversations yet")).toBeInTheDocument();
});

test("displays user message after sending", async () => {
  const user = userEvent.setup();
  render(<App />);
  await screen.findByText("No conversations yet");

  const input = screen.getByPlaceholderText("Message ChatGPT...");
  const button = screen.getByRole("button", { name: "Send" });

  await user.type(input, "hello");
  await user.click(button);

  expect(await screen.findByText("hello")).toBeInTheDocument();
  expect(await screen.findByText("Hello back")).toBeInTheDocument();
  expect(input).toHaveValue("");
});

test("send button disabled when input is empty", async () => {
  const user = userEvent.setup();
  render(<App />);
  await screen.findByText("No conversations yet");

  const button = screen.getByRole("button", { name: "Send" });

  expect(button).toBeDisabled();

  await user.type(screen.getByPlaceholderText("Message ChatGPT..."), "text");
  expect(button).not.toBeDisabled();

  await user.clear(screen.getByPlaceholderText("Message ChatGPT..."));
  expect(button).toBeDisabled();
});
