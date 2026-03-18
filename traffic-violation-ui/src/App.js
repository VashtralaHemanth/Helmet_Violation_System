import React, { useState } from 'react';
import Navbar    from './components/Navbar';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
