import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ChatPanel } from "./ChatPanel";

describe("ChatPanel", () => {
  test("renders the empty chat welcome state", () => {
    render(<ChatPanel messages={[]} isStreaming={false} />);

    expect(screen.getByRole("heading", { name: "What can I help with?" })).toBeInTheDocument();
    expect(screen.getByText("Start a conversation and responses will appear here."))
      .toBeInTheDocument();
  });

  test("renders user and assistant messages with role labels", () => {
    render(
      <ChatPanel
        isStreaming={false}
        messages={[
          { id: "user-1", role: "user", content: "hello" },
          { id: "assistant-1", role: "assistant", content: "Hi there." },
        ]}
      />
    );

    expect(screen.getByLabelText("User message")).toHaveTextContent("hello");
    expect(screen.getByLabelText("Assistant message")).toHaveTextContent("Hi there.");
  });

  test("shows a streaming indicator after assistant content", () => {
    render(
      <ChatPanel
        isStreaming={true}
        messages={[{ id: "assistant-1", role: "assistant", content: "Working" }]}
      />
    );

    expect(screen.getByText("Streaming response")).toBeInTheDocument();
  });
});