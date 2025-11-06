import { pipeline } from '@xenova/transformers';

class NLPService {
  constructor() {
    this.intentClassifier = null;
    this.sentimentAnalyzer = null;
    this.qaModel = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      console.log('Initializing NLP models...');
      
      // Initialize intent classifier
      this.intentClassifier = await pipeline(
        'text-classification',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'  
      );
      
      // Initialize sentiment analyzer
      this.sentimentAnalyzer = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );
      
      // Initialize question answering model
      this.qaModel = await pipeline(
        'question-answering',
        'Xenova/distilbert-base-cased-distilled-squad'
      );
      
      this.initialized = true;
      console.log('NLP models initialized successfully');
    } catch (error) {
      console.error('Error initializing NLP models:', error);
      this.initialized = false;
    }
  }

  async classifyIntent(text) {
    if (!this.initialized) await this.initialize();
    
    try {
      const result = await this.intentClassifier(text);
      return {
        intent: result[0].label,
        confidence: result[0].score
      };
    } catch (error) {
      console.error('Error classifying intent:', error);
      return { intent: 'unknown', confidence: 0 };
    }
  }

  async analyzeSentiment(text) {
    if (!this.initialized) await this.initialize();
    
    try {
      const result = await this.sentimentAnalyzer(text);
      return {
        sentiment: result[0].label,
        confidence: result[0].score
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return { sentiment: 'NEUTRAL', confidence: 0 };
    }
  }

  async extractKeywords(text) {
    // Simple keyword extraction using TF-IDF approach
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this', 'these', 'those']);
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  async generateEmbedding(text) {
    // Placeholder for embedding generation
    // In a real implementation, you'd use a proper embedding model
    return text.toLowerCase().split(' ').filter(word => word.length > 2);
  }
}

export default new NLPService();
