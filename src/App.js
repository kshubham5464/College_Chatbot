import React, { useState, useEffect } from 'react';
import Chatbot from './components/Chatbot';
import AdminPanel from './components/AdminPanel';
import './App.css';
import oipImage from './assets/OIP.jpeg';
import { MessageCircle, X, Maximize2, Settings } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isFloatingMode, setIsFloatingMode] = useState(false);
  const [isFloatingMinimized, setIsFloatingMinimized] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Check for saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    const savedFloatingMode = localStorage.getItem('floatingMode');
    const savedFullscreen = localStorage.getItem('fullscreenMode');
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
    if (savedFloatingMode) {
      setIsFloatingMode(savedFloatingMode === 'true');
    }
    if (savedFullscreen) {
      setIsFullscreen(savedFullscreen === 'true');
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('floatingMode', isFloatingMode);
  }, [isFloatingMode]);

  useEffect(() => {
    localStorage.setItem('fullscreenMode', isFullscreen);
  }, [isFullscreen]);

  // Admin access key combination (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        const password = prompt('Enter admin password:');
        if (password === 'admin123') {
          setShowAdminPanel(true);
        } else if (password !== null) {
          alert('Invalid password!');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFloatingMode = () => {
    setIsFloatingMode(!isFloatingMode);
    setIsFloatingMinimized(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleAdminAccess = () => {
    const password = prompt('Enter admin password:');
    if (password === 'admin123') {
      setShowAdminPanel(true);
    } else if (password !== null) {
      alert('Invalid password!');
    }
  };

  // Regular embedded mode
  if (!isFloatingMode && !isFullscreen) {
    return (
      <div className={`App ${darkMode ? 'dark-theme' : ''}`}>
        <div className="app-header">
          <img src={oipImage} alt="chatbot" className="chatbot-image" />
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2rem',
            color: darkMode ? '#f0f0f0' : '#333'
          }}>
            Hello User, Welcome to our Chatbot. Please ask your query.
          </h2>
          
          {/* Admin Access Button */}
          <button 
            className="admin-access-btn"
            onClick={handleAdminAccess}
            title="Admin Panel (Ctrl+Shift+A)"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            <Settings size={20} />
          </button>
          
          <div className="app-controls">
            <button 
              onClick={toggleFloatingMode} 
              className="mode-toggle-btn floating-btn"
              title="Switch to Floating Mode"
            >
              <MessageCircle size={20} />
              Floating Mode
            </button>
            <button 
              onClick={toggleFullscreen} 
              className="mode-toggle-btn fullscreen-btn"
              title="Switch to Fullscreen Mode"
            >
              <Maximize2 size={20} />
              Fullscreen
            </button>
          </div>
        </div>
        
        <Chatbot 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          isFloatingMode={false}
          isFullscreen={false}
        />

        {/* Admin Panel Modal */}
        {showAdminPanel && (
          <AdminPanel 
            darkMode={darkMode}
            onClose={() => setShowAdminPanel(false)}
          />
        )}
      </div>
    );
  }

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className={`App fullscreen-mode ${darkMode ? 'dark-theme' : ''}`}>
        <div className="fullscreen-header">
          <div className="fullscreen-title">
            <img src={oipImage} alt="chatbot" className="chatbot-image-small" />
            <h3>SAITM Chatbot - Fullscreen Mode</h3>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Admin Access Button in Fullscreen */}
            <button 
              onClick={handleAdminAccess}
              className="exit-fullscreen-btn"
              title="Admin Panel"
              style={{ marginRight: '10px' }}
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={toggleFullscreen} 
              className="exit-fullscreen-btn"
              title="Exit Fullscreen"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <Chatbot 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          isFloatingMode={false}
          isFullscreen={true}
        />

        {/* Admin Panel Modal */}
        {showAdminPanel && (
          <AdminPanel 
            darkMode={darkMode}
            onClose={() => setShowAdminPanel(false)}
          />
        )}
      </div>
    );
  }

  // Floating widget mode
  return (
    <div className={`App floating-widget-mode ${darkMode ? 'dark-theme' : ''}`}>
      {/* Main page content (simulated) */}
      <div className="main-page-content">
        <div className="demo-content">
          <h1>SAITM College Website</h1>
          <p>This is a demo of how the floating chatbot widget would appear on your website.</p>
          
          {/* Admin Access Button in Floating Mode */}
          <button 
            onClick={handleAdminAccess}
            style={{
              position: 'fixed',
              top: '20px',
              right: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease',
              zIndex: 9999
            }}
            title="Admin Panel"
          >
            <Settings size={20} />
          </button>
          
          <div className="demo-sections">
            <div className="demo-section">
              <h3>About Us</h3>
              <p>Welcome to SAITM College - Your gateway to excellence in education.</p>
            </div>
            <div className="demo-section">
              <h3>Courses</h3>
              <p>We offer B.Tech, BCA, BBA, M.Tech, MCA, MBA, and B.Pharma programs.</p>
            </div>
            <div className="demo-section">
              <h3>Admissions</h3>
              <p>Admissions are now open. Apply online through our portal.</p>
            </div>
          </div>
          
          <button 
            onClick={toggleFloatingMode} 
            className="exit-floating-btn"
          >
            Exit Floating Mode (Back to Embedded)
          </button>
        </div>
      </div>

      {/* Floating Chat Widget */}
      <div className={`floating-chat-widget ${isFloatingMinimized ? 'minimized' : 'expanded'} ${darkMode ? 'dark-theme' : ''}`}>
        {isFloatingMinimized ? (
          <div 
            className="floating-chat-trigger"
            onClick={() => setIsFloatingMinimized(false)}
          >
            <MessageCircle size={24} />
            <div className="chat-notification">
              <span className="notification-dot"></span>
            </div>
            <div className="trigger-tooltip">Need help? Click to chat!</div>
          </div>
        ) : (
          <div className="floating-chat-container">
            <div className="floating-chat-header">
              <div className="floating-header-info">
                <img src={oipImage} alt="chatbot" className="floating-avatar" />
                <div>
                  <h4>SAITM Assistant</h4>
                  <span className="online-status">Online</span>
                </div>
              </div>
              <div className="floating-header-controls">
                <button 
                  onClick={toggleFullscreen}
                  className="floating-control-btn"
                  title="Open in Fullscreen"
                >
                  <Maximize2 size={16} />
                </button>
                <button 
                  onClick={() => setIsFloatingMinimized(true)}
                  className="floating-control-btn"
                  title="Minimize"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <Chatbot 
              darkMode={darkMode} 
              setDarkMode={setDarkMode}
              isFloatingMode={true}
              isFullscreen={false}
            />
          </div>
        )}
      </div>

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel 
          darkMode={darkMode}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  );
}

export default App;
