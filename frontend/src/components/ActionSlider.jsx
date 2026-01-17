import React, { useState } from 'react';
import { 
  Youtube, BrainCircuit, Landmark, Menu, X, 
  Calendar, BookOpen, UserCircle, LogOut, Search 
} from 'lucide-react';
import './ActionSlider.css';

const ActionSlider = ({ activeTab, onSelect, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { id: 'resources', label: 'Resource Manager', icon: <Search size={20} /> },
    { id: 'finance', label: 'Expense Tracker', icon: <Landmark size={20} /> },
    { id: 'skills', label: 'Skill Development', icon: <BrainCircuit size={20} /> },
    { id: 'study', label: 'Study Scheduler', icon: <Calendar size={20} /> },
    { id: 'assignments', label: 'Academic Tasks', icon: <BookOpen size={20} /> },
    { id: 'youtube', label: 'Video Streaming', icon: <Youtube size={20} /> }
  ];

  return (
    <>
      <header className="top-nav">
        <button className="menu-trigger" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
        
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Adarsh</span>
            <span className="user-status">Premium Student</span>
          </div>
          <UserCircle size={32} className="avatar" />
        </div>
      </header>

      <div className={`side-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-overlay" onClick={() => setIsOpen(false)} />
        <div className="drawer-content">
          <div className="drawer-header">
            <h2 className="brand">SHUNYA</h2>
            <button className="close-btn" onClick={() => setIsOpen(false)}><X /></button>
          </div>
          
          <div className="nav-list">
            {options.map((opt) => (
              <button 
                key={opt.id}
                className={`nav-btn ${activeTab === opt.id ? 'active' : ''}`}
                onClick={() => { onSelect(opt.id); setIsOpen(false); }}
              >
                {opt.icon} <span>{opt.label}</span>
              </button>
            ))}
          </div>

          <button className="logout-footer" onClick={onLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ActionSlider;