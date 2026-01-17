import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebaseConfig'

export default function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)' }}>
      <div style={{ marginBottom: '20px', fontSize: '4rem' }}>🚀</div>
      <h1 style={{ fontSize: '3rem', marginBottom: '10px', marginTop: 0 }}>Student Assistant</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.2rem' }}>
        Your personalized AI companion for academic excellence.
      </p>
      
      <button className="btn btn-primary" onClick={handleLogin} style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
        Sign in with Google
      </button>

      <div style={{ marginTop: '50px', display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <span>📚 Smart Learning</span>
        <span>•</span>
        <span>💰 Finance Tracker</span>
        <span>•</span>
        <span>🚗 Commute Planner</span>
      </div>
    </div>
  )
}