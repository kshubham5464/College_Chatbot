import React, { useState } from 'react';
import { Mic, Send } from 'lucide-react';
// import './InputBox.css';

const InputBox = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);

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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      //  Auto-submit when speech ends
      handleSend();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Voice Error:', event.error);
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div className="input-box-container">
      <input
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
