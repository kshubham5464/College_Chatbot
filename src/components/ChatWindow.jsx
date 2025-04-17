import React, { useEffect, useRef } from "react";

const ChatWindow = ({ messages, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  return (
    <div
      className="chat-window"
      style={{
        overflowY: "auto",
        maxHeight: "400px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message-bubble ${msg.sender}`}
          style={{
            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
            backgroundColor: msg.sender === "user" ? "#d1ffd1" : "#f0f0f0",
            borderRadius:
              msg.sender === "user" ? "16px 16px 0px 16px" : "16px 16px 16px 0px",
            padding: "10px 14px",
            maxWidth: "75%",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            whiteSpace: "pre-wrap",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>
            {msg.sender === "bot" ? "🤖" : "🧑‍💻"} {msg.text}
          </span>
        </div>
      ))}

      {loading && (
        <div
          style={{
            fontStyle: "italic",
            color: "#888",
            padding: "5px",
            alignSelf: "flex-start",
          }}
        >
          🤖 Typing...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
