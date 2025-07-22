import React from 'react';
import type { Message } from '../types/api';
import LoadingIndicator from './LoadingIndicator';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { text, isBot, timestamp, isLoading } = message;
  
  return (
    <div className={`message-bubble ${isBot ? 'bot' : 'user'}`}>
      <div className="message-content">
        {isBot && (
          <div className="message-header">
            <div className="bot-avatar">
              <span>AI</span>
            </div>
            <span className="bot-name">SA Fire AI</span>
          </div>
        )}
        
        <div className={`message-text ${isBot ? 'bot' : 'user'}`}>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <p>{text}</p>
          )}
        </div>
        
        <div className={`message-timestamp ${isBot ? 'bot' : 'user'}`}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;