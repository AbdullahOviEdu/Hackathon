const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyDNxAo7Z4nzqopH_4Z-C6fYUKJbJGTQlac");

// List of common greetings and casual messages
const casualMessages = ['hi', 'hello', 'hey', 'how are you', 'good morning', 'good afternoon', 'good evening'];

// Function to detect if text contains Hindi/Hinglish
const containsHindiOrHinglish = (text) => {
  // Check for Devanagari Unicode range
  const hindiPattern = /[\u0900-\u097F]/;
  // Check for common Hinglish patterns (like hai, kya, etc.)
  const hinglishPattern = /(hai|kya|kaise|kaha|nahi|acha|thik|matlab|bohot|bahut|kar|raha|rahi|karna|karna)/i;
  
  return hindiPattern.test(text) || hinglishPattern.test(text);
};

exports.chat = async (req, res) => {
  try {
    console.log('Received chat request:', req.body);
    const { message } = req.body;

    if (!message) {
      console.log('No message provided');
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Check if message is a casual greeting
    if (casualMessages.includes(message.toLowerCase().trim())) {
      return res.json({
        success: true,
        response: "👋 Hello! I'm your AI learning assistant. How can I help you today?"
      });
    }

    console.log('Initializing model...');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash"
    });

    // Detect language of the input
    const isHindiInput = containsHindiOrHinglish(message);

    console.log('Generating content for message:', message);
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: `
          You are a helpful and friendly AI learning assistant. 
          
          Important Instructions:
          1. ${isHindiInput ? 'Respond in Hindi/Hinglish matching the user\'s style' : 'Respond in clear, professional English'}
          2. Keep responses educational but conversational
          3. Format responses using markdown for better readability
          4. Focus on being helpful and informative
          5. Use examples when relevant
          6. Keep responses concise and well-structured
          7. If technical terms are used, provide brief explanations
          
          Format your response using markdown:
          - Use headers for sections
          - Use bullet points for lists
          - Use code blocks when needed
          - Use bold for emphasis
          
          Question: ${message}
          
          Remember: ${isHindiInput ? 'Match the language style of the question' : 'Respond in professional English'}
        ` }]
      }]
    });

    const response = await result.response;
    console.log('Generated response:', response.text());

    res.json({
      success: true,
      response: response.text(),
    });
  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your request',
      error: error.message,
    });
  }
}; 