import { useState, useEffect } from 'react'

export default function Tasks({ user }) {
  // Start loading FALSE -> UI appears instantly
  const [loading, setLoading] = useState(false)
  const [rawText, setRawText] = useState("")
  const [savedTasks, setSavedTasks] = useState([])
  const [parsing, setParsing] = useState(false)

  const fetchTasks = async () => {
    if (!user) return
    try {
      const res = await fetch(`https://shunya-backend-bhi0.onrender.com/api/assignments?user_id=${user.uid}`)
      if (res.ok) {
        const data = await res.json()
        setSavedTasks(data.assignments || [])
      }
    } catch (e) {
      console.warn("Backend offline")
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  const parseText = async () => {
    if (!rawText || !user) return
    setParsing(true)
    try {
      const res = await fetch('https://shunya-backend-bhi0.onrender.com/api/ai/parse-assignment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: rawText, user_id: user.uid })
        })
      if(res.ok) {
          const data = await res.json()
          // Refresh list
          fetchTasks()
      }
    } catch (e) { console.error("Parse error", e) }
    setParsing(false)
  }

  return (
    <div>
      <div className="header-section">
        <h1 className="page-title">Assignment Parser</h1>
        <p className="page-subtitle">Turn WhatsApp chaos into organized deadlines.</p>
      </div>

      <div className="grid-2">
        {/* Parser Card */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3>📥 WhatsApp Parser</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Paste messages here.</p>
          <textarea
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            style={{ height: '150px', marginTop: '10px', resize: 'none' }}
            placeholder="e.g. 'Maths assignment due tomorrow'"
          />
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '15px' }} onClick={parseText} disabled={parsing}>
            {parsing ? "Extracting..." : "Extract Tasks"}
          </button>
        </div>

        {/* To-Do List Card */}
        <div className="card">
          <h3>📌 To-Do List</h3>
          {savedTasks.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No tasks found.
            </div>
          ) : (
            savedTasks.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{t.subject}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t.title}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div className="tag" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}>{t.deadline}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}