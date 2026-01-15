import { useState, useEffect } from 'react'
import './App.css'
import ReactMarkdown from 'react-markdown'

function App() {
  const [activeTab, setActiveTab] = useState('youtube') // youtube, skills, finance, tasks

  // --- YOUTUBE STATE ---
  const [query, setQuery] = useState("")
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeSummary, setActiveSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(null)

  // --- SKILL STATE ---
  const [skillInput, setSkillInput] = useState("")
  const [syllabus, setSyllabus] = useState(null)
  const [syllabusLoading, setSyllabusLoading] = useState(false)

  // --- FINANCE STATE ---
  const [expenses, setExpenses] = useState([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [amountInput, setAmountInput] = useState("")
  const [categoryInput, setCategoryInput] = useState("Food")
  const [aiAdvice, setAiAdvice] = useState("")

  // --- ASSIGNMENT STATE ---
  const [rawText, setRawText] = useState("")
  const [parsedTasks, setParsedTasks] = useState([])
  const [parsing, setParsing] = useState(false)

  // --- FUNCTIONS ---

  const searchYoutube = async () => {
    if(!query) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/youtube/search?query=${query}`);
      const data = await res.json();
      setVideos(data.videos || []);
      setActiveSummary(null);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  const explainVideo = async (videoId, title, channel) => {
    setSummaryLoading(videoId);
    setActiveSummary(null);
    try {
      const res = await fetch('http://localhost:8000/api/ai/explain', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ title, channel })
      });
      const data = await res.json();
      setActiveSummary({ id: videoId, text: data.summary });
    } catch (e) { console.error(e); }
    setSummaryLoading(null);
  }

  const generateSyllabus = async () => {
    if(!skillInput) return;
    setSyllabusLoading(true);
    setSyllabus(null);
    try {
      const res = await fetch('http://localhost:8000/api/ai/syllabus', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ skill: skillInput })
      });
      const data = await res.json();
      setSyllabus(data);
    } catch (e) { console.error(e); }
    setSyllabusLoading(false);
  }

  const fetchExpenses = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/finance/expenses?user_id=student1');
      const data = await res.json();
      setExpenses(data.expenses);
      setTotalSpent(data.total);
    } catch (e) { console.error(e); }
  }

  useEffect(() => { if (activeTab === 'finance') fetchExpenses(); }, [activeTab]);

  const addExpense = async () => {
    if (!amountInput) return;
    setAiAdvice("Analyzing...");
    try {
      const res = await fetch('http://localhost:8000/api/finance/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          user_id: "student1",
          category: categoryInput,
          amount: parseFloat(amountInput),
          date: new Date().toISOString().split('T')[0]
        })
      });
      const data = await res.json();
      setAiAdvice(data.ai_comment);
      setAmountInput("");
      fetchExpenses();
    } catch (e) { console.error(e); }
  }

  const parseText = async () => {
    if(!rawText) return;
    setParsing(true);
    try {
      const res = await fetch('http://localhost:8000/api/ai/parse-assignment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ text: rawText })
      });
      const data = await res.json();
      setParsedTasks(data.tasks || []); // FIX: Ensure it is always an array
    } catch (e) { console.error(e); }
    setParsing(false);
  }
=======

    setLoading(false);
  };

  // 🤖 GEMINI EXPLAIN
  const explainVideo = async (videoId, title, channel) => {
    setSummaryLoading(videoId);
    setActiveSummary(null);

    try {
      const response = await fetch("http://localhost:8000/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, channel }),
      });

      const data = await response.json();
      setActiveSummary({ id: videoId, text: data.summary });
    } catch (error) {
      console.error("AI Error:", error);
    }
>>>>>>> Stashed changes

    setSummaryLoading(null);
  };

  // ✅ MAIN DASHBOARD (AFTER LOGIN)
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <h1>🚀 Student Assistant</h1>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => setActiveTab('youtube')} style={{ background: activeTab === 'youtube' ? '#646cff' : '#333' }}>📺 YouTube</button>
            <button onClick={() => setActiveTab('skills')} style={{ background: activeTab === 'skills' ? '#646cff' : '#333' }}>🧠 Skills</button>
            <button onClick={() => setActiveTab('finance')} style={{ background: activeTab === 'finance' ? '#646cff' : '#333' }}>💰 Finance</button>
            <button onClick={() => setActiveTab('tasks')} style={{ background: activeTab === 'tasks' ? '#646cff' : '#333' }}>📝 Tasks</button>
        </div>
      </div>

      {/* 1. YOUTUBE TAB */}
      {activeTab === 'youtube' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input type="text" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search topic..." style={{ flex: 1, padding: '10px' }} />
            <button onClick={searchYoutube} disabled={loading}>{loading ? "..." : "Search"}</button>
          </div>
          <div style={{ display: 'grid', gap: '20px' }}>
            {videos.map((v) => (
              <div key={v.id} style={{ background: '#242424', padding: '15px', borderRadius: '8px', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <img src={v.thumbnail} style={{ width: '160px', borderRadius: '4px' }} />
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{v.title}</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank">Watch</a>
                        <button onClick={() => explainVideo(v.id, v.title, v.channel)} style={{ fontSize: '12px', background: '#e91e63' }}>
                           {summaryLoading === v.id ? "..." : "✨ AI Summary"}
                        </button>
                    </div>
                  </div>
                </div>
                {activeSummary?.id === v.id && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#333', borderLeft: '4px solid #e91e63' }}>
                        <ReactMarkdown>{activeSummary.text}</ReactMarkdown>
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SKILL TAB */}
      {activeTab === 'skills' && (
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input type="text" value={skillInput} onChange={(e)=>setSkillInput(e.target.value)} placeholder="Skill to learn..." style={{ flex: 1, padding: '10px' }} />
                <button onClick={generateSyllabus} disabled={syllabusLoading} style={{ background: '#2ecc71' }}>{syllabusLoading?"...":"Generate Plan"}</button>
            </div>
            {syllabus && !syllabus.error && (
                <div style={{ textAlign: 'left', background: '#242424', padding: '20px', borderRadius: '10px' }}>
                    <h2 style={{ color: '#2ecc71', marginTop: 0 }}>{syllabus.title}</h2>
                    {syllabus.weeks?.map(w => (
                        <div key={w.week} style={{ marginBottom: '15px', borderLeft: '4px solid #2ecc71', paddingLeft: '15px' }}>
                            <h3 style={{ margin: '0 0 5px 0' }}>Week {w.week}: {w.topic}</h3>
                            <p style={{ margin: 0, color: '#ccc' }}>{w.details}</p>
                        </div>
                    ))}
                </div>
            )}
            {/* Display error if generation failed */}
            {syllabus && syllabus.error && (
               <div style={{color: 'red'}}>⚠️ AI could not generate the plan. Please try again.</div>
            )}
        </div>
      )}

      {/* 3. FINANCE TAB */}
      {activeTab === 'finance' && (
        <div style={{ textAlign: 'left' }}>
            <div style={{ background: '#242424', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3>Add Expense</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select value={categoryInput} onChange={(e)=>setCategoryInput(e.target.value)} style={{ padding: '10px' }}>
                        <option>Food</option><option>Transport</option><option>Fun</option>
                    </select>
                    <input type="number" value={amountInput} onChange={(e)=>setAmountInput(e.target.value)} placeholder="Amount" style={{ padding: '10px' }} />
                    <button onClick={addExpense} style={{ background: '#f1c40f', color: '#000' }}>Add</button>
                </div>
                {aiAdvice && <div style={{ marginTop: '10px', padding: '10px', background: '#333', color: '#f1c40f' }}>🤖 {aiAdvice}</div>}
            </div>
            <h3>History (Total: ₹{totalSpent})</h3>
            {expenses.map((e, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #444' }}>
                    <span>{e.date} - {e.category}</span>
                    <span style={{ color: '#f1c40f' }}>₹{e.amount}</span>
                </div>
            ))}
        </div>
      )}

      {/* 4. TASKS TAB */}
      {activeTab === 'tasks' && (
        <div style={{ textAlign: 'left' }}>
            <div style={{ background: '#242424', padding: '20px', borderRadius: '10px' }}>
                <h3>Paste Group Chat</h3>
                <textarea value={rawText} onChange={(e)=>setRawText(e.target.value)} placeholder="Paste messy text here..." style={{ width: '100%', height: '80px', padding: '10px', marginBottom: '10px' }} />
                <button onClick={parseText} disabled={parsing} style={{ background: '#9b59b6' }}>{parsing?"...":"Extract Tasks"}</button>
            </div>
            <div style={{ marginTop: '20px' }}>
                {parsedTasks.map((t, i) => {
                    const createLink = () => {
                        const title = encodeURIComponent(t.subject + ": " + t.task);
                        // FIX: Add safety check for date
                        const d = t.due_date ? t.due_date.replace(/-/g, '') : "";
                        if(d) window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${d}/${d}`, '_blank');
                    }
                    return (
                        <div key={i} style={{ background: '#333', padding: '15px', marginBottom: '10px', borderRadius: '5px', borderLeft: '5px solid #9b59b6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: 0 }}>{t.subject}</h4>
                                <p style={{ margin: 0, color: '#ccc' }}>{t.task}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#f1c40f', fontWeight: 'bold', marginBottom: '5px' }}>📅 {t.due_date || "No Date"}</div>
                                <button onClick={createLink} style={{ padding: '5px', fontSize: '12px' }}>➕ Calendar</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      )}

    </div>
  );
}

export default App;
