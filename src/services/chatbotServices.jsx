// chatbotServices.js
import stringSimilarity from 'string-similarity';
import data from '../data/faqData.json'; 

export const getBotResponse = (userInput) => {
  const questions = data.map(item => item.question.toLowerCase());
  const matches = stringSimilarity.findBestMatch(userInput.toLowerCase(), questions);
  
  const bestMatch = matches.bestMatch;

  if (bestMatch.rating > 0.4) {  
    const matchedQuestion = data.find(item => item.question.toLowerCase() === bestMatch.target);
    return matchedQuestion.answer;
  } else {
    return "I'm not sure about that. Could you please rephrase?";
  }
};

