export function ChatPanel({ messages }: { messages: { role: string; content: string }[] }) {
  return (
    <section style={{flex:1,padding:16}}>
      {messages.map((m, idx) => (
        <div key={idx}>{m.content}</div>
      ))}
    </section>
  );
}
