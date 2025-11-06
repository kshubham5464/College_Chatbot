// chatbotServices.js
import stringSimilarity from 'string-similarity';
import generalData from '../data/faqData.json';
import studentData from '../data/studentData.json';
import parentData from '../data/parentData.json';
import visitorData from '../data/visitorData.json';

export const getBotResponse = (userInput, userType) => {
  // Select appropriate data source based on user type
  let primaryData, fallbackData;
  
  switch (userType?.type) {
    case 'student':
      primaryData = studentData;
      fallbackData = generalData;
      break;
    case 'parent':
      primaryData = parentData;
      fallbackData = generalData;
      break;
    case 'visitor':
      primaryData = visitorData;
      fallbackData = generalData;
      break;
    default:
      primaryData = generalData;
      fallbackData = [];
  }

  // First, try to find match in user-specific data
  let bestMatch = findBestMatch(userInput, primaryData);
  let dataSource = primaryData;
  
  // If no good match found in primary data, try fallback data
  if (bestMatch.rating < 0.4 && fallbackData.length > 0) {
    const fallbackMatch = findBestMatch(userInput, fallbackData);
    if (fallbackMatch.rating > bestMatch.rating) {
      bestMatch = fallbackMatch;
      dataSource = fallbackData;
    }
  }

  if (bestMatch.rating > 0.4) {
    const matchedQuestion = dataSource.find(item => 
      item.question.toLowerCase() === bestMatch.target
    );
    return matchedQuestion.answer;
  } else {
    // Return user-type specific fallback response
    return getFallbackResponse(userType?.type);
  }
};

const findBestMatch = (userInput, data) => {
  const questions = data.map(item => item.question.toLowerCase());
  const matches = stringSimilarity.findBestMatch(userInput.toLowerCase(), questions);
  return matches.bestMatch;
};

const getFallbackResponse = (userTypeString) => {
  switch (userTypeString) {
    case 'student':
      return "I'm not sure about that specific query. 🤔 As a student, you might want to:\n• Check your student portal for updates\n• Contact your faculty advisor\n• Visit the student services office\n• Ask your seniors or classmates\n\n📞 Student helpline: +91-8102309831";
      
    case 'parent':
      return "I don't have specific information about that query. 👨‍👩‍👧‍👦 As a parent, I'd recommend:\n• Contacting our parent liaison office\n• Visiting our website for comprehensive information\n• Scheduling a meeting with the principal\n• Joining our parent WhatsApp group\n\n📞 Parent helpline: +91-8102309830";
      
    case 'visitor':
      return "I'm not sure about that particular question. 🏫 As a prospective student or visitor, I'd suggest:\n• Scheduling a campus visit\n• Speaking with our admission counselors\n• Attending our information sessions\n• Downloading our college brochure\n\n📞 Admission helpline: +91-8102309831\n🎓 Would you like me to help you schedule a campus tour?";
      
    default:
      return "I'm not sure about that. Could you please rephrase your question or contact our office for more specific information?\n\n📞 General helpline: +91-8102309830";
  }
};

