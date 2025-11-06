class ExternalAIService {
  constructor() {
    this.fallbackEnabled = true;
    this.apiEndpoints = {
      openai: 'https://api.openai.com/v1/chat/completions',
      huggingface: 'https://api-inference.huggingface.co/models/',
      local: '/api/chat'
    };
  }

  async queryOpenAI(message, context = []) {
    try {
      const response = await fetch(this.apiEndpoints.openai, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY || 'demo-key'}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant for a college chatbot. 
              Provide accurate, concise information about admissions, courses, fees, facilities, and general college queries. 
              Keep responses under 150 words.`
            },
            ...context.map(msg => ({
              role: msg.user ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: message }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) throw new Error('OpenAI API error');
      
      const data = await response.json();
      return {
        response: data.choices[0].message.content,
        source: 'openai',
        confidence: 0.8
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return null;
    }
  }

  async queryHuggingFace(message) {
    try {
      const response = await fetch(
        `${this.apiEndpoints.huggingface}microsoft/DialoGPT-medium`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_HF_API_KEY || 'demo-key'}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: message,
            parameters: {
              max_length: 100,
              temperature: 0.7
            }
          })
        }
      );

      if (!response.ok) throw new Error('Hugging Face API error');
      
      const data = await response.json();
      return {
        response: Array.isArray(data) ? data[0].generated_text : data.generated_text,
        source: 'huggingface',
        confidence: 0.6
      };
    } catch (error) {
      console.error('Hugging Face API error:', error);
      return null;
    }
  }

  async queryLocalModel(message) {
    try {
      // Simulate local model response
      const responses = [
        "I'm here to help with your college-related questions. Could you please specify what information you need?",
        "Thank you for your question. Let me provide you with accurate information about our college.",
        "I'd be happy to assist you. Please let me know if you need details about admissions, courses, or facilities."
      ];
      
      return {
        response: responses[Math.floor(Math.random() * responses.length)],
        source: 'local',
        confidence: 0.5
      };
    } catch (error) {
      console.error('Local model error:', error);
      return null;
    }
  }

  async getFallbackResponse(message, context = []) {
    if (!this.fallbackEnabled) return null;

    // Try multiple services in order
    const services = [
      () => this.queryLocalModel(message),
      () => this.queryHuggingFace(message),
      () => this.queryOpenAI(message, context)
    ];

    for (const service of services) {
      try {
        const result = await service();
        if (result) return result;
      } catch (error) {
        console.error('Service error:', error);
        continue;
      }
    }

    return {
      response: "I'm sorry, I'm having trouble connecting to my AI services. Please try again later or contact the college directly.",
      source: 'none',
      confidence: 0
    };
  }

  setFallbackEnabled(enabled) {
    this.fallbackEnabled = enabled;
  }
}

export default new ExternalAIService();
