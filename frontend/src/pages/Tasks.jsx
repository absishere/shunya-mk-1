import { useState, useEffect } from 'react'
import SkeletonCard from '../components/SkeletonCard'

export default function Tasks({ user }) {
  const [loading, setLoading] = useState(true)
  const [rawText, setRawText] = useState("")
  const [parsedTasks, setParsedTasks] = useState([])
  const [savedTasks, setSavedTasks] = useState([])
  const [parsing, setParsing] = useState(false)

  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true)

    try {
      const res = await fetch(
        `https://shunya-backend-bhi0.onrender.com/api/assignments?user_id=${user.uid}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await res.json();
      setSavedTasks(data.assignments || []);

    } catch (e) {
      console.error("Tasks fetch error:", e);
    } finally {
      setLoading(false);   // ✅ always executes
    }
  };


  // Auto-load tasks
  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const parseText = async () => {
    if (!rawText || !user) return;
    setParsing(true);
    try {
      const res = await fetch('https://shunya-backend-bhi0.onrender.com/api/ai/parse-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText, user_id: user.uid })
      });
      const data = await res.json();
      setParsedTasks(data.tasks || []);
      fetchTasks();
    } catch (e) { console.error(e); }
    setParsing(false);
  }

  return (
    <div>
      <div className="header-section">
        <h1 className="page-title">Assignment Parser</h1>
        <p className="page-subtitle">Turn WhatsApp chaos into organized deadlines.</p>
      </div>

      <div className="grid-2">

        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {/* Parser Card */}
            <div className="card" style={{ height: 'fit-content' }}>
              <h3>📥 WhatsApp Parser</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Paste your messy group chat messages here.
              </p>
              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                style={{ height: '150px', marginTop: '10px', resize: 'none' }}
                placeholder="e.g. 'Maths assignment due tomorrow and Physics lab on Friday'"
              />
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '15px' }}
                onClick={parseText}
                disabled={parsing}
              >
                {parsing ? "Extracting..." : "Extract Tasks"}
              </button>
            </div>

            {/* To-Do List Card */}
            <div className="card">
              <h3>📌 To-Do List</h3>

              {savedTasks.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No tasks yet.
                </div>
              )}

              {savedTasks.map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600' }}>{t.subject}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {t.title}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      className="tag"
                      style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}
                    >
                      {t.deadline}
                    </div>

                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: '0.8rem', padding: '4px 8px', marginTop: '5px' }}
                      onClick={() => {
                        const title = encodeURIComponent(t.subject + ": " + t.title);
                        const d = t.deadline ? t.deadline.replace(/-/g, '') : "";
                        if (d) window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${d}/${d}`, '_blank');
                      }}
                    >
                      Add to Cal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

    </div>
  )
}