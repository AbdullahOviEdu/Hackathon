import React, { useState } from 'react';
import { FiSearch, FiSend, FiPaperclip } from 'react-icons/fi';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

const TeacherMessages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // Mock chat data
  const chats: Chat[] = [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'J',
      lastMessage: 'Thank you for the help with the assignment!',
      timestamp: new Date(),
      unreadCount: 2,
    },
    {
      id: '2',
      name: 'Sarah Smith',
      avatar: 'S',
      lastMessage: 'When is the next class?',
      timestamp: new Date(Date.now() - 3600000),
      unreadCount: 0,
    },
    {
      id: '3',
      name: 'Michael Johnson',
      avatar: 'M',
      lastMessage: 'I have a question about the project',
      timestamp: new Date(Date.now() - 7200000),
      unreadCount: 1,
    },
  ];

  // Mock messages data
  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        sender: 'John Doe',
        content: 'Hi teacher, I need help with the assignment',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
      },
      {
        id: '2',
        sender: 'Teacher',
        content: 'Sure, what do you need help with?',
        timestamp: new Date(Date.now() - 3000000),
        isRead: true,
      },
      {
        id: '3',
        sender: 'John Doe',
        content: 'Thank you for the help with the assignment!',
        timestamp: new Date(),
        isRead: false,
      },
    ],
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    console.log('Send message:', messageInput, 'to chat:', selectedChat);
    setMessageInput('');
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 h-full">
      <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg h-[calc(100vh-8rem)] flex overflow-hidden">
        {/* Chat List */}
        <div className="w-80 border-r border-ninja-white/10">
          {/* Search */}
          <div className="p-4 border-b border-ninja-white/10">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ninja-white/40" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white placeholder-ninja-white/40 focus:outline-none focus:border-ninja-green/50"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="overflow-y-auto h-full">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors ${
                  selectedChat === chat.id ? 'bg-white/5' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-ninja-green/20 flex items-center justify-center font-monument text-ninja-green">
                  {chat.avatar}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-monument text-ninja-white">{chat.name}</span>
                    <span className="text-xs text-ninja-white/40">
                      {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ninja-white/60 truncate">{chat.lastMessage}</span>
                    {chat.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-ninja-green text-ninja-black text-xs flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-ninja-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ninja-green/20 flex items-center justify-center font-monument text-ninja-green">
                    {chats.find(c => c.id === selectedChat)?.avatar}
                  </div>
                  <span className="font-monument text-ninja-white">
                    {chats.find(c => c.id === selectedChat)?.name}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages[selectedChat]?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'Teacher' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'Teacher'
                          ? 'bg-ninja-green text-ninja-black'
                          : 'bg-white/5 text-ninja-white'
                      }`}
                    >
                      <p>{message.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender === 'Teacher' ? 'text-ninja-black/60' : 'text-ninja-white/40'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-ninja-white/10">
                <div className="flex items-center gap-4">
                  <button className="p-2 text-ninja-white/60 hover:text-ninja-white transition-colors">
                    <FiPaperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 bg-transparent text-ninja-white placeholder-ninja-white/40 focus:outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 text-ninja-green hover:text-ninja-white transition-colors"
                  >
                    <FiSend className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-ninja-white/40">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherMessages; 