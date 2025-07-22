import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types/api';
import { startExecution, pollExecutionStatus } from '../services/api';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, isBot: boolean, isLoading = false): Message => {
    const message: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      isBot,
      timestamp: new Date(),
      isLoading,
    };
    setMessages(prev => [...prev, message]);
    return message;
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  };

  const handleSendMessage = async (userMessage: string) => {
    if (isLoading) return;

    addMessage(userMessage, false);
    const botMessage = addMessage('', true, true);
    setIsLoading(true);

    try {
      const executionResponse = await startExecution(userMessage);
      
      const aiResponse = await pollExecutionStatus(
        executionResponse.executionId,
        (status) => {
          console.log(`Execution status: ${status}`);
        }
      );

      updateMessage(botMessage.id, {
        text: aiResponse,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      updateMessage(botMessage.id, {
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
        isLoading: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="header">
        <div className="header-content">
          <div className="header-logo">
            <span>SF</span>
          </div>
          <div>
            <h1 className="header-title">SA Fire Protection AI</h1>
            <p className="header-subtitle">Powered by EverWorker Agents</p>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-content">
              <div className="welcome-logo">
                <span>SF</span>
              </div>
              <h3 className="welcome-title">
                Welcome to SA Fire Protection AI
              </h3>
              <p className="welcome-description">
                Your intelligent EverWorker Agent is ready to assist with fire protection products, monitors, and systems.
                Get expert guidance on technical specifications, applications, and solutions.
              </p>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatInterface;