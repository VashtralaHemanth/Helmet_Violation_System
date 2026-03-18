import React from 'react';
import '../styles/navbar.css';

export default function Navbar({ activeTab, onTabChange }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Brand */}
        <a href="/" className="navbar-brand" onClick={(e) => e.preventDefault()}>
          <div className="brand-logo">🚦</div>
          <div className="brand-text">
            <span className="brand-name">VioWatch</span>
            <span className="brand-tagline">AI Violation Detection</span>
          </div>
        </a>

        {/* Center nav */}
        <div className="navbar-center">
          <button
            className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => onTabChange('upload')}
          >
            <span className="nav-icon">🖼️</span> Upload
          </button>
          <button
            className={`nav-link ${activeTab === 'webcam' ? 'active' : ''}`}
            onClick={() => onTabChange('webcam')}
          >
            <span className="nav-icon">📷</span> Live Camera
          </button>
        </div>

        {/* Right */}
        <div className="navbar-right">
          <div className="nav-status-pill">
            <span className="status-active-dot" />
            API Online
          </div>
          <div className="nav-avatar" title="Officer Dashboard">👮</div>
        </div>

      </div>
    </nav>
  );
}
