import { type KeyboardEvent, useState } from "react";

export function Composer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const trimmedText = text.trim();
  const cannotSend = Boolean(disabled) || trimmedText.length === 0;

  const submit = () => {
    if (cannotSend) {
      return;
    }

    onSend(trimmedText);
    setText("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      className="composer-wrap"
      aria-label="Message composer"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className="composer-shell">
        <button className="composer-action" type="button" aria-label="Add context" disabled={disabled}>
          +
        </button>
        <textarea
          className="composer-input"
          placeholder="Message ChatGPT..."
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
        <button className="composer-send" type="submit" disabled={cannotSend}>
          Send
        </button>
      </div>
    </form>
  );
}
