import React, { useState } from 'react';
import { Mail, Lock, User, GraduationCap, ArrowRight } from 'lucide-react';
import './AuthPage.css';

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('');

  const handleAuthAction = () => {
    if (mode === 'login') {
      if (email.trim() === '' || password.trim() === '') {
        alert("Please enter both Email and Password to continue.");
        return;
      }
    } else if (mode === 'signup') {
      if (fullName.trim() === '' || email.trim() === '' || password.trim() === '' || grade === '') {
        alert("Please fill in all fields, including your grade, to create an account.");
        return;
      }
    }
    onLogin();
  };

  return (
    <div className="auth-container">
      <div className="auth-visual">
        <div className="visual-content">
          <div className="logo-badge">SHUNYA MK-1</div>
          <h1>Master Your Student Life with AI.</h1>
          <p>The ultimate assistant for finance, skills, and content management.</p>
        </div>
      </div>
      
      <div className="auth-form-side">
        <div className="form-box animate-fade">
          {mode === 'login' ? (
            <>
              <h2>Welcome Back</h2>
              <p className="subtitle">Enter your details to access your dashboard</p>
              <div className="inputs">
                <div className="input-row">
                  <Mail size={18}/>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-row">
                  <Lock size={18}/>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <span className="link-text" onClick={() => setMode('forgot')}>Forgot Password?</span>
              <button className="prime-btn" onClick={handleAuthAction}>
                Login <ArrowRight size={18}/>
              </button>
              <p className="footer-text">New here? <span onClick={() => setMode('signup')}>Create Account</span></p>
            </>
          ) : mode === 'signup' ? (
            <>
              <h2>Create Account</h2>
              <p className="subtitle">Join thousands of students today</p>
              <div className="inputs">
                <div className="input-row">
                  <User size={18}/>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="input-row">
                  <GraduationCap size={18}/>
                  {/* STYLE UPDATED: Matches other inputs (Grey text), Dropdown items (Black bg, White text) */}
                  <select 
                    className="grade-select" 
                    style={{ 
                      color: '#94a3b8', 
                      background: 'transparent',
                      cursor: 'pointer'
                    }} 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  >
                    <option value="" disabled style={{ background: '#0a0f18', color: '#94a3b8' }}>Select Your Grade</option>
                    <option value="9" style={{ background: '#0a0f18', color: '#ffffff' }}>Grade 9</option>
                    <option value="10" style={{ background: '#0a0f18', color: '#ffffff' }}>Grade 10</option>
                    <option value="11" style={{ background: '#0a0f18', color: '#ffffff' }}>Grade 11</option>
                    <option value="12" style={{ background: '#0a0f18', color: '#ffffff' }}>Grade 12</option>
                    <option value="college" style={{ background: '#0a0f18', color: '#ffffff' }}>College</option>
                  </select>
                </div>
                <div className="input-row">
                  <Mail size={18}/>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-row">
                  <Lock size={18}/>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button className="prime-btn" onClick={handleAuthAction}>
                Sign Up <ArrowRight size={18}/>
              </button>
              <p className="footer-text">Already have an account? <span onClick={() => setMode('login')}>Login</span></p>
            </>
          ) : (
            <>
              <h2>Reset Password</h2>
              <p className="subtitle">Enter your email for a recovery link</p>
              <div className="inputs">
                <div className="input-row"><Mail size={18}/><input type="email" placeholder="Email Address" /></div>
              </div>
              <button className="prime-btn" onClick={() => setMode('login')}>Send Request</button>
              <span className="link-text center" onClick={() => setMode('login')}>Back to Login</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}