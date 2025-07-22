import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="loading-indicator">
      <div className="loading-dots">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
      <span className="loading-text">AI is thinking...</span>
    </div>
  );
};

export default LoadingIndicator;