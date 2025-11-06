import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from './ChatWindow';
import InputBox from './InputBox';
import UserTypeSelector from './UserTypeSelector';
import AnimatedAvatar from './AnimatedAvatar';
import { getBotResponse } from '../services/chatbotServices';
import { Moon, Sun, Minimize2, Maximize2, Settings, User, Users, GraduationCap } from 'lucide-react';

const Chatbot = ({ darkMode: propDarkMode, setDarkMode: propSetDarkMode, isFloatingMode, isFullscreen }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const voiceTriggeredRef = useRef(false);
  const [darkMode, setDarkMode] = useState(propDarkMode || false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [bubbleColor, setBubbleColor] = useState({
    user: '#d1ffd1',
    bot: '#f0f0f0',
    userDark: '#2e7d32',
    botDark: '#333333'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState('medium');
  const [editingMessage, setEditingMessage] = useState(null);
  const [userType, setUserType] = useState(null);
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false);
  
  // Helper function to get icon by name
  const getIconByName = (iconName) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap size={16} />;
      case 'Users':
        return <Users size={16} />;
      case 'User':
        return <User size={16} />;
      default:
        return <User size={16} />;
    }
  };
  
  // Voice function (TTS)
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
  
  // Sync with parent dark mode
  useEffect(() => {
    if (propDarkMode !== undefined) {
      setDarkMode(propDarkMode);
    }
  }, [propDarkMode]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages'));
    const savedUserType = localStorage.getItem('userType');
    
    if (savedUserType) {
      const parsedUserType = JSON.parse(savedUserType);
      setUserType(parsedUserType);
    }
    
    if (storedMessages && storedMessages.length > 0 && savedUserType) {
      setMessages(storedMessages);
    } else if (savedUserType) {
      const parsedUserType = JSON.parse(savedUserType);
      setMessages([{ 
        id: Date.now(), 
        sender: 'bot',
        text: parsedUserType.greeting,
        timestamp: new Date().toISOString()
      }]);
    } else {
      setShowUserTypeSelector(true);
    }
    
    // Load other preferences from localStorage
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme && propDarkMode === undefined) {
      setDarkMode(savedTheme === 'true');
    }
    
    const savedBubbleColors = localStorage.getItem('bubbleColors');
    if (savedBubbleColors) {
      setBubbleColor(JSON.parse(savedBubbleColors));
    }
    
    const savedTypingSpeed = localStorage.getItem('typingSpeed');
    if (savedTypingSpeed) {
      setTypingSpeed(savedTypingSpeed);
    }
  }, [propDarkMode]);

  // Save messages to localStorage on every update
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);
  
  // Apply theme when darkMode changes
  useEffect(() => {
    if (propSetDarkMode) {
      propSetDarkMode(darkMode);
    } else {
      localStorage.setItem('darkMode', darkMode);
    }
    
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode, propSetDarkMode]);
  
  // Save bubble colors when they change
  useEffect(() => {
    localStorage.setItem('bubbleColors', JSON.stringify(bubbleColor));
  }, [bubbleColor]);
  
  // Save typing speed when it changes
  useEffect(() => {
    localStorage.setItem('typingSpeed', typingSpeed);
  }, [typingSpeed]);

  const handleSendMessage = async (userInput) => {
    if (userInput.trim() === '') return;
    
    // If we're editing a message, update it instead of sending a new one
    if (editingMessage) {
      const updatedMessages = messages.map(msg => 
        msg.id === editingMessage.id ? {...msg, text: userInput} : msg
      );
      setMessages(updatedMessages);
      setEditingMessage(null);
      return;
    }

    const userMessage = { 
      id: Date.now(), 
      sender: 'user', 
      text: userInput,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setLoading(true);

    try {
      // Get bot response with user type context
      const botResponse = getBotResponse(userInput, userType);
      
      // Simulate variable typing time based on message length and selected speed
      const typingDelayPerChar = {
        slow: 100,
        medium: 50,
        fast: 20
      }[typingSpeed];
      
      const typingDelay = Math.min(
        Math.max(botResponse.length * typingDelayPerChar, 500), // Min 500ms
        5000 // Max 5 seconds
      );
      
      // Wait for the calculated typing delay
      await new Promise(resolve => setTimeout(resolve, typingDelay));
      
      const botMessage = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: botResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);

      // Only speak if mic was used
      if (voiceTriggeredRef.current) {
        speak(botResponse);
        voiceTriggeredRef.current = false; // reset
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Show error message to user
      const errorMessage = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: `Sorry, I encountered an error while processing your request. ${getFallbackErrorMessage(userType?.type)}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function for error messages
  const getFallbackErrorMessage = (userTypeString) => {
    switch (userTypeString) {
      case 'student':
        return "Please try again or contact the student helpline at +91-8102309831.";
      case 'parent':
        return "Please try again or contact the parent helpline at +91-8102309830.";
      case 'visitor':
        return "Please try again or contact the admission helpline at +91-8102309831.";
      default:
        return "Please try again or contact our general helpline at +91-8102309830.";
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem('chatMessages');
    const greeting = userType ? userType.greeting : 'Hello, how can I assist you?';
    setMessages([{ 
      id: Date.now(), 
      sender: 'bot', 
      text: greeting,
      timestamp: new Date().toISOString()
    }]);
  };

  const handleUserTypeSelect = (selectedUserType) => {
    setUserType(selectedUserType);
    localStorage.setItem('userType', JSON.stringify(selectedUserType));
    setShowUserTypeSelector(false);
    
    // Set initial greeting message
    setMessages([{ 
      id: Date.now(), 
      sender: 'bot',
      text: selectedUserType.greeting,
      timestamp: new Date().toISOString()
    }]);
  };

  const handleChangeUserType = () => {
    setShowUserTypeSelector(true);
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  // Toggle collapsed state
  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
    if (showSettings) setShowSettings(false);
  };
  
  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };
  
  // Handle color change
  const handleColorChange = (role, color) => {
    setBubbleColor(prev => ({
      ...prev,
      [role]: color
    }));
  };
  
  // Remove the handleReaction function since it's no longer used
  
  // Start editing a message
  const handleEditMessage = (message) => {
    if (message.sender === 'user') {
      setEditingMessage(message);
    }
  };

  // Show user type selector if no user type is selected
  if (showUserTypeSelector) {
    return (
      <div className={`chatbot user-type-selection ${darkMode ? 'dark-theme' : ''} ${isFloatingMode ? 'floating-mode' : ''} ${isFullscreen ? 'fullscreen-mode' : ''}`}>
        <UserTypeSelector 
          onSelectUserType={handleUserTypeSelect}
          darkMode={darkMode}
        />
      </div>
    );
  }

  return (
    <div className={`chatbot ${darkMode ? 'dark-theme' : ''} ${isCollapsed ? 'collapsed' : ''} ${isFloatingMode ? 'floating-mode' : ''} ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {!isFloatingMode && (
        <div className="chatbot-header">
          <div className="header-left">
            <AnimatedAvatar 
              isTyping={loading}
              userType={userType?.type || 'visitor'}
              darkMode={darkMode}
            />
            <div className="header-info">
              <h3>SAITM Assistant</h3>
              <span className="user-type-badge">{userType?.label || 'Visitor'}</span>
            </div>
          </div>
          
          <div className="header-buttons">
            <button onClick={handleChangeUserType} className="user-type-btn" aria-label="Change user type">
              <User size={18} />
            </button>
            <button onClick={toggleSettings} className="settings-btn" aria-label="Settings">
              <Settings size={18} />
            </button>
            <button onClick={toggleDarkMode} className="theme-toggle-btn" aria-label="Toggle theme">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {!isFullscreen && (
              <button onClick={toggleCollapse} className="collapse-btn" aria-label="Toggle collapse">
                {isCollapsed ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
            )}
            <button onClick={handleClearChat} className="clear-chat-btn">Clear Chat</button>
          </div>
        </div>
      )}
      
      {showSettings && (
        <div className={`settings-panel ${darkMode ? 'dark-theme' : ''}`}>
          <h3>Customize Chat</h3>
          
          <div className="user-type-setting">
            <label>Current Mode:</label>
            <div className="current-user-type">
              <span className="user-type-indicator" style={{ color: userType?.color }}>
                {userType?.iconName && getIconByName(userType.iconName)} {userType?.label}
              </span>
              <button onClick={handleChangeUserType} className="change-type-btn">
                Change
              </button>
            </div>
          </div>
          
          <div className="color-settings">
            <div className="color-option">
              <label>Your Messages:</label>
              <input 
                type="color" 
                value={darkMode ? bubbleColor.userDark : bubbleColor.user} 
                onChange={(e) => handleColorChange(darkMode ? 'userDark' : 'user', e.target.value)} 
              />
            </div>
            <div className="color-option">
              <label>Bot Messages:</label>
              <input 
                type="color" 
                value={darkMode ? bubbleColor.botDark : bubbleColor.bot} 
                onChange={(e) => handleColorChange(darkMode ? 'botDark' : 'bot', e.target.value)} 
              />
            </div>
          </div>
          
          <div className="typing-speed-setting">
            <label>Typing Speed:</label>
            <select 
              value={typingSpeed} 
              onChange={(e) => setTypingSpeed(e.target.value)}
            >
              <option value="slow">Slow</option>
              <option value="medium">Medium</option>
              <option value="fast">Fast</option>
            </select>
          </div>
        </div>
      )}

      {!isCollapsed && (
        <>
          <ChatWindow 
            messages={messages} 
            loading={loading} 
            darkMode={darkMode} 
            bubbleColor={bubbleColor}
            onEditMessage={handleEditMessage}
            typingSpeed={typingSpeed}
            userType={userType}
            isFloatingMode={isFloatingMode}
            isFullscreen={isFullscreen}
            onQuickReply={handleSendMessage}
          />
          <InputBox
            onSend={handleSendMessage}
            disabled={loading}
            voiceTriggeredRef={voiceTriggeredRef}
            darkMode={darkMode}
            editingMessage={editingMessage}
            onCancelEdit={() => setEditingMessage(null)}
            isFloatingMode={isFloatingMode}
            isFullscreen={isFullscreen}
            userType={userType}
          />
        </>
      )}
    </div>
  );
};

export default Chatbot;
