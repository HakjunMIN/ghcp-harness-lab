import { useState } from "react";

export function Composer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  return (
    <div style={{ padding: 16 }}>
      <input
        placeholder="Message ChatGPT..."
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        disabled={disabled}
      />
      <button
        onClick={() => {
          if (text.trim()) {
            onSend(text);
            setText("");
          }
        }}
        disabled={disabled || !text.trim()}
      >
        Send
      </button>
    </div>
  );
}
