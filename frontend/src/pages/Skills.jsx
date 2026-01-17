import { useState } from 'react'

export default function Skills({ user, profile }) {
  const [skillInput, setSkillInput] = useState("")
  const [syllabus, setSyllabus] = useState(null)
  const [syllabusLoading, setSyllabusLoading] = useState(false)

  const generateSyllabus = async () => {
    if (!skillInput) return;
    setSyllabusLoading(true);
    setSyllabus(null);
    try {
      const res = await fetch('https://shunya-backend-bhi0.onrender.com/api/ai/syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: skillInput,
          user_degree: profile?.degree || "General",
          user_year: profile?.year || "Student"
        })
      });
      const data = await res.json();
      setSyllabus(data);
    } catch (e) { console.error(e); }
    setSyllabusLoading(false);
  }

  return (
    <div>
      <div className="header-section">
        <h1 className="page-title">Skill Roadmap</h1>
        <p className="page-subtitle">AI-generated study plans tailored to your year.</p>
      </div>

      <div className="grid-2">
        <div>
          <div className="card">
            <h3>Generate New Roadmap</h3>
            <div style={{display:'flex', gap:'10px', marginTop:'15px'}}>
              <input value={skillInput} onChange={e=>setSkillInput(e.target.value)} placeholder="e.g. Python, Public Speaking..." />
              <button className="btn btn-success" onClick={generateSyllabus} disabled={syllabusLoading}>{syllabusLoading ? "..." : "Generate"}</button>
            </div>
          </div>
        </div>
        
        {syllabus && !syllabus.error && (
          <div className="card" style={{gridColumn: '1 / -1'}}>
            <h2 style={{marginTop:0, color:'var(--accent)'}}>{syllabus.title}</h2>
            <div className="grid-2">
              {syllabus.weeks?.map(w => (
                <div key={w.week} style={{padding:'15px', background:'rgba(255,255,255,0.03)', borderRadius:'8px', borderLeft:'3px solid var(--accent)'}}>
                  <div className="tag" style={{color:'var(--accent)', marginBottom:'5px', display:'inline-block'}}>Week {w.week}</div>
                  <h4 style={{margin:'5px 0'}}>{w.topic}</h4>
                  <p style={{fontSize:'0.9rem', color:'var(--text-muted)', margin:0}}>{w.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}