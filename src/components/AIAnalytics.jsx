import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  Heart, 
  Target, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Lightbulb,
  Zap,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

const AIAnalytics = ({ darkMode, messages = [], aiAnalytics = null }) => {
  const [activeTab, setActiveTab] = useState('sentiment');
  const [analyticsData, setAnalyticsData] = useState({
    sentiment: [],
    intents: [],
    predictions: [],
    summaries: []
  });

  useEffect(() => {
    // Simulate AI analytics data if not provided
    if (!aiAnalytics) {
      generateMockAnalytics();
    } else {
      setAnalyticsData(aiAnalytics);
    }
  }, [aiAnalytics, messages]);

  const generateMockAnalytics = () => {
    const mockData = {
      sentiment: [
        { time: '10:00', sentiment: 'positive', confidence: 0.85, emotion: 'happy' },
        { time: '10:15', sentiment: 'neutral', confidence: 0.72, emotion: 'calm' },
        { time: '10:30', sentiment: 'negative', confidence: 0.78, emotion: 'frustrated' },
        { time: '10:45', sentiment: 'positive', confidence: 0.91, emotion: 'satisfied' },
        { time: '11:00', sentiment: 'positive', confidence: 0.88, emotion: 'excited' }
      ],
      intents: [
        { intent: 'admission', count: 45, confidence: 0.89 },
        { intent: 'fees', count: 32, confidence: 0.85 },
        { intent: 'courses', count: 28, confidence: 0.82 },
        { intent: 'facilities', count: 21, confidence: 0.79 },
        { intent: 'placement', count: 18, confidence: 0.76 }
      ],
      predictions: {
        userSatisfaction: { level: 'high', score: 78, trend: 'up' },
        escalationRisk: { level: 'low', score: 15, trend: 'down' },
        nextQuestions: [
          'What are the admission requirements?',
          'How much are the fees?',
          'What courses are available?'
        ]
      },
      summaries: [
        {
          id: 1,
          summary: 'User inquired about admission process with positive sentiment',
          keyPoints: ['Discussed eligibility criteria', 'Provided application timeline'],
          duration: 5,
          sentiment: 'positive'
        },
        {
          id: 2,
          summary: 'Fee-related queries with some concerns about costs',
          keyPoints: ['Discussed fee structure', 'Mentioned scholarship options'],
          duration: 8,
          sentiment: 'neutral'
        }
      ]
    };
    setAnalyticsData(mockData);
  };

  const tabs = [
    { id: 'sentiment', label: 'Sentiment Analysis', icon: <Heart size={18} /> },
    { id: 'intent', label: 'Intent Recognition', icon: <Target size={18} /> },
    { id: 'predictions', label: 'Predictive Analytics', icon: <TrendingUp size={18} /> },
    { id: 'summaries', label: 'Conversation Summaries', icon: <MessageSquare size={18} /> }
  ];

  const renderSentimentAnalysis = () => (
    <div className="ai-section">
      <div className="ai-metrics-grid">
        <div className="ai-metric-card">
          <div className="metric-header">
            <Heart className="metric-icon positive" size={24} />
            <div className="metric-info">
              <h4>Overall Sentiment</h4>
              <p className="metric-value positive">Positive</p>
            </div>
          </div>
          <div className="metric-details">
            <span>68% positive interactions</span>
          </div>
        </div>

        <div className="ai-metric-card">
          <div className="metric-header">
            <BarChart3 className="metric-icon info" size={24} />
            <div className="metric-info">
              <h4>Confidence Score</h4>
              <p className="metric-value">84%</p>
            </div>
          </div>
          <div className="metric-details">
            <span>High accuracy in detection</span>
          </div>
        </div>

        <div className="ai-metric-card">
          <div className="metric-header">
            <TrendingUp className="metric-icon success" size={24} />
            <div className="metric-info">
              <h4>Sentiment Trend</h4>
              <p className="metric-value success">Improving</p>
            </div>
          </div>
          <div className="metric-details">
            <span>+12% from last week</span>
          </div>
        </div>
      </div>

      <div className="sentiment-timeline">
        <h4>Sentiment Timeline</h4>
        <div className="timeline-container">
          {analyticsData.sentiment.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-time">{item.time}</div>
              <div className={`sentiment-indicator ${item.sentiment}`}>
                {item.sentiment === 'positive' && <ArrowUp size={16} />}
                {item.sentiment === 'negative' && <ArrowDown size={16} />}
                {item.sentiment === 'neutral' && <Minus size={16} />}
              </div>
              <div className="sentiment-details">
                <span className={`sentiment-label ${item.sentiment}`}>
                  {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                </span>
                <span className="confidence-score">{Math.round(item.confidence * 100)}%</span>
                <span className="emotion-tag">{item.emotion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sentiment-distribution">
        <h4>Sentiment Distribution</h4>
        <div className="distribution-bars">
          <div className="distribution-item">
            <span className="distribution-label">Positive</span>
            <div className="distribution-bar">
              <div className="distribution-fill positive" style={{ width: '68%' }}></div>
            </div>
            <span className="distribution-value">68%</span>
          </div>
          <div className="distribution-item">
            <span className="distribution-label">Neutral</span>
            <div className="distribution-bar">
              <div className="distribution-fill neutral" style={{ width: '22%' }}></div>
            </div>
            <span className="distribution-value">22%</span>
          </div>
          <div className="distribution-item">
            <span className="distribution-label">Negative</span>
            <div className="distribution-bar">
              <div className="distribution-fill negative" style={{ width: '10%' }}></div>
            </div>
            <span className="distribution-value">10%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntentRecognition = () => (
    <div className="ai-section">
      <div className="intent-overview">
        <div className="ai-metric-card">
          <div className="metric-header">
            <Target className="metric-icon primary" size={24} />
            <div className="metric-info">
              <h4>Intent Accuracy</h4>
              <p className="metric-value">91%</p>
            </div>
          </div>
          <div className="metric-details">
            <span>Successfully identified user intents</span>
          </div>
        </div>

        <div className="ai-metric-card">
          <div className="metric-header">
            <Eye className="metric-icon info" size={24} />
            <div className="metric-info">
              <h4>Recognized Intents</h4>
              <p className="metric-value">144</p>
            </div>
          </div>
          <div className="metric-details">
            <span>Total intents processed today</span>
          </div>
        </div>
      </div>

      <div className="intent-breakdown">
        <h4>Top Recognized Intents</h4>
        <div className="intent-list">
          {analyticsData.intents.map((intent, index) => (
            <div key={index} className="intent-item">
              <div className="intent-info">
                <span className="intent-name">{intent.intent.charAt(0).toUpperCase() + intent.intent.slice(1)}</span>
                <span className="intent-count">{intent.count} queries</span>
              </div>
              <div className="intent-metrics">
                <div className="intent-bar">
                  <div 
                    className="intent-fill" 
                    style={{ width: `${(intent.count / 45) * 100}%` }}
                  ></div>
                </div>
                <span className="confidence-badge">
                  {Math.round(intent.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="intent-patterns">
        <h4>Intent Patterns</h4>
        <div className="pattern-grid">
          <div className="pattern-card">
            <h5>Peak Hours</h5>
            <p>10 AM - 12 PM</p>
            <span className="pattern-detail">Most admission queries</span>
          </div>
          <div className="pattern-card">
            <h5>Common Flow</h5>
            <p>Greeting → Admission → Fees</p>
            <span className="pattern-detail">Typical user journey</span>
          </div>
          <div className="pattern-card">
            <h5>Complex Queries</h5>
            <p>15% require clarification</p>
            <span className="pattern-detail">Multi-intent messages</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPredictiveAnalytics = () => (
    <div className="ai-section">
      <div className="prediction-overview">
        <div className="ai-metric-card">
          <div className="metric-header">
            <CheckCircle className="metric-icon success" size={24} />
            <div className="metric-info">
              <h4>User Satisfaction</h4>
              <p className="metric-value success">{analyticsData.predictions.userSatisfaction.score}%</p>
            </div>
          </div>
          <div className="metric-details">
            <span className={`trend ${analyticsData.predictions.userSatisfaction.trend}`}>
              {analyticsData.predictions.userSatisfaction.trend === 'up' ? '↑' : '↓'} Trending {analyticsData.predictions.userSatisfaction.trend}
            </span>
          </div>
        </div>

        <div className="ai-metric-card">
          <div className="metric-header">
            <AlertTriangle className="metric-icon warning" size={24} />
            <div className="metric-info">
              <h4>Escalation Risk</h4>
              <p className="metric-value warning">{analyticsData.predictions.escalationRisk.score}%</p>
            </div>
          </div>
          <div className="metric-details">
            <span className={`trend ${analyticsData.predictions.escalationRisk.trend}`}>
              {analyticsData.predictions.escalationRisk.trend === 'down' ? '↓' : '↑'} Risk {analyticsData.predictions.escalationRisk.trend}
            </span>
          </div>
        </div>

        <div className="ai-metric-card">
          <div className="metric-header">
            <Lightbulb className="metric-icon primary" size={24} />
            <div className="metric-info">
              <h4>Prediction Accuracy</h4>
              <p className="metric-value">87%</p>
            </div>
          </div>
          <div className="metric-details">
            <span>Based on historical data</span>
          </div>
        </div>
      </div>

      <div className="predictions-section">
        <div className="prediction-card">
          <h4>
            <Zap size={20} />
            Next Likely Questions
          </h4>
          <div className="prediction-list">
            {analyticsData.predictions.nextQuestions.map((question, index) => (
              <div key={index} className="prediction-item">
                <span className="prediction-probability">{90 - index * 10}%</span>
                <span className="prediction-text">{question}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="prediction-card">
          <h4>
            <Users size={20} />
            User Behavior Patterns
          </h4>
          <div className="behavior-patterns">
            <div className="pattern-item">
              <span className="pattern-type">Explorer</span>
              <div className="pattern-bar">
                <div className="pattern-fill" style={{ width: '45%' }}></div>
              </div>
              <span className="pattern-percentage">45%</span>
            </div>
            <div className="pattern-item">
              <span className="pattern-type">Focused</span>
              <div className="pattern-bar">
                <div className="pattern-fill" style={{ width: '30%' }}></div>
              </div>
              <span className="pattern-percentage">30%</span>
            </div>
            <div className="pattern-item">
              <span className="pattern-type">Thorough</span>
              <div className="pattern-bar">
                <div className="pattern-fill" style={{ width: '25%' }}></div>
              </div>
              <span className="pattern-percentage">25%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="recommendations-section">
        <h4>AI Recommendations</h4>
        <div className="recommendations-list">
          <div className="recommendation-item high">
            <AlertTriangle size={16} />
            <span>Monitor users showing frustration patterns - potential escalation risk</span>
          </div>
          <div className="recommendation-item medium">
            <Lightbulb size={16} />
            <span>Add more detailed fee information to reduce repetitive queries</span>
          </div>
          <div className="recommendation-item low">
            <CheckCircle size={16} />
            <span>Current response time is optimal for user satisfaction</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConversationSummaries = () => (
    <div className="ai-section">
      <div className="summaries-overview">
        <div className="ai-metric-card">
          <div className="metric-header">
            <MessageSquare className="metric-icon primary" size={24} />
            <div className="metric-info">
              <h4>Conversations Today</h4>
              <p className="metric-value">127</p>
            </div>
          </div>
          <div className="metric-details">
            <span>+18% from yesterday</span>
          </div>
        </div>

        <div className="ai-metric-card">
          <div className="metric-header">
            <Clock className="metric-icon info" size={24} />
            <div className="metric-info">
              <h4>Avg Duration</h4>
              <p className="metric-value">6.5 min</p>
            </div>
          </div>
          <div className="metric-details">
            <span>Optimal engagement time</span>
          </div>
        </div>

        <div className="ai-metric-card">
          <div className="metric-header">
            <Brain className="metric-icon success" size={24} />
            <div className="metric-info">
              <h4>Auto-Summarized</h4>
              <p className="metric-value">98%</p>
            </div>
          </div>
          <div className="metric-details">
            <span>Successfully processed</span>
          </div>
        </div>
      </div>

      <div className="summaries-list">
        <h4>Recent Conversation Summaries</h4>
        {analyticsData.summaries.map((summary) => (
          <div key={summary.id} className="summary-card">
            <div className="summary-header">
              <div className="summary-meta">
                <span className={`sentiment-badge ${summary.sentiment}`}>
                  {summary.sentiment}
                </span>
                <span className="duration-badge">
                  <Clock size={12} />
                  {summary.duration} min
                </span>
              </div>
              <div className="summary-actions">
                <button className="action-btn view">
                  <Eye size={14} />
                </button>
              </div>
            </div>
            <div className="summary-content">
              <p className="summary-text">{summary.summary}</p>
              <div className="key-points">
                <h5>Key Points:</h5>
                <ul>
                  {summary.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="summary-insights">
        <h4>Summary Insights</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <h5>Most Discussed Topics</h5>
            <div className="topic-list">
              <span className="topic-tag">Admission (34%)</span>
              <span className="topic-tag">Fees (28%)</span>
              <span className="topic-tag">Courses (22%)</span>
            </div>
          </div>
          <div className="insight-card">
            <h5>Resolution Rate</h5>
            <div className="resolution-metric">
              <span className="resolution-percentage">89%</span>
              <span className="resolution-label">Queries resolved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`ai-analytics ${darkMode ? 'dark-theme' : ''}`}>
      <div className="ai-header">
        <div className="ai-title">
          <Brain size={24} />
          <h3>AI Analytics Dashboard</h3>
        </div>
        <div className="ai-status">
          <div className="status-indicator active">
            <div className="status-dot"></div>
            <span>AI Systems Active</span>
          </div>
        </div>
      </div>

      <div className="ai-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`ai-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="ai-content">
        {activeTab === 'sentiment' && renderSentimentAnalysis()}
        {activeTab === 'intent' && renderIntentRecognition()}
        {activeTab === 'predictions' && renderPredictiveAnalytics()}
        {activeTab === 'summaries' && renderConversationSummaries()}
      </div>
    </div>
  );
};

export default AIAnalytics;
