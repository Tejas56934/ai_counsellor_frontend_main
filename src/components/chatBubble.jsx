import React from 'react';
export default function ChatBubble({ from = 'bot', text }) {
  return (
    <div className={`chat-bubble ${from}`}>
      <div className="chat-text">{text}</div>
    </div>
  );
}
