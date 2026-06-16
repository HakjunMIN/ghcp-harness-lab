export function ChatPanel({ messages }: { messages: { id: string; role: string; content: string }[] }) {
  return (
    <section style={{flex:1,padding:16}}>
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
    </section>
  );
}
