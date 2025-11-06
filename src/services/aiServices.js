// AI Services for advanced chatbot features
class AIServices {
  constructor() {
    this.sentimentHistory = [];
    this.intentPatterns = this.initializeIntentPatterns();
    this.conversationContext = [];
    this.userBehaviorData = [];
  }

  // Initialize intent recognition patterns
  initializeIntentPatterns() {
    return {
      greeting: {
        patterns: [
          "hello",
          "hi",
          "hey",
          "good morning",
          "good afternoon",
          "greetings",
        ],
        confidence: 0.9,
      },
      admission: {
        patterns: [
          "admission",
          "apply",
          "application",
          "entrance",
          "eligibility",
          "requirements",
        ],
        confidence: 0.85,
      },
      fees: {
        patterns: [
          "fee",
          "cost",
          "price",
          "payment",
          "tuition",
          "scholarship",
          "financial",
        ],
        confidence: 0.85,
      },
      courses: {
        patterns: [
          "course",
          "program",
          "degree",
          "curriculum",
          "subjects",
          "syllabus",
        ],
        confidence: 0.8,
      },
      facilities: {
        patterns: [
          "library",
          "hostel",
          "canteen",
          "lab",
          "sports",
          "facilities",
          "infrastructure",
        ],
        confidence: 0.8,
      },
      placement: {
        patterns: [
          "placement",
          "job",
          "career",
          "internship",
          "companies",
          "recruitment",
        ],
        confidence: 0.8,
      },
      complaint: {
        patterns: [
          "problem",
          "issue",
          "complaint",
          "not working",
          "error",
          "help",
          "support",
        ],
        confidence: 0.75,
      },
      appreciation: {
        patterns: [
          "thank",
          "thanks",
          "appreciate",
          "good",
          "excellent",
          "great",
          "awesome",
        ],
        confidence: 0.8,
      },
      goodbye: {
        patterns: ["bye", "goodbye", "see you", "farewell", "exit", "quit"],
        confidence: 0.9,
      },
    };
  }

