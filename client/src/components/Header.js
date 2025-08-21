import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>Humareso</h1>
        </div>
        <div className="title">
          <h2>Email Signature Management Dashboard</h2>
          <p>Manage and deploy email signatures across platforms</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
