import React, { useEffect, useRef, useState } from "react";
import { Mic, Send, X } from "lucide-react";

const InputBox = ({ 
  onSend, 
  disabled, 
  voiceTriggeredRef, 
  darkMode, 
  editingMessage,
  onCancelEdit,
  isFloatingMode,
  isFullscreen
}) => {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const inputRef = useRef();
  
  // Update input when editing a message
  useEffect(() => {
    if (editingMessage) {
      setInput(editingMessage.text);
      inputRef.current.focus();
    } else {
      setInput('');
    }
  }, [editingMessage]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed !== "") {
      onSend(trimmed);
      setInput("");
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
    if (e.key === "Escape" && editingMessage) onCancelEdit();
  };

  // 🎤 Voice-to-Text Handler with Auto-Submit
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);

      // ✅ Wait for input to update before sending
      setTimeout(() => {
        if (transcript.trim() !== "") {
          voiceTriggeredRef.current = true; // Mark mic used
          onSend(transcript.trim()); // Auto-send
          setInput("");
        }
      }, 200); // Wait a bit to ensure `setInput` completes
    };

    recognition.onerror = (event) => {
      console.error("Voice Error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  // 🎯 Auto focus and type on any key press
  useEffect(() => {
    const handleGlobalKey = (e) => {
      const isInputFocused = document.activeElement === inputRef.current;

      if (
        !isInputFocused &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        e.key.length === 1
      ) {
        inputRef.current.focus();
        setInput((prev) => prev + e.key);
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, []);

  return (
    <div className={`input-box-container ${darkMode ? 'dark-theme' : ''} ${isFloatingMode ? 'floating-mode' : ''} ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {editingMessage && (
        <div className="editing-indicator">
          <span>Editing message</span>
          <button 
            onClick={onCancelEdit} 
            className="cancel-edit-btn"
            title="Cancel editing"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={editingMessage ? "Edit your message..." : isFloatingMode ? "Ask me anything..." : "Type or speak your message..."}
        disabled={disabled}
        className={`input-field ${darkMode ? 'dark-theme' : ''} ${editingMessage ? 'editing' : ''} ${isFloatingMode ? 'floating-mode' : ''}`}
        style={{
          backgroundColor: darkMode ? '#333' : '#fff',
          color: darkMode ? '#fff' : '#000',
          borderColor: darkMode ? '#555' : '#ccc',
          borderLeftColor: editingMessage ? '#ffa500' : (darkMode ? '#555' : '#ccc'),
          fontSize: isFloatingMode ? '0.9rem' : '1rem'
        }}
      />

      {!editingMessage && (
        <button
          onClick={handleVoiceInput}
          className={`mic-btn ${listening ? "listening" : ""} ${darkMode ? 'dark-theme' : ''}`}
          title={listening ? "Listening..." : "Start voice input"}
          disabled={disabled}
          style={{
            backgroundColor: darkMode ? '#444' : '#4f46e5'
          }}
        >
          <Mic size={20} color={darkMode ? '#fff' : '#fff'} />
        </button>
      )}

      <button
        onClick={handleSend}
        className={`send-btn ${darkMode ? 'dark-theme' : ''} ${isFloatingMode ? 'floating-mode' : ''}`}
        disabled={disabled || !input.trim()}
        style={{
          backgroundColor: darkMode ? '#444' : '#4f46e5',
          opacity: (disabled || !input.trim()) ? 0.5 : 1
        }}
      >
        <Send size={isFloatingMode ? 16 : 20} color={darkMode ? '#fff' : '#fff'} />
      </button>
    </div>
  );
};

export default InputBox;
