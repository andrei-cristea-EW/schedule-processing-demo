import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <span>SF</span>
        </div>
        <div>
          <h1 className="header-title">
            SA Fire Protection
          </h1>
          <p className="header-subtitle">AI Demo Worker</p>
        </div>
      </div>
    </header>
  );
};

export default Header;