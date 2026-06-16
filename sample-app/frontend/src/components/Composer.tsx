import { useState } from "react";

type ComposerProps = {
  onSend: (value: string) => void;
};

export function Composer({ onSend }: ComposerProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    onSend(trimmed);
    setValue("");
  };

  return (
    <form
      className="composer"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <textarea
        aria-label="Message"
        placeholder="Message ChatGPT..."
        rows={1}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
