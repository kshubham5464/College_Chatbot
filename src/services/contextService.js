class ContextService {
  constructor() {
    this.conversationHistory = new Map();
    this.userProfiles = new Map();
    this.maxHistoryLength = 10;
  }

  // Store conversation context
  addToHistory(userId, message, response, metadata = {}) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }

    const history = this.conversationHistory.get(userId);
    history.push({
      timestamp: new Date().toISOString(),
      message,
      response,
      metadata,
      intent: metadata.intent || 'general',
      sentiment: metadata.sentiment || 'neutral'
    });

    // Keep only last N messages
    if (history.length > this.maxHistoryLength) {
      history.shift();
    }
  }

  // Get conversation context
  getContext(userId, limit = 5) {
    const history = this.conversationHistory.get(userId) || [];
    return history.slice(-limit);
  }

  // Get user profile
  getUserProfile(userId) {
    return this.userProfiles.get(userId) || {
      userType: 'general',
      preferences: {},
      lastVisit: new Date(),
      totalInteractions: 0
    };
  }

  // Update user profile
  updateUserProfile(userId, profileData) {
    const existing = this.getUserProfile(userId);
    this.userProfiles.set(userId, {
      ...existing,
      ...profileData,
      lastVisit: new Date(),
      totalInteractions: existing.totalInteractions + 1
    });
  }

  // Detect conversation topic
  detectTopic(messages) {
    const topics = {
      admission: ['admission', 'apply', 'process', 'eligibility', 'criteria'],
      fees: ['fee', 'cost', 'price', 'payment', 'structure'],
      courses: ['course', 'program', 'specialization', 'subject', 'curriculum'],
      placement: ['placement', 'job', 'company', 'recruitment', 'career'],
      hostel: ['hostel', 'accommodation', 'room', 'stay', 'mess'],
      facilities: ['facility', 'library', 'lab', 'sports', 'wifi', 'gym'],
      contact: ['contact', 'phone', 'email', 'address', 'reach']
    };

    const recentMessages = messages.slice(-3).map(m => m.message.toLowerCase());
    const words = recentMessages.join(' ').split(' ');

    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => words.some(word => word.includes(keyword)))) {
        return topic;
      }
    }

    return 'general';
  }

  // Generate contextual response
  generateContextualResponse(userId, currentMessage, baseResponse) {
    const context = this.getContext(userId);
    const topic = this.detectTopic(context);
    
    // Add context-aware enhancements
    let enhancedResponse = baseResponse;
    
    // If continuing same topic, add continuity
    if (context.length > 0 && topic !== 'general') {
      const lastMessage = context[context.length - 1];
      if (lastMessage.intent === 'follow-up') {
        enhancedResponse = `As I mentioned earlier, ${baseResponse}`;
      }
    }

    // Add personalized greeting for returning users
    const profile = this.getUserProfile(userId);
    if (profile.totalInteractions > 1 && context.length === 0) {
      enhancedResponse = `Welcome back! ${baseResponse}`;
    }

    return enhancedResponse;
  }

  // Clear context for user
  clearContext(userId) {
    this.conversationHistory.delete(userId);
  }

  // Get analytics data
  getAnalytics() {
    const totalUsers = this.conversationHistory.size;
    const totalInteractions = Array.from(this.conversationHistory.values())
      .reduce((sum, history) => sum + history.length, 0);
    
    const topics = {};
    this.conversationHistory.forEach(history => {
      history.forEach(item => {
        const topic = item.metadata.topic || 'general';
        topics[topic] = (topics[topic] || 0) + 1;
      });
    });

    return {
      totalUsers,
      totalInteractions,
      averageInteractionsPerUser: totalUsers > 0 ? totalInteractions / totalUsers : 0,
      topicDistribution: topics
    };
  }
}

export default new ContextService();
