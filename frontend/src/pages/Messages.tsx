import React, { useState } from 'react';
import { FiSearch, FiMoreVertical, FiSend } from 'react-icons/fi';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

const Messages: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Nikols Helmet',
      role: 'UI/UX Designer',
      lastMessage: 'Hey, how are you?',
      lastMessageTime: new Date(),
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Web Developer',
      lastMessage: 'The project is ready for review',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0,
      isOnline: false,
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: '1',
      text: 'Hey, how are you?',
      timestamp: new Date(),
      isRead: true,
    },
    {
      id: '2',
      senderId: 'me',
      text: "I'm doing great! How about you?",
      timestamp: new Date(Date.now() - 1800000),
      isRead: true,
    },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Add message handling logic here
      setMessageText('');
    }
  };

  return (
    <div className="flex h-screen bg-ninja-black">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-ninja-white/10 overflow-hidden flex flex-col">
        <div className="p-4">
          <h2 className="text-xl font-monument text-ninja-white mb-4">Messages</h2>
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ninja-white/40" />
            <input
              type="text"
              placeholder="Search messages"
              className="w-full bg-ninja-black/50 border border-ninja-white/10 rounded-lg pl-10 pr-4 py-2 text-ninja-white placeholder-ninja-white/40 focus:outline-none focus:border-ninja-green/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`p-4 cursor-pointer hover:bg-ninja-green/5 ${
                selectedContact === contact.id ? 'bg-ninja-green/10' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-ninja-green/20 border border-ninja-green/30"></div>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-ninja-green rounded-full border-2 border-ninja-black"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-monument text-ninja-white">{contact.name}</h3>
                    <span className="text-xs text-ninja-white/40">
                      {new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-ninja-white/60">{contact.role}</p>
                  <p className="text-sm text-ninja-white/40 truncate">{contact.lastMessage}</p>
                </div>
                {contact.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-ninja-green flex items-center justify-center">
                    <span className="text-xs text-ninja-black font-medium">{contact.unreadCount}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-ninja-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-ninja-green/20 border border-ninja-green/30"></div>
                <div>
                  <h3 className="font-monument text-ninja-white">
                    {contacts.find((c) => c.id === selectedContact)?.name}
                  </h3>
                  <p className="text-sm text-ninja-white/60">
                    {contacts.find((c) => c.id === selectedContact)?.role}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-ninja-green/10 rounded-full">
                <FiMoreVertical className="text-ninja-white/60" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.senderId === 'me'
                        ? 'bg-ninja-green text-ninja-black'
                        : 'bg-ninja-white/10 text-ninja-white'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-60">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-ninja-white/10">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-ninja-black/50 border border-ninja-white/10 rounded-lg px-4 py-2 text-ninja-white placeholder-ninja-white/40 focus:outline-none focus:border-ninja-green/50"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-ninja-green text-ninja-black rounded-lg hover:bg-ninja-purple hover:text-ninja-white transition-colors"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-ninja-white/40">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages; 