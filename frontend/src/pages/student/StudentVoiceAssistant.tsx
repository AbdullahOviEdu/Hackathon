import React, { useState, useEffect } from 'react';
import { FiMic, FiMicOff, FiLoader, FiVolume2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface VoiceMessage {
  id: string;
  text: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

const StudentVoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your voice assistant. Click the microphone to start speaking.",
      type: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock speech recognition (in a real app, use the Web Speech API)
  const startListening = () => {
    setIsListening(true);
    // Simulate voice input after 3 seconds
    setTimeout(() => {
      const mockUserInput = "Can you explain how JavaScript promises work?";
      handleVoiceInput(mockUserInput);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const handleVoiceInput = async (text: string) => {
    // Add user message
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      text,
      type: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsListening(false);
    setIsProcessing(true);

    try {
      // In a real app, this would be your AI endpoint
      const response = await axios.post('http://localhost:5000/api/voice', {
        message: text
      });

      const assistantMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.message || "I'm here to help! What would you like to know?",
        type: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      // In a real app, use text-to-speech here
      speakResponse(assistantMessage.text);
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error('Failed to process voice input');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    // In a real app, use the Web Speech API
    console.log('Speaking:', text);
  };

  return (
    <div className="min-h-screen bg-ninja-black">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-monument text-white mb-4">Voice Assistant</h1>
          <p className="text-white/60">Your AI voice tutor - just speak to ask questions and get instant responses</p>
        </div>

        {/* Voice Interface */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          {/* Messages Area */}
          <div className="h-[400px] overflow-y-auto p-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-ninja-purple to-ninja-green text-white'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {message.type === 'user' ? (
                        <FiMic className="w-4 h-4" />
                      ) : (
                        <FiVolume2 className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {message.type === 'user' ? 'You' : 'Assistant'}
                      </span>
                    </div>
                    <p className="text-sm md:text-base">{message.text}</p>
                    <p className="text-xs mt-2 opacity-60">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 rounded-2xl p-4">
                    <FiLoader className="w-5 h-5 text-ninja-green animate-spin" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Voice Control Area */}
          <div className="p-6 border-t border-white/10">
            <div className="flex justify-center">
              <motion.button
                onClick={isListening ? stopListening : startListening}
                className={`p-6 rounded-full ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-r from-ninja-purple to-ninja-green hover:from-ninja-green hover:to-ninja-purple'
                } text-white transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isProcessing}
              >
                {isListening ? (
                  <FiMicOff className="w-8 h-8" />
                ) : (
                  <FiMic className="w-8 h-8" />
                )}
              </motion.button>
            </div>
            <p className="text-center text-white/60 mt-4">
              {isListening
                ? 'Listening... Click to stop'
                : isProcessing
                ? 'Processing...'
                : 'Click the microphone to start speaking'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentVoiceAssistant; 