import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import InputBox from './InputBox';
import { getBotResponse } from '../services/chatbotServices';
import logo from '../assets/logo.jpg';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  //Voice function (TTS)
  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.pitch = 1;
    utter.rate = 1;
    const voices = synth.getVoices();
    utter.voice = voices.find((v) => v.name.includes('Google')) || voices[0];
    synth.speak(utter);
  };
  // Load from localStorage on mount
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages'));
    if (storedMessages && storedMessages.length > 0) {
      setMessages(storedMessages);
    } else {
      setMessages([{ sender: 'bot', text: 'Hello, how can I assist you?' }]);
    }
  }, []);

  // Save messages to localStorage on every update
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (userInput) => {
    if (userInput.trim() === '') return;

    const userMessage = { sender: 'user', text: userInput };
    setLoading(true);

    try {
      const botResponse = await getBotResponse(userInput);
      const botMessage = { sender: 'bot', text: botResponse };

      // Only one setMessages here
      setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);

      // Voice reply
      speak(botResponse);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Clear chat button
  const handleClearChat = () => {
    localStorage.removeItem('chatMessages');
    setMessages([{ sender: 'bot', text: 'Hello, how can I assist you?' }]);
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <img src={logo} alt="Chatbot Logo" className="chatbot-logo" />
        <button onClick={handleClearChat} className="clear-chat-btn">Clear Chat</button>
      </div>

      <ChatWindow messages={messages} loading={loading} />
      <InputBox onSend={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default Chatbot;
