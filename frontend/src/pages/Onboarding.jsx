import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'

export default function Onboarding({ user, setProfile }) {
  const [degree, setDegree] = useState("")
  const [year, setYear] = useState("1st Year")
  const [university, setUniversity] = useState("")
  const [loading, setLoading] = useState(false)

  const saveProfile = async () => {
    if (!degree || !university) return alert("Please fill in all fields")
    
    setLoading(true)
    const academicData = {
      name: user.displayName,
      email: user.email,
      degree,
      year,
      university,
      createdAt: new Date().toISOString()
    }

    try {
      await setDoc(doc(db, "users", user.uid), academicData)
      setProfile(academicData) // Updates App.jsx state to redirect to Dashboard
    } catch (e) {
      console.error("Error saving profile:", e)
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <h2 style={{ marginTop: 0, fontSize: '2rem' }}>👋 Welcome!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Let's set up your academic profile to personalize the AI.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Degree / Major</label>
            <input 
              value={degree} 
              onChange={e => setDegree(e.target.value)} 
              placeholder="e.g. B.Tech Computer Science" 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Current Year</label>
            <select value={year} onChange={e => setYear(e.target.value)}>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>University</label>
            <input 
              value={university} 
              onChange={e => setUniversity(e.target.value)} 
              placeholder="e.g. IIT Bombay" 
            />
          </div>

          <button className="btn btn-primary" onClick={saveProfile} disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? "Setting up..." : "Complete Setup 🚀"}
          </button>
        </div>
      </div>
    </div>
  )
}