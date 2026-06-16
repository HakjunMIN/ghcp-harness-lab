import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { Composer } from "./Composer";

describe("Composer", () => {
  test("disables send when the prompt is empty", () => {
    render(<Composer onSend={vi.fn()} disabled={false} />);

    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  test("sends trimmed text and clears the textarea", async () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} disabled={false} />);

    const textbox = screen.getByPlaceholderText("Message ChatGPT...");
    await userEvent.type(textbox, "  hello  ");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(onSend).toHaveBeenCalledWith("hello");
    expect(textbox).toHaveValue("");
  });

  test("submits with Enter and keeps newline with Shift Enter", async () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} disabled={false} />);

    const textbox = screen.getByPlaceholderText("Message ChatGPT...");
    await userEvent.type(textbox, "line one{shift>}{enter}{/shift}line two");
    expect(textbox).toHaveValue("line one\nline two");

    await userEvent.keyboard("{enter}");
    expect(onSend).toHaveBeenCalledWith("line one\nline two");
    expect(textbox).toHaveValue("");
  });

  test("does not submit while disabled", async () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} disabled={true} />);

    await userEvent.type(screen.getByPlaceholderText("Message ChatGPT..."), "hello");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(onSend).not.toHaveBeenCalled();
  });
});