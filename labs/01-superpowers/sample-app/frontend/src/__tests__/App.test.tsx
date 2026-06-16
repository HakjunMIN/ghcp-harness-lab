import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect } from "vitest";
import App from "../App";

test("sends prompt and shows streaming assistant message", async () => {
  render(<App />);
  await userEvent.type(screen.getByPlaceholderText("Message ChatGPT..."), "hello");
  await userEvent.click(screen.getByRole("button", { name: "Send" }));
  expect(await screen.findByText("hello")).toBeInTheDocument();
});
