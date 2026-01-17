import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Dashboard({ user, profile }) {
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="page-title">{greeting}, {user.displayName ? user.displayName.split(" ")[0] : "Student"}</h1>
        <p className="page-subtitle">
          You are a <strong>{profile?.year || "1st Year"}</strong> student at <strong>{profile?.university || "University"}</strong>.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <h3 style={{ marginBottom: '20px' }}>Quick Actions</h3>
      
      <div className="grid-3" style={{ marginBottom: '40px' }}>
        
        {/* Using div onClick for better layout stability */}
        <div 
            className="card" 
            onClick={() => navigate('/learning')}
            style={{ height: '100%', cursor: 'pointer', marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📺</div>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Resume Learning</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                Find tutorials for {profile?.degree || "your course"}.
            </p>
        </div>

        <div 
            className="card" 
            onClick={() => navigate('/finance')}
            style={{ height: '100%', cursor: 'pointer', marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>💰</div>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Track Expenses</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                Manage your daily budget.
            </p>
        </div>

        <div 
            className="card" 
            onClick={() => navigate('/planner')}
            style={{ height: '100%', cursor: 'pointer', marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📅</div>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Daily Planner</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                Check commute and schedule.
            </p>
        </div>
        
      </div>

      {/* Stats / Info Section */}
      <div className="grid-2">
        <div className="card">
            <h3>🎓 Academic Focus</h3>
            <p style={{ color: 'var(--text-muted)' }}>
                Your current focus is <strong>{profile?.degree || "General Studies"}</strong>. Go to the 
                <span onClick={() => navigate('/skills')} style={{ color: 'var(--primary)', marginLeft: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Skill Plan</span> page 
                to generate a new roadmap for your semester exams.
            </p>
        </div>

        <div className="card">
            <h3>🤖 AI Assistant Status</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                <span style={{ fontSize: '0.9rem' }}>Gemini AI is ready</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '5px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                <span style={{ fontSize: '0.9rem' }}>Database Connected</span>
            </div>
        </div>
      </div>
    </div>
  )
}