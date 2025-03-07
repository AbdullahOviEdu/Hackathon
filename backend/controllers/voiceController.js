const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyDNxAo7Z4nzqopH_4Z-C6fYUKJbJGTQlac");

exports.processVoice = async (req, res) => {
  try {
    console.log('Received voice request:', req.body);
    const { message, language = 'en-US' } = req.body;

    if (!message) {
      console.log('No message provided');
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    console.log('Initializing model...');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash"
    });

    // Determine response language
    const isHindi = language.startsWith('hi');
    
    console.log('Generating content for voice message:', message);
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: `
          You are a helpful voice assistant for teachers. 
          
          Important Instructions:
          1. You MUST respond in ${isHindi ? 'Hindi language using Devanagari script' : 'English language'}
          2. Keep responses concise and clear (suitable for voice output)
          3. Use conversational tone
          4. Focus on educational topics
          5. Limit response to 2-3 sentences
          6. Avoid special characters or symbols
          7. Use natural language that flows well when spoken
          8. If responding in Hindi, use proper pronunciation marks
          
          Question: ${message}
          
          Remember: Response MUST be in ${isHindi ? 'Hindi' : 'English'} language only.
        ` }]
      }]
    });

    const response = await result.response;
    const responseText = response.text().trim();
    console.log('Generated response:', responseText);

    res.json({
      success: true,
      response: responseText,
      shouldSpeak: true,
      language: language // Send back the language for frontend reference
    });
  } catch (error) {
    console.error('Error in voice controller:', error);
    const isHindi = (req.body.language || '').startsWith('hi');
    res.status(500).json({
      success: false,
      message: isHindi 
        ? 'माफ़ कीजिये, कोई त्रुटि हुई है। कृपया पुनः प्रयास करें।'
        : 'Error processing your request',
      error: error.message,
      shouldSpeak: true,
      language: req.body.language
    });
  }
}; 