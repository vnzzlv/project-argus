import { useState, useRef, useEffect } from "react";

export default function VisionChat({ messages, onSendMessage }) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="vision-chat-container">
      <div className="vision-chat-header">
        <span>VISION INTERFACE</span>
        <div className="vision-status-dot"></div>
      </div>

      <div className="vision-chat-body">
        {messages.length === 0 && (
          <div className="vision-msg system">
            <p>Sistema online. Digite um comando, senhor.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`vision-msg ${msg.sender}`}>
            {msg.sender === "vision" && (
              <span className="msg-name">VISION:</span>
            )}
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form className="vision-chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite para o VISION..."
        />
        <button type="submit" className="send-btn">
          ENVIAR
        </button>
      </form>
    </div>
  );
}
