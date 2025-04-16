import React, { useEffect, useRef } from "react";
import Message from "./Message";

const ChatWindow = ({ messages, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToBottom();
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
      }}
    >
      {messages.map((msg, idx) => (
        <Message key={idx} sender={msg.sender} text={msg.text} />
      ))}

      {loading && (
        <div style={{ fontStyle: "italic", color: "#888", padding: "5px" }}>
          Typing...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
