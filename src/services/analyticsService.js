class AnalyticsService {
  constructor() {
    this.events = [];
    this.unansweredQuestions = [];
    this.userSessions = new Map();
    this.startTime = Date.now();
  }

  // Track user interaction
  trackEvent(eventType, data) {
    const event = {
      timestamp: Date.now(),
      type: eventType,
      data: {
        ...data,
        sessionId: this.getSessionId(data.userId),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    };
    
    this.events.push(event);
    
    // Store in localStorage for persistence
    this.persistData();
  }

  // Track message sent
  trackMessage(userId, message, response, metadata = {}) {
    this.trackEvent('message_sent', {
      userId,
      message,
      response,
      metadata
    });

    // Track unanswered questions
    if (metadata.confidence < 0.5 || response.includes("I don't know") || response.includes("I'm not sure")) {
      this.unansweredQuestions.push({
        userId,
        question: message,
        timestamp: Date.now(),
        response
      });
    }
  }

  // Track user session
  trackSession(userId, action = 'start') {
    const sessionId = this.getSessionId(userId);
    
    if (action === 'start') {
      this.userSessions.set(userId, {
        sessionId,
        startTime: Date.now(),
        lastActivity: Date.now(),
        pageViews: 1,
        messages: 0
      });
    } else if (action === 'activity') {
      const session = this.userSessions.get(userId);
      if (session) {
        session.lastActivity = Date.now();
        session.messages += 1;
      }
    } else if (action === 'end') {
      const session = this.userSessions.get(userId);
      if (session) {
        session.endTime = Date.now();
        this.trackEvent('session_end', session);
      }
    }
  }

  // Get session ID
  getSessionId(userId) {
    return `${userId}_${Date.now()}`;
  }

  // Get analytics data
  getAnalytics() {
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    
    const recentEvents = this.events.filter(e => e.timestamp > last24Hours);
    const recentMessages = recentEvents.filter(e => e.type === 'message_sent');
    
    const userStats = new Map();
    recentMessages.forEach(event => {
      const userId = event.data.userId;
      if (!userStats.has(userId)) {
        userStats.set(userId, { messages: 0, sessions: 0 });
      }
      userStats.get(userId).messages += 1;
    });

    const topicAnalysis = this.analyzeTopics(recentMessages);
    const sentimentAnalysis = this.analyzeSentiment(recentMessages);
    
    return {
      totalUsers: userStats.size,
      totalMessages: recentMessages.length,
      averageMessagesPerUser: userStats.size > 0 ? recentMessages.length / userStats.size : 0,
      unansweredQuestions: this.unansweredQuestions.filter(q => q.timestamp > last24Hours).length,
      popularTopics: topicAnalysis,
      sentimentDistribution: sentimentAnalysis,
      peakHours: this.getPeakHours(recentEvents),
      deviceTypes: this.getDeviceTypes(recentEvents),
      topQuestions: this.getTopQuestions(recentMessages)
    };
  }

  // Analyze topics from messages
  analyzeTopics(messages) {
    const topics = {};
    const keywords = {
      admission: ['admission', 'apply', 'eligibility', 'criteria', 'entrance'],
      fees: ['fee', 'cost', 'price', 'payment', 'scholarship'],
      courses: ['course', 'program', 'subject', 'curriculum', 'branch'],
      placement: ['placement', 'job', 'company', 'recruitment', 'package'],
      hostel: ['hostel', 'accommodation', 'room', 'mess', 'food'],
      facilities: ['facility', 'library', 'lab', 'sports', 'wifi', 'gym'],
      contact: ['contact', 'phone', 'email', 'address', 'location']
    };

    messages.forEach(event => {
      const message = event.data.message.toLowerCase();
      
      Object.entries(keywords).forEach(([topic, words]) => {
        if (words.some(word => message.includes(word))) {
          topics[topic] = (topics[topic] || 0) + 1;
        }
      });
    });

    return Object.entries(topics)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }

  // Analyze sentiment
  analyzeSentiment(messages) {
    const sentiments = { positive: 0, neutral: 0, negative: 0 };
    
    messages.forEach(event => {
      const response = event.data.response.toLowerCase();
      
      if (response.includes('thank') || response.includes('great') || response.includes('helpful')) {
        sentiments.positive += 1;
      } else if (response.includes('sorry') || response.includes('unfortunately') || response.includes('issue')) {
        sentiments.negative += 1;
      } else {
        sentiments.neutral += 1;
      }
    });

    return sentiments;
  }

  // Get peak usage hours
  getPeakHours(events) {
    const hours = new Array(24).fill(0);
    
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hours[hour] += 1;
    });

    const peakHours = [];
    hours.forEach((count, hour) => {
      if (count > 0) {
        peakHours.push({ hour: `${hour}:00`, count });
      }
    });

    return peakHours.sort((a, b) => b.count - a.count).slice(0, 5);
  }

  // Get device types
  getDeviceTypes(events) {
    const devices = {};
    
    events.forEach(event => {
      const userAgent = event.data.userAgent;
      let device = 'Desktop';
      
      if (userAgent.includes('Mobile')) device = 'Mobile';
      else if (userAgent.includes('Tablet')) device = 'Tablet';
      
      devices[device] = (devices[device] || 0) + 1;
    });

    return devices;
  }

  // Get top questions
  getTopQuestions(messages) {
    const questions = {};
    
    messages.forEach(event => {
      const question = event.data.message;
      questions[question] = (questions[question] || 0) + 1;
    });

    return Object.entries(questions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  }

  // Get unanswered questions
  getUnansweredQuestions() {
    return this.unansweredQuestions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50);
  }

  // Export data
  exportData() {
    return {
      events: this.events,
      unansweredQuestions: this.unansweredQuestions,
      userSessions: Array.from(this.userSessions.entries()),
      analytics: this.getAnalytics()
    };
  }

  // Import data
  importData(data) {
    if (data.events) this.events = data.events;
    if (data.unansweredQuestions) this.unansweredQuestions = data.unansweredQuestions;
    if (data.userSessions) this.userSessions = new Map(data.userSessions);
  }

  // Persist data to localStorage
  persistData() {
    const data = this.exportData();
    localStorage.setItem('chatbot_analytics', JSON.stringify(data));
  }

  // Load persisted data
  loadPersistedData() {
    const saved = localStorage.getItem('chatbot_analytics');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.importData(data);
      } catch (error) {
        console.error('Error loading persisted analytics:', error);
      }
    }
  }

  // Clear all analytics
  clearAnalytics() {
    this.events = [];
    this.unansweredQuestions = [];
    this.userSessions.clear();
    localStorage.removeItem('chatbot_analytics');
  }
}

export default new AnalyticsService();
