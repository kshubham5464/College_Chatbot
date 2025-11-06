import React, { useState, useEffect } from 'react';
import { Lightbulb, ArrowRight, Star, Clock, Users } from 'lucide-react';

const SuggestedQuestions = ({ userType, messages, onQuestionSelect, darkMode }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Get context-aware suggestions based on conversation history
  const getContextualSuggestions = () => {
    if (!messages || messages.length === 0) {
      return getInitialSuggestions();
    }

    const recentMessages = messages.slice(-5); // Last 5 messages
    const userMessages = recentMessages.filter(msg => msg.sender === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1]?.text?.toLowerCase() || '';

    let contextSuggestions = [];

    // Analyze conversation context and suggest follow-up questions
    if (lastUserMessage.includes('admission')) {
      contextSuggestions = [
        { text: "What documents are required for admission?", priority: 'high', icon: <Star size={14} /> },
        { text: "What is the admission deadline?", priority: 'high', icon: <Clock size={14} /> },
        { text: "What is the selection criteria?", priority: 'medium', icon: <Users size={14} /> },
        { text: "How do I check my application status?", priority: 'medium', icon: <Lightbulb size={14} /> }
      ];
    } else if (lastUserMessage.includes('fee') || lastUserMessage.includes('cost')) {
      contextSuggestions = [
        { text: "What are the payment methods available?", priority: 'high', icon: <Star size={14} /> },
        { text: "Are there any scholarship options?", priority: 'high', icon: <Clock size={14} /> },
        { text: "What is the refund policy?", priority: 'medium', icon: <Users size={14} /> },
        { text: "Can I pay fees in installments?", priority: 'medium', icon: <Lightbulb size={14} /> }
      ];
    } else if (lastUserMessage.includes('course') || lastUserMessage.includes('program')) {
      contextSuggestions = [
        { text: "What is the course duration?", priority: 'high', icon: <Clock size={14} /> },
        { text: "Who are the faculty members?", priority: 'high', icon: <Users size={14} /> },
        { text: "What are the career prospects?", priority: 'medium', icon: <Star size={14} /> },
        { text: "What is the curriculum structure?", priority: 'medium', icon: <Lightbulb size={14} /> }
      ];
    } else if (lastUserMessage.includes('hostel') || lastUserMessage.includes('accommodation')) {
      contextSuggestions = [
        { text: "What are the hostel fees?", priority: 'high', icon: <Star size={14} /> },
        { text: "How is room allocation done?", priority: 'high', icon: <Users size={14} /> },
        { text: "What facilities are provided in hostel?", priority: 'medium', icon: <Lightbulb size={14} /> },
        { text: "What are the hostel rules?", priority: 'medium', icon: <Clock size={14} /> }
      ];
    } else if (lastUserMessage.includes('placement') || lastUserMessage.includes('job')) {
      contextSuggestions = [
        { text: "What is the average placement package?", priority: 'high', icon: <Star size={14} /> },
        { text: "Which companies visit for recruitment?", priority: 'high', icon: <Users size={14} /> },
        { text: "What is the placement percentage?", priority: 'medium', icon: <Clock size={14} /> },
        { text: "How does the placement process work?", priority: 'medium', icon: <Lightbulb size={14} /> }
      ];
    } else if (lastUserMessage.includes('library') || lastUserMessage.includes('book')) {
      contextSuggestions = [
        { text: "What are the library timings?", priority: 'high', icon: <Clock size={14} /> },
        { text: "How do I issue books?", priority: 'high', icon: <Lightbulb size={14} /> },
        { text: "What digital resources are available?", priority: 'medium', icon: <Star size={14} /> },
        { text: "Are there study rooms in the library?", priority: 'medium', icon: <Users size={14} /> }
      ];
    } else {
      // If no specific context, show user-type specific suggestions
      return getUserTypeSpecificSuggestions();
    }

    return contextSuggestions;
  };

  // Get initial suggestions when no conversation history
  const getInitialSuggestions = () => {
    return getUserTypeSpecificSuggestions();
  };

  // Get suggestions based on user type
  const getUserTypeSpecificSuggestions = () => {
    const suggestions = {
      student: [
        { text: "What courses can I choose from?", priority: 'high', icon: <Star size={14} /> },
        { text: "How do I access the student portal?", priority: 'high', icon: <Lightbulb size={14} /> },
        { text: "What are the library timings?", priority: 'medium', icon: <Clock size={14} /> },
        { text: "How do I apply for hostel?", priority: 'medium', icon: <Users size={14} /> },
        { text: "What clubs and activities are available?", priority: 'medium', icon: <Star size={14} /> },
        { text: "How do I check my attendance?", priority: 'low', icon: <Lightbulb size={14} /> }
      ],
      parent: [
        { text: "What is the admission process?", priority: 'high', icon: <Star size={14} /> },
        { text: "What is the complete fee structure?", priority: 'high', icon: <Clock size={14} /> },
        { text: "What safety measures are in place?", priority: 'high', icon: <Users size={14} /> },
        { text: "How can I track academic performance?", priority: 'medium', icon: <Lightbulb size={14} /> },
        { text: "What are the transportation facilities?", priority: 'medium', icon: <Star size={14} /> },
        { text: "How do I schedule a parent meeting?", priority: 'low', icon: <Clock size={14} /> }
      ],
      visitor: [
        { text: "Tell me about the college", priority: 'high', icon: <Star size={14} /> },
        { text: "What courses are offered?", priority: 'high', icon: <Lightbulb size={14} /> },
        { text: "What are the admission requirements?", priority: 'high', icon: <Users size={14} /> },
        { text: "Can I schedule a campus tour?", priority: 'medium', icon: <Clock size={14} /> },
        { text: "What are the placement records?", priority: 'medium', icon: <Star size={14} /> },
        { text: "How is the college location?", priority: 'low', icon: <Lightbulb size={14} /> }
      ]
    };

    return suggestions[userType?.type] || suggestions.visitor;
  };

  // Update suggestions when messages or user type changes
  useEffect(() => {
    const newSuggestions = getContextualSuggestions();
    setSuggestions(newSuggestions);
  }, [messages, userType]);

  // Sort suggestions by priority
  const sortedSuggestions = suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const displaySuggestions = showAll ? sortedSuggestions : sortedSuggestions.slice(0, 3);

  if (suggestions.length === 0) return null;

  return (
    <div className={`suggested-questions ${darkMode ? 'dark-theme' : ''}`}>
      <div className="suggested-questions-header">
        <Lightbulb size={16} />
        <span>Suggested Questions</span>
      </div>
      
      <div className="suggestions-list">
        {displaySuggestions.map((suggestion, index) => (
          <button
            key={index}
            className={`suggestion-item priority-${suggestion.priority}`}
            onClick={() => onQuestionSelect(suggestion.text)}
          >
            <div className="suggestion-icon">
              {suggestion.icon}
            </div>
            <div className="suggestion-content">
              <span className="suggestion-text">{suggestion.text}</span>
              <div className="suggestion-meta">
                <span className={`priority-badge ${suggestion.priority}`}>
                  {suggestion.priority}
                </span>
              </div>
            </div>
            <ArrowRight size={14} className="suggestion-arrow" />
          </button>
        ))}
      </div>

      {suggestions.length > 3 && (
        <button 
          className="show-more-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : `Show ${suggestions.length - 3} More`}
        </button>
      )}
    </div>
  );
};

export default SuggestedQuestions;