  // 1. Sentiment Analysis
  analyzeSentiment(text) {
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "wonderful",
      "fantastic",
      "awesome",
      "perfect",
      "love",
      "like",
      "happy",
      "satisfied",
      "pleased",
      "thank",
      "thanks",
      "helpful",
      "useful",
      "clear",
      "easy",
      "simple",
      "quick",
      "fast",
    ];

    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "hate",
      "dislike",
      "angry",
      "frustrated",
      "confused",
      "difficult",
      "hard",
      "slow",
      "problem",
      "issue",
      "error",
      "wrong",
      "not working",
      "broken",
      "useless",
      "unhelpful",
      "complicated",
      "unclear",
    ];

    const neutralWords = [
      "okay",
      "fine",
      "alright",
      "normal",
      "average",
      "standard",
      "regular",
    ];

    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;

    words.forEach((word) => {
      if (positiveWords.some((pw) => word.includes(pw))) positiveScore++;
      if (negativeWords.some((nw) => word.includes(nw))) negativeScore++;
      if (neutralWords.some((neu) => word.includes(neu))) neutralScore++;
    });

    // Calculate overall sentiment
    const totalScore = positiveScore + negativeScore + neutralScore;
    let sentiment, confidence, emotion;

    if (totalScore === 0) {
      sentiment = "neutral";
      confidence = 0.5;
      emotion = "calm";
    } else if (positiveScore > negativeScore) {
      sentiment = "positive";
      confidence = Math.min(0.9, 0.6 + (positiveScore / totalScore) * 0.3);
      emotion = positiveScore > 2 ? "excited" : "happy";
    } else if (negativeScore > positiveScore) {
      sentiment = "negative";
      confidence = Math.min(0.9, 0.6 + (negativeScore / totalScore) * 0.3);
      emotion = negativeScore > 2 ? "frustrated" : "concerned";
    } else {
      sentiment = "neutral";
      confidence = 0.6;
      emotion = "calm";
    }

    const result = {
      sentiment,
      confidence: Math.round(confidence * 100) / 100,
      emotion,
      scores: {
        positive: positiveScore,
        negative: negativeScore,
        neutral: neutralScore,
      },
      timestamp: new Date().toISOString(),
    };

    // Store in history
    this.sentimentHistory.push(result);
    if (this.sentimentHistory.length > 50) {
      this.sentimentHistory.shift(); // Keep only last 50 entries
    }

    return result;
  }

  // 2. Intent Recognition
  recognizeIntent(text) {
    const cleanText = text.toLowerCase().trim();
    const results = [];

    Object.entries(this.intentPatterns).forEach(([intent, data]) => {
      let matchScore = 0;
      let matchedPatterns = [];

      data.patterns.forEach((pattern) => {
        if (cleanText.includes(pattern)) {
          matchScore += 1;
          matchedPatterns.push(pattern);
        }
      });

      if (matchScore > 0) {
        const confidence = Math.min(
          0.95,
          data.confidence * (matchScore / data.patterns.length)
        );
        results.push({
          intent,
          confidence: Math.round(confidence * 100) / 100,
          matchedPatterns,
          matchScore,
        });
      }
    });

    // Sort by confidence and return top result
    results.sort((a, b) => b.confidence - a.confidence);

    return {
      primaryIntent: results[0] || {
        intent: "unknown",
        confidence: 0.3,
        matchedPatterns: [],
      },
      allIntents: results,
      timestamp: new Date().toISOString(),
    };
  }

  // 3. Smart Response Suggestions
  generateResponseSuggestions(
    userMessage,
    sentiment,
    intent,
    conversationHistory = []
  ) {
    const suggestions = [];
    const primaryIntent = intent.primaryIntent.intent;
    const userSentiment = sentiment.sentiment;

    // Base suggestions based on intent
    const intentSuggestions = {
      greeting: [
        "Hello! Welcome to SAITM. How can I assist you today?",
        "Hi there! I'm here to help you with any questions about SAITM.",
        "Good day! What information can I provide about our college?",
      ],
      admission: [
        "I'd be happy to help with admission information. What specific details would you like to know?",
        "For admissions, you can visit our website or contact the admission office. What's your area of interest?",
        "Let me guide you through our admission process. Which program are you interested in?",
      ],
      fees: [
        "I can provide information about our fee structure. Which program are you asking about?",
        "Our fees vary by program. Would you like details for a specific course?",
        "Fee information is available on our website. I can help you find the right details.",
      ],
      complaint: [
        "I understand your concern. Let me help you resolve this issue.",
        "I'm sorry to hear about this problem. Can you provide more details so I can assist better?",
        "Thank you for bringing this to our attention. How can we help fix this?",
      ],
      appreciation: [
        "Thank you for your kind words! Is there anything else I can help you with?",
        "I'm glad I could help! Feel free to ask if you have more questions.",
        "You're very welcome! Let me know if you need any other information.",
      ],
    };

    // Adjust suggestions based on sentiment
    if (userSentiment === "negative") {
      suggestions.push(
        "I understand this might be frustrating. Let me help you find a solution.",
        "I'm sorry you're experiencing difficulties. How can I make this better for you?",
        "Thank you for your patience. Let me address your concerns right away."
      );
    } else if (userSentiment === "positive") {
      suggestions.push(
        "I'm glad to help! What other information can I provide?",
        "Great to hear! Is there anything else you'd like to know?",
        "Wonderful! How else can I assist you today?"
      );
    }

    // Add intent-specific suggestions
    if (intentSuggestions[primaryIntent]) {
      suggestions.push(...intentSuggestions[primaryIntent]);
    }

    // Context-aware suggestions based on conversation history
    if (conversationHistory.length > 0) {
      const lastBotMessage =
        conversationHistory[conversationHistory.length - 1];
      if (lastBotMessage && lastBotMessage.sender === "bot") {
        suggestions.push(
          "Would you like me to explain that in more detail?",
          "Do you have any follow-up questions about what I just mentioned?",
          "Is there a specific aspect you'd like to know more about?"
        );
      }
    }

    // Remove duplicates and limit to top 5
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 5);

    return {
      suggestions: uniqueSuggestions.map((text, index) => ({
        id: index + 1,
        text,
        confidence: Math.round((0.9 - index * 0.1) * 100) / 100,
        category: this.categorizeSuggestion(text),
      })),
      context: {
        intent: primaryIntent,
        sentiment: userSentiment,
        conversationLength: conversationHistory.length,
      },
      timestamp: new Date().toISOString(),
    };
  }

  categorizeSuggestion(text) {
    if (text.includes("sorry") || text.includes("understand")) return "empathy";
    if (text.includes("help") || text.includes("assist")) return "assistance";
    if (text.includes("information") || text.includes("details"))
      return "informational";
    if (text.includes("thank") || text.includes("welcome")) return "courtesy";
    return "general";
  }

  // 4. Conversation Summarization
  summarizeConversation(messages) {
    if (!messages || messages.length === 0) {
      return {
        summary: "No conversation to summarize.",
        keyPoints: [],
        sentiment: "neutral",
        duration: 0,
      };
    }

    const userMessages = messages.filter((msg) => msg.sender === "user");
    const botMessages = messages.filter((msg) => msg.sender === "bot");

    // Extract key topics
    const topics = new Set();
    const sentiments = [];

    userMessages.forEach((msg) => {
      const intent = this.recognizeIntent(msg.text);
      const sentiment = this.analyzeSentiment(msg.text);

      if (intent.primaryIntent.intent !== "unknown") {
        topics.add(intent.primaryIntent.intent);
      }
      sentiments.push(sentiment.sentiment);
    });

    // Calculate overall sentiment
    const sentimentCounts = sentiments.reduce((acc, sentiment) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {});

    const overallSentiment = Object.keys(sentimentCounts).reduce((a, b) =>
      sentimentCounts[a] > sentimentCounts[b] ? a : b
    );

    // Generate summary
    const topicsArray = Array.from(topics);
    const duration =
      messages.length > 1
        ? new Date(messages[messages.length - 1].timestamp) -
          new Date(messages[0].timestamp)
        : 0;

    const summary = this.generateSummaryText(
      topicsArray,
      userMessages.length,
      overallSentiment
    );

    return {
      summary,
      keyPoints: this.extractKeyPoints(messages, topicsArray),
      topics: topicsArray,
      sentiment: overallSentiment,
      messageCount: messages.length,
      userQueries: userMessages.length,
      botResponses: botMessages.length,
      duration: Math.round(duration / 1000 / 60), // in minutes
      timestamp: new Date().toISOString(),
    };
  }

  generateSummaryText(topics, queryCount, sentiment) {
    const topicText =
      topics.length > 0
        ? `The user inquired about ${topics.join(", ")}`
        : "The user had a general conversation";

    const sentimentText =
      sentiment === "positive"
        ? "with a positive tone"
        : sentiment === "negative"
        ? "expressing some concerns"
        : "in a neutral manner";

    return `${topicText} ${sentimentText}. Total of ${queryCount} user queries were addressed.`;
  }

  extractKeyPoints(messages, topics) {
    const keyPoints = [];

    // Add topic-based key points
    topics.forEach((topic) => {
      keyPoints.push(`Discussed ${topic.replace("_", " ")}`);
    });

    // Add conversation flow points
    if (messages.length > 5) {
      keyPoints.push("Extended conversation with multiple exchanges");
    }

    // Add sentiment-based points
    const userMessages = messages.filter((msg) => msg.sender === "user");
    const negativeSentiments = userMessages.filter(
      (msg) => this.analyzeSentiment(msg.text).sentiment === "negative"
    );

    if (negativeSentiments.length > 0) {
      keyPoints.push("User expressed concerns or frustrations");
    }

    return keyPoints.slice(0, 5); // Limit to 5 key points
  }

  // 5. Predictive Analytics
  predictUserNeeds(userHistory, currentMessage) {
    const predictions = [];

    // Analyze user behavior patterns
    const behaviorPattern = this.analyzeUserBehavior(userHistory);
    const currentIntent = this.recognizeIntent(currentMessage);

    // Predict next likely questions based on current intent
    const nextQuestions = this.predictNextQuestions(
      currentIntent.primaryIntent.intent
    );

    // Predict user satisfaction
    const satisfactionPrediction = this.predictSatisfaction(userHistory);

    // Predict escalation probability
    const escalationRisk = this.predictEscalation(userHistory, currentMessage);

    return {
      nextLikelyQuestions: nextQuestions,
      userSatisfaction: satisfactionPrediction,
      escalationRisk: escalationRisk,
      behaviorPattern: behaviorPattern,
      recommendations: this.generateRecommendations(
        behaviorPattern,
        currentIntent
      ),
      timestamp: new Date().toISOString(),
    };
  }

  analyzeUserBehavior(userHistory) {
    if (!userHistory || userHistory.length === 0) {
      return { pattern: "new_user", confidence: 0.9 };
    }

    const patterns = {
      explorer: 0, // Asks many different types of questions
      focused: 0, // Sticks to one topic
      impatient: 0, // Short messages, negative sentiment
      thorough: 0, // Detailed questions, follows up
    };

    const topics = new Set();
    let avgMessageLength = 0;
    let negativeCount = 0;

    userHistory.forEach((msg) => {
      const intent = this.recognizeIntent(msg.text);
      const sentiment = this.analyzeSentiment(msg.text);

      topics.add(intent.primaryIntent.intent);
      avgMessageLength += msg.text.length;

      if (sentiment.sentiment === "negative") negativeCount++;
    });

    avgMessageLength /= userHistory.length;

    // Calculate pattern scores
    patterns.explorer = topics.size / Math.max(userHistory.length, 1);
    patterns.focused = 1 - patterns.explorer;
    patterns.impatient =
      negativeCount / userHistory.length + (avgMessageLength < 20 ? 0.3 : 0);
    patterns.thorough =
      (avgMessageLength > 50 ? 0.4 : 0) + (userHistory.length > 5 ? 0.3 : 0);

    // Find dominant pattern
    const dominantPattern = Object.keys(patterns).reduce((a, b) =>
      patterns[a] > patterns[b] ? a : b
    );

    return {
      pattern: dominantPattern,
      confidence: Math.round(patterns[dominantPattern] * 100) / 100,
      scores: patterns,
      metrics: {
        topicDiversity: topics.size,
        avgMessageLength: Math.round(avgMessageLength),
        negativeRatio:
          Math.round((negativeCount / userHistory.length) * 100) / 100,
      },
    };
  }

  predictNextQuestions(currentIntent) {
    const questionMap = {
      admission: [
        "What are the eligibility criteria?",
        "When is the application deadline?",
        "What documents are required?",
        "How much are the application fees?",
      ],
      fees: [
        "Are there any scholarships available?",
        "Can I pay fees in installments?",
        "What are the hostel charges?",
        "Are there any additional fees?",
      ],
      courses: [
        "What is the duration of the course?",
        "What are the career prospects?",
        "What subjects are covered?",
        "Are there any practical sessions?",
      ],
      facilities: [
        "What are the library timings?",
        "Are there sports facilities?",
        "How is the hostel accommodation?",
        "What about transportation?",
      ],
    };

    return (
      questionMap[currentIntent] || [
        "Can you provide more information?",
        "Where can I find additional details?",
        "Who should I contact for this?",
      ]
    );
  }

  predictSatisfaction(userHistory) {
    if (!userHistory || userHistory.length === 0) {
      return { level: "unknown", confidence: 0.5, score: 50 };
    }

    let positiveCount = 0;
    let negativeCount = 0;
    let totalMessages = userHistory.length;

    userHistory.forEach((msg) => {
      const sentiment = this.analyzeSentiment(msg.text);
      if (sentiment.sentiment === "positive") positiveCount++;
      if (sentiment.sentiment === "negative") negativeCount++;
    });

    const satisfactionScore =
      ((positiveCount - negativeCount) / totalMessages + 1) * 50;
    let level = "neutral";

    if (satisfactionScore > 70) level = "high";
    else if (satisfactionScore < 30) level = "low";

    return {
      level,
      score: Math.round(satisfactionScore),
      confidence: Math.min(0.9, totalMessages / 10),
      factors: {
        positiveInteractions: positiveCount,
        negativeInteractions: negativeCount,
        totalInteractions: totalMessages,
      },
    };
  }

  predictEscalation(userHistory, currentMessage) {
    let riskScore = 0;

    // Check current message sentiment
    const currentSentiment = this.analyzeSentiment(currentMessage);
    if (currentSentiment.sentiment === "negative") riskScore += 30;
    if (currentSentiment.emotion === "frustrated") riskScore += 20;

    // Check for escalation keywords
    const escalationKeywords = [
      "manager",
      "supervisor",
      "complaint",
      "unsatisfied",
      "terrible",
      "awful",
    ];
    if (
      escalationKeywords.some((keyword) =>
        currentMessage.toLowerCase().includes(keyword)
      )
    ) {
      riskScore += 40;
    }

    // Check conversation history
    if (userHistory && userHistory.length > 3) {
      const recentNegative = userHistory
        .slice(-3)
        .filter(
          (msg) => this.analyzeSentiment(msg.text).sentiment === "negative"
        ).length;
      riskScore += recentNegative * 15;
    }

    let riskLevel = "low";
    if (riskScore > 60) riskLevel = "high";
    else if (riskScore > 30) riskLevel = "medium";

    return {
      level: riskLevel,
      score: Math.min(100, riskScore),
      factors: {
        currentSentiment: currentSentiment.sentiment,
        hasEscalationKeywords: escalationKeywords.some((keyword) =>
          currentMessage.toLowerCase().includes(keyword)
        ),
        recentNegativePattern: userHistory
          ? userHistory
              .slice(-3)
              .filter(
                (msg) =>
                  this.analyzeSentiment(msg.text).sentiment === "negative"
              ).length > 1
          : false,
      },
    };
  }

  generateRecommendations(behaviorPattern, currentIntent) {
    const recommendations = [];

    // Behavior-based recommendations
    switch (behaviorPattern.pattern) {
      case "explorer":
        recommendations.push(
          "Provide comprehensive overview with multiple topic options"
        );
        recommendations.push("Use quick reply buttons for easy navigation");
        break;
      case "focused":
        recommendations.push(
          "Provide detailed information on the current topic"
        );
        recommendations.push("Offer related subtopics for deeper exploration");
        break;
      case "impatient":
        recommendations.push("Keep responses concise and direct");
        recommendations.push("Prioritize quick solutions and clear next steps");
        break;
      case "thorough":
        recommendations.push("Provide detailed explanations with examples");
        recommendations.push("Offer additional resources and documentation");
        break;
    }

    // Intent-based recommendations
    if (currentIntent.primaryIntent.confidence > 0.8) {
      recommendations.push(
        `High confidence in ${currentIntent.primaryIntent.intent} intent - provide specific information`
      );
    } else {
      recommendations.push("Intent unclear - ask clarifying questions");
    }

    return recommendations;
  }

  // Get analytics summary
  getAnalyticsSummary() {
    return {
      sentimentHistory: this.sentimentHistory.slice(-10), // Last 10 sentiment analyses
      totalAnalyses: this.sentimentHistory.length,
      averageSentiment: this.calculateAverageSentiment(),
      topIntents: this.getTopIntents(),
      timestamp: new Date().toISOString(),
    };
  }

  calculateAverageSentiment() {
    if (this.sentimentHistory.length === 0) return "neutral";

    const sentimentCounts = this.sentimentHistory.reduce((acc, item) => {
      acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
      return acc;
    }, {});
  }
}

export default AIServices;