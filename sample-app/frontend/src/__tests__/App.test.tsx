import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("sends prompt and shows the user message", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByPlaceholderText("Message ChatGPT..."), "hello");
  await user.click(screen.getByRole("button", { name: "Send" }));

  expect(await screen.findByText("hello")).toBeTruthy();
});
