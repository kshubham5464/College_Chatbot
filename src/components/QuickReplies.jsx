import React from 'react';
import { MessageCircle, Clock, Star, HelpCircle } from 'lucide-react';

const QuickReplies = ({ userType, onQuickReply, darkMode, recentQueries = [] }) => {
  // Get quick reply suggestions based on user type
  const getQuickReplies = () => {
    const baseReplies = {
      student: [
        { text: "What are my course options?", icon: <MessageCircle size={14} />, category: "academic" },
        { text: "Library timings", icon: <Clock size={14} />, category: "facilities" },
        { text: "Hostel facilities", icon: <Star size={14} />, category: "facilities" },
        { text: "Fee payment process", icon: <HelpCircle size={14} />, category: "admin" },
        { text: "Club activities", icon: <MessageCircle size={14} />, category: "activities" },
        { text: "Exam schedule", icon: <Clock size={14} />, category: "academic" }
      ],
      parent: [
        { text: "Admission process", icon: <MessageCircle size={14} />, category: "admission" },
        { text: "Fee structure", icon: <HelpCircle size={14} />, category: "fees" },
        { text: "Safety measures", icon: <Star size={14} />, category: "safety" },
        { text: "Academic performance", icon: <Clock size={14} />, category: "academic" },
        { text: "Transportation", icon: <MessageCircle size={14} />, category: "transport" },
        { text: "Parent meetings", icon: <HelpCircle size={14} />, category: "meetings" }
      ],
      visitor: [
        { text: "College overview", icon: <MessageCircle size={14} />, category: "general" },
        { text: "Course details", icon: <Star size={14} />, category: "courses" },
        { text: "Admission requirements", icon: <HelpCircle size={14} />, category: "admission" },
        { text: "Campus tour", icon: <Clock size={14} />, category: "visit" },
        { text: "Placement records", icon: <MessageCircle size={14} />, category: "placement" },
        { text: "Contact information", icon: <HelpCircle size={14} />, category: "contact" }
      ]
    };

    return baseReplies[userType?.type] || baseReplies.visitor;
  };

  // Get contextual suggestions based on recent queries
  const getContextualSuggestions = () => {
    if (!recentQueries.length) return [];

    const suggestions = [];
    const lastQuery = recentQueries[recentQueries.length - 1]?.toLowerCase() || '';

    // Context-aware follow-up suggestions
    if (lastQuery.includes('admission')) {
      suggestions.push(
        { text: "What documents are required?", icon: <HelpCircle size={14} />, category: "followup" },
        { text: "Application deadline", icon: <Clock size={14} />, category: "followup" }
      );
    } else if (lastQuery.includes('fee')) {
      suggestions.push(
        { text: "Payment methods", icon: <MessageCircle size={14} />, category: "followup" },
        { text: "Scholarship options", icon: <Star size={14} />, category: "followup" }
      );
    } else if (lastQuery.includes('course')) {
      suggestions.push(
        { text: "Course duration", icon: <Clock size={14} />, category: "followup" },
        { text: "Faculty details", icon: <MessageCircle size={14} />, category: "followup" }
      );
    } else if (lastQuery.includes('hostel')) {
      suggestions.push(
        { text: "Hostel fees", icon: <HelpCircle size={14} />, category: "followup" },
        { text: "Room allocation", icon: <Star size={14} />, category: "followup" }
      );
    }

    return suggestions;
  };

  const quickReplies = getQuickReplies();
  const contextualSuggestions = getContextualSuggestions();
  const allSuggestions = [...contextualSuggestions, ...quickReplies.slice(0, 4)];

  if (allSuggestions.length === 0) return null;

  return (
    <div className={`quick-replies ${darkMode ? 'dark-theme' : ''}`}>
      <div className="quick-replies-header">
        <span className="quick-replies-title">
          {contextualSuggestions.length > 0 ? "💡 Follow-up questions:" : "🚀 Quick questions:"}
        </span>
      </div>
      <div className="quick-replies-container">
        {allSuggestions.map((reply, index) => (
          <button
            key={index}
            className={`quick-reply-btn ${reply.category}`}
            onClick={() => onQuickReply(reply.text)}
            title={`Ask: ${reply.text}`}
          >
            <span className="quick-reply-icon">{reply.icon}</span>
            <span className="quick-reply-text">{reply.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;
