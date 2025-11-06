import React, { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import './NotificationPanel.css';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(notificationService.getSettings());

  useEffect(() => {
    // Load initial notifications
    setNotifications(notificationService.getNotifications());

    // Subscribe to notification events
    const handleNotification = (event) => {
      setNotifications(prev => [...prev, event.detail]);
    };

    const handleNotificationRemoved = (event) => {
      setNotifications(prev => prev.filter(n => n.id !== event.detail.id));
    };

    const handleNotificationsCleared = () => {
      setNotifications([]);
    };

    window.addEventListener('notification', handleNotification);
    window.addEventListener('notification_removed', handleNotificationRemoved);
    window.addEventListener('notifications_cleared', handleNotificationsCleared);

    return () => {
      window.removeEventListener('notification', handleNotification);
      window.removeEventListener('notification_removed', handleNotificationRemoved);
      window.removeEventListener('notifications_cleared', handleNotificationsCleared);
    };
  }, []);

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setSettings(notificationService.getSettings());
    
    if (granted) {
      notificationService.showSuccessNotification('Notifications enabled!');
    }
  };

  const handleClearAll = () => {
    notificationService.clearNotifications();
  };

  const handleRemoveNotification = (id) => {
    notificationService.removeNotification(id);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getNotificationClass = (type) => {
    return `notification-item notification-${type}`;
  };

  return (
    <div className="notification-panel">
      <button 
        className="notification-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle notifications"
      >
        <span className="notification-icon">🔔</span>
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {notifications.length > 0 && (
                <button 
                  className="clear-all-btn"
                  onClick={handleClearAll}
                  title="Clear all notifications"
                >
                  Clear All
                </button>
              )}
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="notification-settings">
            <div className="setting-item">
              <span>Browser Notifications</span>
              {settings.permission === 'granted' ? (
                <span className="status enabled">✅ Enabled</span>
              ) : (
                <button 
                  className="enable-btn"
                  onClick={handleRequestPermission}
                >
                  Enable
                </button>
              )}
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={getNotificationClass(notification.type)}
                >
                  <div className="notification-content">
                    <span className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="notification-text">
                      <p>{notification.message}</p>
                      <small>
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveNotification(notification.id)}
                    title="Remove notification"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
