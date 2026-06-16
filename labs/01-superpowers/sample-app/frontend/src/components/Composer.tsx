import { useState } from "react";

export function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div style={{padding:16}}>
      <input
        placeholder="Message ChatGPT..."
        value={text}
        onChange={(e) => setText((e.target as HTMLInputElement).value)}
      />
      <button onClick={() => { onSend(text); setText(""); }}>Send</button>
    </div>
  );
}
