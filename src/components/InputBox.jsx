import React, { useEffect, useRef, useState } from 'react';
import { Mic, Send } from 'lucide-react';

const InputBox = ({ onSend, disabled, voiceTriggeredRef }) => {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const inputRef = useRef();

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed !== '') {
      onSend(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // 🎤 Voice-to-Text Handler with Auto-Submit
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in your browser');
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
  
    recognition.onstart = () => setListening(true);
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
  
      // ✅ Wait for input to update before sending
      setTimeout(() => {
        if (transcript.trim() !== '') {
          voiceTriggeredRef.current = true; // Mark mic used
          onSend(transcript.trim()); // Auto-send
          setInput('');
        }
      }, 200); // Wait a bit to ensure `setInput` completes
    };
  
    recognition.onerror = (event) => {
      console.error('Voice Error:', event.error);
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

    document.addEventListener('keydown', handleGlobalKey);
    return () => document.removeEventListener('keydown', handleGlobalKey);
  }, []);

  return (
    <div className="input-box-container">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type or speak your message..."
        disabled={disabled}
        className="input-field"
      />

      <button
        onClick={handleVoiceInput}
        className={`mic-btn ${listening ? 'listening' : ''}`}
        title={listening ? 'Listening...' : 'Start voice input'}
        disabled={disabled}
      >
        <Mic size={20} />
      </button>

      <button
        onClick={handleSend}
        className="send-btn"
        disabled={disabled || !input.trim()}
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default InputBox;
