import React, { useState, useEffect } from 'react';

const AnimatedAvatar = ({ isTyping, userType, darkMode }) => {
  const [currentExpression, setCurrentExpression] = useState('neutral');
  const [isBlinking, setIsBlinking] = useState(false);

  // Avatar expressions based on user type and state
  const avatarStyles = {
    student: {
      primary: '#4f46e5',
      secondary: '#818cf8',
      personality: 'friendly'
    },
    parent: {
      primary: '#059669',
      secondary: '#34d399',
      personality: 'professional'
    },
    visitor: {
      primary: '#dc2626',
      secondary: '#f87171',
      personality: 'welcoming'
    }
  };

  const currentStyle = avatarStyles[userType] || avatarStyles.visitor;

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Expression changes based on typing state
  useEffect(() => {
    if (isTyping) {
      setCurrentExpression('thinking');
    } else {
      setCurrentExpression('neutral');
    }
  }, [isTyping]);

  return (
    <div className={`animated-avatar ${darkMode ? 'dark-theme' : ''} ${currentStyle.personality}`}>
      <div className="avatar-container">
        {/* Main avatar circle */}
        <div 
          className={`avatar-face ${currentExpression} ${isTyping ? 'typing' : ''}`}
          style={{ 
            background: `linear-gradient(135deg, ${currentStyle.primary}, ${currentStyle.secondary})` 
          }}
        >
          {/* Eyes */}
          <div className={`avatar-eyes ${isBlinking ? 'blinking' : ''}`}>
            <div className="eye left-eye">
              <div className="pupil"></div>
            </div>
            <div className="eye right-eye">
              <div className="pupil"></div>
            </div>
          </div>

          {/* Mouth */}
          <div className={`avatar-mouth ${currentExpression}`}>
            {isTyping && (
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>

          {/* Personality indicators */}
          {currentStyle.personality === 'friendly' && (
            <div className="personality-indicator friendly">
              <div className="sparkle sparkle-1">✨</div>
              <div className="sparkle sparkle-2">✨</div>
            </div>
          )}
          
          {currentStyle.personality === 'professional' && (
            <div className="personality-indicator professional">
              <div className="tie"></div>
            </div>
          )}
          
          {currentStyle.personality === 'welcoming' && (
            <div className="personality-indicator welcoming">
              <div className="wave-hand">👋</div>
            </div>
          )}
        </div>

        {/* Floating particles for animation */}
        <div className="avatar-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
        </div>

        {/* Status indicator */}
        <div className={`status-indicator ${isTyping ? 'active' : 'idle'}`}>
          <div className="status-dot"></div>
        </div>
      </div>

      {/* Avatar name/type label */}
      <div className="avatar-label">
        <span className="avatar-name">
          {userType === 'student' && '🎓 Academic Assistant'}
          {userType === 'parent' && '👨‍👩‍👧‍👦 Parent Guide'}
          {userType === 'visitor' && '🏫 Campus Guide'}
        </span>
      </div>
    </div>
  );
};

export default AnimatedAvatar;
