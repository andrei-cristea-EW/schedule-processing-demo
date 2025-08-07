import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <img src="/favicon-96x96.png" alt="Schedule Processing" className="favicon-logo" />
        </div>
        <div>
          <h1 className="header-title">
            Schedule Processing Demo
          </h1>
          <p className="header-subtitle">TV Schedule Validation & Analysis</p>
        </div>
      </div>
    </header>
  );
};

export default Header;