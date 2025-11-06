import React, { useEffect, useRef } from "react";
import { Edit, Clock } from "lucide-react";
import AnimatedAvatar from "./AnimatedAvatar";
import QuickReplies from './QuickReplies';
import SuggestedQuestions from './SuggestedQuestions';

const ChatWindow = ({ 
  messages, 
  loading, 
  darkMode, 
  bubbleColor, 
  onEditMessage,
  typingSpeed,
  userType,
  isFloatingMode,
  isFullscreen,
  onQuickReply
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);
  
  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get recent user queries for context-aware suggestions
  const getRecentQueries = () => {
    return messages
      .filter(msg => msg.sender === 'user')
      .slice(-3)
      .map(msg => msg.text);
  };

  return (
    <div
      className={`chat-window ${darkMode ? 'dark-theme' : ''} ${isFloatingMode ? 'floating-mode' : ''} ${isFullscreen ? 'fullscreen-mode' : ''}`}
      style={{
        overflowY: "auto",
        maxHeight: isFullscreen ? "calc(100vh - 200px)" : isFloatingMode ? "300px" : "400px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        backgroundColor: darkMode ? "#1a1a1a" : "#fff",
      }}
    >
      {/* Suggested Questions - Show at the beginning if no messages */}
      {messages.length <= 1 && !loading && (
        <SuggestedQuestions
          userType={userType}
          messages={messages}
          onQuestionSelect={onQuickReply}
          darkMode={darkMode}
        />
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message-bubble ${msg.sender} ${userType?.type || 'visitor'}-theme`}
          style={{
            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
            backgroundColor: msg.sender === "user" 
              ? (darkMode ? bubbleColor.userDark : bubbleColor.user) 
              : (darkMode ? bubbleColor.botDark : bubbleColor.bot),
            color: darkMode ? "#ffffff" : "#000000",
            borderRadius:
              msg.sender === "user" ? "16px 16px 0px 16px" : "16px 16px 16px 0px",
            padding: "10px 14px",
            maxWidth: isFloatingMode ? "85%" : "75%",
            boxShadow: darkMode 
              ? "0 2px 4px rgba(0,0,0,0.3)" 
              : "0 2px 4px rgba(0,0,0,0.1)",
            whiteSpace: "pre-wrap",
            position: "relative"
          }}
        >
          {msg.sender === "bot" && isFloatingMode && (
            <div className="floating-avatar-mini">
              <AnimatedAvatar 
                isTyping={false}
                userType={userType?.type || 'visitor'}
                darkMode={darkMode}
              />
            </div>
          )}
          
          <div className="message-content">
            <span style={{ fontSize: isFloatingMode ? "0.95rem" : "1.1rem" }}>
              {!isFloatingMode && (msg.sender === "bot" ? "🤖" : "🧑‍💻")} {msg.text}
            </span>
            
            <div className="message-footer">
              <div className="message-timestamp">
                <Clock size={12} />
                <span>{formatTime(msg.timestamp)}</span>
              </div>
              
              <div className="message-actions">
                {msg.sender === "user" && (
                  <button 
                    className="edit-btn" 
                    onClick={() => onEditMessage(msg)}
                    title="Edit message"
                  >
                    <Edit size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {loading && (
        <div
          className={`typing-indicator ${typingSpeed} ${userType?.type || 'visitor'}-theme`}
          style={{
            fontStyle: "italic",
            color: darkMode ? "#aaaaaa" : "#888",
            padding: "5px",
            alignSelf: "flex-start",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {isFloatingMode && (
            <div className="typing-avatar-mini">
              <AnimatedAvatar 
                isTyping={true}
                userType={userType?.type || 'visitor'}
                darkMode={darkMode}
              />
            </div>
          )}
          {!isFloatingMode && "🤖"} <span className="typing-dots"><span>.</span><span>.</span><span>.</span></span>
        </div>
      )}

      {/* Quick Replies - Show after bot messages and when not loading */}
      {!loading && messages.length > 1 && messages[messages.length - 1]?.sender === 'bot' && (
        <QuickReplies
          userType={userType}
          onQuickReply={onQuickReply}
          darkMode={darkMode}
          recentQueries={getRecentQueries()}
        />
      )}

      {/* Context-aware Suggested Questions - Show periodically */}
      {!loading && messages.length > 3 && messages.length % 4 === 0 && (
        <SuggestedQuestions
          userType={userType}
          messages={messages}
          onQuestionSelect={onQuickReply}
          darkMode={darkMode}
        />
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
