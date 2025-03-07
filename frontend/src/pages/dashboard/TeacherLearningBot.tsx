import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiBook, FiMessageCircle, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const TeacherLearningBot: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBack = () => {
    navigate(-1); // This will go back to the previous page
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Server error');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again. " + 
                (error instanceof Error ? error.message : 'Unknown error'),
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (message: Message) => {
    return (
      <div
        key={message.id}
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`flex items-start space-x-3 max-w-[85%] ${
            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
            message.role === 'user' 
              ? 'bg-ninja-green/20 text-ninja-green' 
              : 'bg-ninja-purple/20 text-ninja-purple'
          }`}>
            {message.role === 'user' ? (
              <FiMessageCircle className="w-5 h-5" />
            ) : (
              <FiBook className="w-5 h-5" />
            )}
          </div>

          {/* Message Content */}
          <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`p-3 rounded-xl ${
                message.role === 'user'
                  ? 'bg-ninja-green/10 text-ninja-white'
                  : 'bg-ninja-purple/10 text-ninja-white'
              }`}
            >
              {message.role === 'user' ? (
                <div className="text-sm break-words whitespace-pre-wrap">{message.content}</div>
              ) : (
                <div className="text-sm prose prose-invert prose-sm max-w-none break-words">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        return (
                          <code
                            className={`${className} ${
                              inline 
                                ? 'bg-ninja-black/30 px-1 py-0.5 rounded text-sm' 
                                : 'block bg-ninja-black/30 p-3 rounded-lg overflow-x-auto my-2 text-sm'
                            }`}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      p({ children }) {
                        return <p className="mb-2 text-sm leading-relaxed">{children}</p>;
                      },
                      ul({ children }) {
                        return <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>;
                      },
                      ol({ children }) {
                        return <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>;
                      },
                      li({ children }) {
                        return <li className="mb-1">{children}</li>;
                      },
                      blockquote({ children }) {
                        return (
                          <blockquote className="border-l-2 border-ninja-purple pl-3 my-2 italic">
                            {children}
                          </blockquote>
                        );
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            <span className="text-xs text-ninja-white/40 mt-1 px-1">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Background with blur - decreased opacity */}
      <div className="absolute inset-0 bg-gradient-to-br from-ninja-black/80 via-ninja-black/70 to-ninja-black/60 backdrop-blur-lg z-0" />

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="max-w-4xl mx-auto h-full px-6">
          {/* Header */}
          <div className="flex items-center space-x-3 py-4">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-xl bg-ninja-black/20 text-ninja-white hover:bg-ninja-black/30 flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-ninja-purple/10 text-ninja-purple flex items-center justify-center backdrop-blur-sm">
              <FiBook className="w-6 h-6" />
            </div>
            <h1 className="font-monument text-ninja-white text-2xl">Learning Assistant</h1>
          </div>

          {/* Main Container - decreased opacity */}
          <div className="h-[calc(100vh-7rem)] bg-ninja-black/20 border border-ninja-white/5 rounded-xl backdrop-blur-md shadow-xl">
            <div className="flex flex-col h-full">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <div className="w-16 h-16 rounded-2xl bg-ninja-purple/20 text-ninja-purple flex items-center justify-center mb-4">
                      <FiBook className="w-8 h-8" />
                    </div>
                    <p className="text-ninja-white/60 text-lg mb-2">
                      Welcome to your AI Learning Assistant
                    </p>
                    <p className="text-ninja-white/40">
                      Ask any question related to your studies
                    </p>
                  </div>
                ) : (
                  messages.map(renderMessage)
                )}
                {isLoading && (
                  <div className="flex items-center space-x-2 p-4">
                    <div className="w-2 h-2 bg-ninja-purple rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-ninja-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-ninja-purple rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-ninja-white/10">
                <div className="flex gap-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your question..."
                    className="flex-1 p-3 bg-ninja-black/30 border border-ninja-white/10 rounded-xl text-ninja-white placeholder-ninja-white/40 focus:outline-none focus:border-ninja-purple/50 resize-none h-[48px] min-h-[48px] max-h-[120px] transition-all duration-200 scrollbar-hide text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className={`px-4 flex items-center justify-center bg-ninja-purple/10 text-ninja-purple rounded-xl hover:bg-ninja-purple hover:text-ninja-black transition-colors ${
                      isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FiSend className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLearningBot; 