import { useState } from 'react';
import AuthPage from './components/AuthPage';
import ActionSlider from './components/ActionSlider';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const priceUSD = 240;

  const toINR = (usd) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(usd * 83.50);

  if (!isLoggedIn) return <AuthPage onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="app-container">
      <ActionSlider 
        activeTab={activeTab} 
        onSelect={setActiveTab} 
        onLogout={() => setIsLoggedIn(false)}
      />

      <main className="viewport">
        {!activeTab ? (
          <div className="hero-section animate-fade">
            <h1 className="hero-title">What can I help you with today?</h1>
            <p className="hero-subtitle">Open the menu to access your student intelligence suite.</p>
          </div>
        ) : (
          <div className="content-window animate-fade">
            <h2 className="view-header">{activeTab.toUpperCase()} MANAGER</h2>
            
            {activeTab === 'finance' && (
              <div className="glass-panel">
                <h3>Current Budget</h3>
                <p className="big-price">{toINR(priceUSD)}</p>
                <div className="status-pill">₹20K PRIZE READY</div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="glass-panel">
                <h3>Skill Development Roadmap</h3>
                <div className="roadmap-grid">
                  {['AI Ethics', 'React Advanced'].map((s, i) => (
                    <div key={i} className="skill-card">
                      <span>{s}</span>
                      <div className="bar"><div className="fill" style={{width: `${85 - i*15}%`}}></div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Added Placeholder for Academic & Study Managers */}
            {(activeTab === 'study' || activeTab === 'assignments' || activeTab === 'resources') && (
              <div className="glass-panel placeholder-msg">
                <p>Module Initializing... Connect with Python Backend to sync real-time academic data.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;