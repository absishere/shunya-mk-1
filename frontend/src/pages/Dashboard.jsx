import { Link } from 'react-router-dom'

export default function Dashboard({ user, profile }) {
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
      
      {/* ADDED: style={{ marginBottom: '40px' }} to force space below the grid */}
      <div className="grid-3" style={{ marginBottom: '40px' }}>
        
        {/* WRAPPER DIV 1: This acts as the stable Grid Item */}
        <div style={{ height: '100%' }}>
            <Link to="/learning" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div className="card" style={{ height: '100%', transition: 'transform 0.2s', cursor: 'pointer', marginBottom: 0 }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📺</div>
                    <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Resume Learning</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Find tutorials for {profile?.degree || "your course"}.
                    </p>
                </div>
            </Link>
        </div>

        {/* WRAPPER DIV 2 */}
        <div style={{ height: '100%' }}>
            <Link to="/finance" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div className="card" style={{ height: '100%', transition: 'transform 0.2s', cursor: 'pointer', marginBottom: 0 }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
                    <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Track Expenses</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Manage your daily budget.
                    </p>
                </div>
            </Link>
        </div>

        {/* WRAPPER DIV 3 */}
        <div style={{ height: '100%' }}>
            <Link to="/planner" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div className="card" style={{ height: '100%', transition: 'transform 0.2s', cursor: 'pointer', marginBottom: 0 }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📅</div>
                    <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Daily Planner</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Check commute and schedule.
                    </p>
                </div>
            </Link>
        </div>
        
      </div>

      {/* Stats / Info Section */}
      <div className="grid-2">
        <div className="card">
            <h3>🎓 Academic Focus</h3>
            <p style={{ color: 'var(--text-muted)' }}>
                Your current focus is <strong>{profile?.degree || "General Studies"}</strong>. Go to the 
                <Link to="/skills" style={{ color: 'var(--primary)', marginLeft: '5px' }}>Skill Plan</Link> page 
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