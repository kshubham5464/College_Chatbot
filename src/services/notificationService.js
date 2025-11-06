class NotificationService {
  constructor() {
    this.notifications = [];
    this.permission = 'default';
    this.checkNotificationSupport();
  }

  // Check browser notification support
  checkNotificationSupport() {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notifications');
      return false;
    }
    return true;
  }

  // Request notification permission
  async requestPermission() {
    if (!this.checkNotificationSupport()) return false;

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Show browser notification
  async showBrowserNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Error showing browser notification:', error);
      return null;
    }
  }

  // Show in-app notification
  showInAppNotification(type, message, duration = 5000) {
    const notification = {
      id: Date.now(),
      type,
      message,
      timestamp: Date.now()
    };

    this.notifications.push(notification);

    // Auto-remove after duration
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, duration);

    // Trigger custom event for React components
    window.dispatchEvent(new CustomEvent('notification', {
      detail: notification
    }));

    return notification;
  }

  // Remove notification
  removeNotification(id) {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      this.notifications.splice(index, 1);
      window.dispatchEvent(new CustomEvent('notification_removed', {
        detail: { id }
      }));
    }
  }

  // Get all notifications
  getNotifications() {
    return this.notifications;
  }

  // Clear all notifications
  clearNotifications() {
    this.notifications = [];
    window.dispatchEvent(new CustomEvent('notifications_cleared'));
  }

  // Show welcome notification
  showWelcomeNotification(userType) {
    const messages = {
      student: "Welcome! I'm here to help with your academic queries, course information, and campus updates.",
      parent: "Welcome! I can provide information about admissions, fees, facilities, and your child's progress.",
      visitor: "Welcome to our college! I can help you explore our programs, facilities, and admission process."
    };

    this.showInAppNotification('success', messages[userType] || messages.visitor);
    
    if (this.permission === 'granted') {
      this.showBrowserNotification('College Chatbot', {
        body: messages[userType] || messages.visitor,
        tag: 'welcome'
      });
    }
  }

  // Show new message notification
  showNewMessageNotification(message) {
    this.showInAppNotification('info', `New message: ${message.substring(0, 50)}...`);
    
    if (this.permission === 'granted') {
      this.showBrowserNotification('New Message', {
        body: message.substring(0, 100),
        tag: 'new-message',
        requireInteraction: true
      });
    }
  }

  // Show error notification
  showErrorNotification(error) {
    this.showInAppNotification('error', `Error: ${error}`, 8000);
  }

  // Show success notification
  showSuccessNotification(message) {
    this.showInAppNotification('success', message, 3000);
  }

  // Show warning notification
  showWarningNotification(message) {
    this.showInAppNotification('warning', message, 5000);
  }

  // Show offline notification
  showOfflineNotification() {
    this.showInAppNotification('warning', 'You are offline. Some features may not work properly.');
  }

  // Show online notification
  showOnlineNotification() {
    this.showInAppNotification('success', 'You are back online!');
  }

  // Schedule notification
  scheduleNotification(type, message, delay) {
    setTimeout(() => {
      this.showInAppNotification(type, message);
    }, delay);
  }

  // Check if notifications are enabled
  isEnabled() {
    return this.permission === 'granted';
  }

  // Get notification settings
  getSettings() {
    return {
      permission: this.permission,
      enabled: this.permission === 'granted',
      notifications: this.notifications.length
    };
  }

  // Subscribe to notification events
  subscribe(callback) {
    window.addEventListener('notification', (event) => {
      callback(event.detail);
    });
  }

  // Unsubscribe from notification events
  unsubscribe(callback) {
    window.removeEventListener('notification', callback);
  }
}

export default new NotificationService();
