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

const StudentLearningBot: React.FC = () => {
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
    navigate(-1);
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
          className={`flex items-start space-x-2 max-w-[85%] ${
            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          {/* Avatar */}
          <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center ${
            message.role === 'user' 
              ? 'bg-ninja-green/20 text-ninja-green' 
              : 'bg-ninja-purple/20 text-ninja-purple'
          }`}>
            {message.role === 'user' ? (
              <FiMessageCircle className="w-4 h-4" />
            ) : (
              <FiBook className="w-4 h-4" />
            )}
          </div>

          {/* Message Content */}
          <div>
            <div
              className={`p-2.5 rounded-lg ${
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
                      code(props) {
                        const {className, children, ...rest} = props;
                        const match = /language-(\w+)/.exec(className || '');
                        return (
                          <code
                            className={`${className} ${
                              !match
                                ? 'bg-ninja-black/30 px-1 py-0.5 rounded text-sm' 
                                : 'block bg-ninja-black/30 p-2 rounded-lg overflow-x-auto my-1.5 text-sm'
                            }`}
                            {...rest}
                          >
                            {children}
                          </code>
                        );
                      },
                      p({ children }) {
                        return <p className="mb-1.5 text-sm leading-relaxed">{children}</p>;
                      },
                      ul({ children }) {
                        return <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>;
                      },
                      ol({ children }) {
                        return <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>;
                      },
                      li({ children }) {
                        return <li className="mb-0.5">{children}</li>;
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            <span className="text-[10px] text-ninja-white/40 mt-0.5 px-1">
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
        <div className="h-full max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center space-x-3 py-2">
            <button
              onClick={handleBack}
              className="w-8 h-8 rounded-lg bg-ninja-black/20 text-ninja-white hover:bg-ninja-black/30 flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-ninja-purple/10 text-ninja-purple flex items-center justify-center backdrop-blur-sm">
              <FiBook className="w-5 h-5" />
            </div>
            <h1 className="font-monument text-ninja-white text-xl">Learning Assistant</h1>
          </div>

          {/* Main Container - decreased opacity */}
          <div className="flex flex-col h-[calc(100%-3rem)]">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto py-2 px-2 space-y-3 scrollbar-hide">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-14 h-14 rounded-xl bg-ninja-purple/20 text-ninja-purple flex items-center justify-center mb-3">
                    <FiBook className="w-7 h-7" />
                  </div>
                  <p className="text-ninja-white/60 text-base mb-2">
                    Welcome to your AI Learning Assistant
                  </p>
                  <p className="text-ninja-white/40 text-sm">
                    Ask any question about your studies or programming concepts
                  </p>
                </div>
              ) : (
                messages.map(renderMessage)
              )}
              {isLoading && (
                <div className="flex items-center space-x-1.5 p-2">
                  <div className="w-1.5 h-1.5 bg-ninja-purple rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-ninja-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-ninja-purple rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-2 border-t border-ninja-white/10">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your question..."
                  className="flex-1 p-2.5 bg-ninja-black/30 border border-ninja-white/10 rounded-lg text-ninja-white placeholder-ninja-white/40 focus:outline-none focus:border-ninja-purple/50 resize-none h-[40px] min-h-[40px] max-h-[100px] transition-all duration-200 scrollbar-hide text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className={`px-3 flex items-center justify-center bg-ninja-purple/10 text-ninja-purple rounded-lg hover:bg-ninja-purple hover:text-ninja-black transition-colors ${
                    isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLearningBot; 