import React from 'react';
import ChatMessage from '../components/chat/ChatMessage';

const EmojiMessageTest = () => {
  const testMessages = [
    {
      id: '1',
      content: 'Hello! 😊',
      timestamp: Date.now(),
      sender: { fullName: 'Test User', username: 'testuser' },
      messageType: 'TEXT'
    },
    {
      id: '2',
      content: 'Multiple emojis: 😀 😃 😄 😁 😆 😅 😂',
      timestamp: Date.now(),
      sender: { fullName: 'Test User', username: 'testuser' },
      messageType: 'TEXT'
    },
    {
      id: '3',
      content: 'Text with emoji 🎉 in the middle and at end 🚀',
      timestamp: Date.now(),
      sender: { fullName: 'Test User', username: 'testuser' },
      messageType: 'TEXT'
    },
    {
      id: '4',
      content: '🔥🔥🔥 Hot message! 💯',
      timestamp: Date.now(),
      sender: { fullName: 'Own User', username: 'ownuser' },
      messageType: 'TEXT'
    },
    {
      id: '5',
      content: '**Bold text** with *italic* and `code` and emoji 😎',
      timestamp: Date.now(),
      sender: { fullName: 'Test User', username: 'testuser' },
      messageType: 'TEXT'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <h1 className="text-white text-2xl mb-6">Emoji Message Test</h1>
      
      <div className="max-w-2xl mx-auto space-y-4">
        {testMessages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwnMessage={index === 3} // Make the 4th message appear as own message
            showAvatar={true}
            showTimestamp={true}
          />
        ))}
      </div>
      
      <div className="mt-8 max-w-2xl mx-auto">
        <h2 className="text-white text-lg mb-4">Raw Emoji Test</h2>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-white">Direct emoji render: 😊 🎉 🚀 💯 🔥</p>
          <p className="text-white">Emoji with text: Hello 😊 world!</p>
        </div>
      </div>
    </div>
  );
};

export default EmojiMessageTest;
