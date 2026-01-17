<<<<<<< Updated upstream
import { useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)

  // This function calls your Python Backend
  const fetchData = async () => {
    try {
      // We are calling the endpoint we defined in main.py
      const response = await fetch('http://localhost:8000/api/test');
      const result = await response.json();
      setData(result); // Save the python data to React state
=======
import { useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

import Login from "./Login";
import Signup from "./Signup";

function App() {
  // 🔐 AUTH STATE
  const [user, setUser] = useState(null);

<<<<<<< Updated upstream
  // 🔎 YOUTUBE SEARCH STATE
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🤖 AI SUMMARY STATE
  const [activeSummary, setActiveSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(null);
=======
  // Playlist (NEW)
const [playlist, setPlaylist] = useState([])
const [showPlaylist, setShowPlaylist] = useState(false)
const displayedVideos = showPlaylist ? playlist : videos



  // Skills
  const [skillInput, setSkillInput] = useState("")
  const [syllabus, setSyllabus] = useState(null)
  const [syllabusLoading, setSyllabusLoading] = useState(false)

  // Finance
  const [expenses, setExpenses] = useState([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [amountInput, setAmountInput] = useState("")
  const [categoryInput, setCategoryInput] = useState("Food")
  const [aiAdvice, setAiAdvice] = useState("")
  // Finance Analysis (NEW)
const [financeAnalysis, setFinanceAnalysis] = useState(null)
const [analysisLoading, setAnalysisLoading] = useState(false)

>>>>>>> Stashed changes

  // 🔐 IF NOT LOGGED IN → SHOW LOGIN / SIGNUP
  if (!user) {
    return (
      <div style={{ maxWidth: "400px", margin: "80px auto", textAlign: "center" }}>
        <h1>🎓 Student Assistant</h1>
        <Signup onAuth={setUser} />
        <hr />
        <Login onAuth={setUser} />
      </div>
    );
  }

  // 🔍 SEARCH YOUTUBE
  const searchYoutube = async () => {
<<<<<<< Updated upstream
    if (!query) return;
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/youtube/search?query=${query}`
      );
      const data = await response.json();
      setVideos(data.videos || []);
      setActiveSummary(null);
>>>>>>> Stashed changes
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
<<<<<<< Updated upstream
=======
    if (!query) return

    setShowPlaylist(false) // ✅ ADD THIS LINE
    setLoading(true)

    try {
      const res = await fetch(
        `http://localhost:8000/api/youtube/search?query=${query}`
      )
      const data = await res.json()
      setVideos(data.videos || [])
      setActiveSummary(null)
    } catch (e) {
      console.error(e)
    }

    setLoading(false)
>>>>>>> Stashed changes
  }
=======

<<<<<<< Updated upstream
    setLoading(false);
  };

  // 🤖 GEMINI EXPLAIN
=======

    // =======================
  // PLAYLIST FUNCTIONS (NEW)
  // =======================

  const fetchPlaylist = async () => {
    if (!user) return
    try {
      const res = await fetch(
        `http://localhost:8000/api/playlist?user_id=${user.uid}`
      )
      const data = await res.json()
     const normalized = (data.playlist || []).map(v => ({
        id: v.youtube_id,
        title: v.title,
        channel: v.channel,
        thumbnail: `https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`
      }))

      setPlaylist(normalized)

    } catch (e) {
      console.error(e)
    }
  }

  const removeFromPlaylist = async (videoId) => {
    if (!user) return

    try {
      await fetch(
        `http://localhost:8000/api/playlist/remove?user_id=${user.uid}&youtube_id=${videoId}`,
        { method: "DELETE" }
      )

      // Refresh playlist immediately
      fetchPlaylist()
    } catch (e) {
      console.error(e)
    }
  }

  const addToPlaylist = async (video) => {
    if (!user) return
    try {
      await fetch("http://localhost:8000/api/playlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.uid,
          youtube_id: video.id,
          title: video.title,
          channel: video.channel,
          subject: skillInput || "General"
        })
      })
    } catch (e) {
      console.error(e)
    }
  }


>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  // ✅ MAIN DASHBOARD (AFTER LOGIN)
=======
  const generateSchedule = async () => {
    if (!user) return;
    setScheduleLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/scheduler/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
          home_location: homeLoc,
          college_location: collegeLoc,
          college_start: startTime,
          college_end: endTime
        })
      });
      const data = await res.json();
      setSchedule(data);
    } catch (e) { console.error(e); }
    setScheduleLoading(false);
  }

  // 2. Skills (Academic Aware)
  const generateSyllabus = async () => {
    if (!skillInput) return;
    setSyllabusLoading(true);
    setSyllabus(null);
    try {
      // Send Profile Data to Backend for "Academic Boost"
      const res = await fetch('http://localhost:8000/api/ai/syllabus', {
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

  // 3. Finance (Linked to Real DB)
  const fetchExpenses = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:8000/api/finance/expenses?user_id=${user.uid}`);
      const data = await res.json();
      setExpenses(data.expenses);
      setTotalSpent(data.total);
    } catch (e) { console.error(e); }
  }

  useEffect(() => { if (activeTab === 'finance') fetchExpenses(); }, [activeTab, user]);

  const addExpense = async () => {
    if (!amountInput || !user) return;
    setAiAdvice("Analyzing...");
    try {
      const res = await fetch('http://localhost:8000/api/finance/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid, // REAL ID
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

  const analyzeFinance = async () => {
  if (!user) return;

  setAnalysisLoading(true);
  setFinanceAnalysis(null);

  try {
    const res = await fetch(
      `http://localhost:8000/api/finance/analysis?user_id=${user.uid}`
    );
    const data = await res.json();
    setFinanceAnalysis(data);
  } catch (err) {
    console.error("Finance analysis error:", err);
  }

  setAnalysisLoading(false);
};


  // 4. Tasks (Linked to Real DB)
  const fetchTasks = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:8000/api/assignments?user_id=${user.uid}`);
      const data = await res.json();
      setSavedTasks(data.assignments || []);
    } catch (e) { console.error(e); }
  }

  useEffect(() => { if (activeTab === 'tasks') fetchTasks(); }, [activeTab, user]);

  const parseText = async () => {
    if (!rawText || !user) return;
    setParsing(true);
    try {
      const res = await fetch('http://localhost:8000/api/ai/parse-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rawText,
          user_id: user.uid // Send ID so backend can auto-save
        })
      });
      const data = await res.json();
      setParsedTasks(data.tasks || []);
      fetchTasks(); // Refresh the list immediately
    } catch (e) { console.error(e); }
    setParsing(false);
  }

  // --- AUTH HANDLERS ---
  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); }
    catch (error) { console.error(error); }
  }

  const handleLogout = async () => {
    await signOut(auth);
    setProfile(null);
    setUser(null);
  }

  const saveProfile = async () => {
    if (!user) return;
    const academicData = {
      name: user.displayName,
      email: user.email,
      degree: degree,
      year: year,
      university: university,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, "users", user.uid), academicData);
    setProfile(academicData);
  }

  // --- RENDER ---

  if (loadingAuth) return <div style={{ padding: '50px' }}>Loading...</div>

  // 1. LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h1>Shunya-mk-1</h1>
        <p style={{ maxWidth: '400px', marginBottom: '30px', color: '#ccc' }}>
          Your AI-powered companion for University. Manage finances, assignments, and skills in one place.
        </p>
        <button onClick={handleLogin} style={{ padding: '15px 30px', fontSize: '18px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Sign in with Google
        </button>
      </div>
    )
  }

  // 2. ONBOARDING SCREEN
  if (!profile) {
    return (
      <div style={{ maxWidth: '500px', margin: '50px auto', background: '#242424', padding: '30px', borderRadius: '10px', textAlign: 'left' }}>
        <h2>👋 Welcome, {user.displayName}!</h2>
        <p>Let's personalize your experience.</p>

        <label style={{ display: 'block', marginTop: '15px' }}>Degree / Major</label>
        <input value={degree} onChange={e => setDegree(e.target.value)} placeholder="e.g. B.Tech CS" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />

        <label style={{ display: 'block', marginTop: '15px' }}>Current Year</label>
        <select value={year} onChange={e => setYear(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
          <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
        </select>

        <label style={{ display: 'block', marginTop: '15px' }}>University</label>
        <input value={university} onChange={e => setUniversity(e.target.value)} placeholder="e.g. IIT Bombay" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />

        <button onClick={saveProfile} style={{ marginTop: '20px', width: '100%', padding: '10px', background: '#2ecc71', border: 'none', cursor: 'pointer' }}>
          🚀 Start Dashboard
        </button>
      </div>
    )
  }

  // 3. MAIN DASHBOARD
>>>>>>> Stashed changes
  return (
<<<<<<< Updated upstream
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Student Assistant Dashboard</h1>

<<<<<<< Updated upstream
      <button onClick={fetchData} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Test Connection
      </button>

      {data && (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
          <h3>Result from Python:</h3>
          <p>Status: <strong>{data.status}</strong></p>
          <p>Project: {data.project}</p>
          <p>Days Left: {data.days_left}</p>
=======
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ margin: 0 }}>Shunya-mk-1</h1>
          <span style={{ color: '#aaa', fontSize: '14px' }}>{profile.year} • {profile.degree}</span>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <img src={user.photoURL} style={{ width: '40px', borderRadius: '50%' }} />
          <button onClick={handleLogout} style={{ background: '#e74c3c', fontSize: '12px', padding: '5px 10px' }}>Logout</button>
>>>>>>> Stashed changes
        </div>
      )}
=======
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>📚 Smart Study Manager</h1>

      {/* SEARCH */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to learn? (e.g. Python for Beginners)"
          style={{ flex: 1, padding: "10px", fontSize: "16px" }}
        />
        <button onClick={searchYoutube} disabled={loading}>
          {loading ? "Searching..." : "Find Resources"}
        </button>
      </div>

      {/* RESULTS */}
      <div style={{ display: "grid", gap: "20px" }}>
        {videos.map((video) => (
          <div
            key={video.id}
            style={{
              background: "#242424",
              padding: "15px",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", gap: "15px" }}>
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{ width: "160px", borderRadius: "4px" }}
              />
              <div>
                <h3 style={{ margin: "0 0 10px 0" }}>{video.title}</h3>
                <p style={{ color: "#aaa", margin: 0 }}>{video.channel}</p>

                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch on YouTube
                  </a>

                  <button
                    onClick={() =>
                      explainVideo(video.id, video.title, video.channel)
                    }
                    style={{
                      background: "#e91e63",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {summaryLoading === video.id
                      ? "Analyzing..."
                      : "✨ AI Summary"}
                  </button>
                </div>
              </div>
            </div>

            {/* AI SUMMARY */}
            {activeSummary && activeSummary.id === video.id && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "15px",
                  background: "#333",
                  borderRadius: "5px",
                  borderLeft: "4px solid #e91e63",
                }}
              >
                <strong>🤖 Gemini Summary:</strong>
                <ReactMarkdown>{activeSummary.text}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======

      {/* --- YOUTUBE TAB --- */}
      {activeTab === 'youtube' && (
        <div>
          {/* Academic Boost Banner */}
          <div style={{ background: 'linear-gradient(45deg, #646cff, #9b59b6)', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
            <strong>💡 Recommendation:</strong> As a {profile.year} student in {profile.degree}, check out tutorials on "Advanced System Design" or "AI Ethics".
          </div>
            {showPlaylist && (<h3 style={{ marginBottom: '15px' }}>📂 My Playlist</h3>
              )}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search topic..." style={{ flex: 1, padding: '10px' }} />
            <button onClick={searchYoutube} disabled={loading}>{loading ? "..." : "Search"}</button>
                        <button
              onClick={() => {
                setShowPlaylist(!showPlaylist)
                fetchPlaylist()
              }}
              style={{ background: '#9b59b6' }}
            >
              📂 View Playlist
            </button>
          </div>
          <div style={{ display: 'grid', gap: '20px' }}>
  {displayedVideos.map((v) => (
    <div
      key={v.id}
      style={{
        background: '#242424',
        padding: '15px',
        borderRadius: '8px',
        textAlign: 'left'
      }}
    >
      <div style={{ display: 'flex', gap: '15px' }}>
        <img
          src={v.thumbnail}
          style={{ width: '160px', borderRadius: '4px' }}
        />

        <div>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
            {v.title}
          </h3>

          <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '8px' }}>
            {v.channel}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noreferrer"
            >
              Watch
            </a>

            {!showPlaylist && (
              <>
                <button
                  onClick={() => explainVideo(v.id, v.title, v.channel)}
                  style={{ fontSize: '12px', background: '#e91e63' }}
                >
                  {summaryLoading === v.id ? '...' : '✨ AI Summary'}
                </button>

                <button
                  onClick={() => addToPlaylist(v)}
                  style={{ fontSize: '12px', background: '#2ecc71' }}
                >
                  ➕ Playlist
                </button>
              </>
            )}

            {/* 🔴 REMOVE BUTTON (ONLY IN PLAYLIST MODE) */}
            {showPlaylist && (
              <button
                onClick={() => removeFromPlaylist(v.id)}
                style={{ fontSize: '12px', background: '#e74c3c' }}
              >
                ❌ Remove
              </button>
            )}
          </div>  
        </div>
      </div>

      {/* Summary stays unchanged */}
      {activeSummary?.id === v.id && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            background: '#333',
            borderLeft: '4px solid #e91e63'
          }}
        >
          <ReactMarkdown>{activeSummary.text}</ReactMarkdown>
        </div>
      )}
    </div>
  ))}
</div>

        </div>
      )}

      {/* --- SKILLS TAB --- */}
      {activeTab === 'skills' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Skill to learn..." style={{ flex: 1, padding: '10px' }} />
            <button onClick={generateSyllabus} disabled={syllabusLoading} style={{ background: '#2ecc71' }}>{syllabusLoading ? "..." : "Generate Plan"}</button>
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
          {syllabus && syllabus.error && <div style={{ color: 'red' }}>⚠️ AI could not generate the plan.</div>}
        </div>
      )}

      {/* --- FINANCE TAB --- */}
      {activeTab === 'finance' && (
        <div style={{ textAlign: 'left' }}>
          <div style={{ background: '#242424', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <h3>Add Expense</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} style={{ padding: '10px' }}>
                <option>Food</option><option>Transport</option><option>Fun</option><option>Education</option><option>Medical</option>
              </select>
              <input type="number" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} placeholder="Amount" style={{ padding: '10px' }} />
              <button onClick={addExpense} style={{ background: '#f1c40f', color: '#000' }}>Add</button>
              <button onClick={analyzeFinance}>📊 Analyze Spending</button>
            </div>
            {aiAdvice && <div style={{ marginTop: '10px', padding: '10px', background: '#333', color: '#f1c40f' }}>🤖 {aiAdvice}</div>}
          </div>
          <h3>History (Total: ₹{totalSpent})</h3>
          {analysisLoading && (
  <div style={{ marginTop: "10px", color: "#aaa" }}>
    🤖 Analyzing your spending...
  </div>
)}

{financeAnalysis && (
  <div style={{ marginTop: "15px", background: "#333", padding: "15px", borderRadius: "8px" }}>
    <strong>📊 Spending Analysis</strong>
    <p style={{ marginTop: "8px" }}>{financeAnalysis.summary}</p>

    {financeAnalysis.saving_tips?.length > 0 && (
      <>
        <p><strong>💡 Where you can save:</strong></p>
        <ul>
          {financeAnalysis.saving_tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </>
    )}

    {financeAnalysis.safe_options?.length > 0 && (
      <>
        <p><strong>🔐 Safe saving options:</strong></p>
        <ul>
          {financeAnalysis.safe_options.map((opt, i) => (
            <li key={i}>{opt}</li>
          ))}
        </ul>
      </>
    )}
  </div>
)}

          {expenses.map((e, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #444' }}>
              <span>{e.date} - {e.category}</span>
              <span style={{ color: '#f1c40f' }}>₹{e.amount}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'scheduler' && (
        <div style={{ textAlign: 'left' }}>
          <div style={{ background: '#242424', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <h3>📅 Smart Routine Planner</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Home Location</label>
                <input value={homeLoc} onChange={e => setHomeLoc(e.target.value)} placeholder="e.g. Andheri West" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
              </div>
              <div>
                <label>College Location</label>
                <input value={collegeLoc} onChange={e => setCollegeLoc(e.target.value)} placeholder="e.g. IIT Bombay" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
              </div>
              <div>
                <label>College Start</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
              </div>
              <div>
                <label>College End</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
              </div>
            </div>

            <button onClick={generateSchedule} disabled={scheduleLoading} style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#3498db', border: 'none', cursor: 'pointer' }}>
              {scheduleLoading ? "Calculating Commute & Planning..." : "✨ Generate Routine"}
            </button>
          </div>

          {schedule && (
            <div>
              <div style={{ background: '#3498db', padding: '10px', borderRadius: '5px', marginBottom: '15px', color: 'white' }}>
                🚗 {schedule.commute_summary}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {schedule.routine.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex', gap: '15px', background: '#333', padding: '15px', borderRadius: '8px',
                    borderLeft: item.type === 'health' ? '4px solid #2ecc71' : item.type === 'commute' ? '4px solid #f1c40f' : '4px solid #9b59b6'
                  }}>
                    <div style={{ fontWeight: 'bold', minWidth: '100px' }}>{item.time}</div>
                    <div>{item.activity}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TASKS TAB --- */}
      {activeTab === 'tasks' && (
        <div style={{ textAlign: 'left' }}>
          <div style={{ background: '#242424', padding: '20px', borderRadius: '10px' }}>
            <h3>Paste Group Chat</h3>
            <textarea value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Paste messy text here..." style={{ width: '100%', height: '80px', padding: '10px', marginBottom: '10px' }} />
            <button onClick={parseText} disabled={parsing} style={{ background: '#9b59b6' }}>{parsing ? "..." : "Extract Tasks"}</button>
          </div>

          {/* SAVED TASKS LIST */}
          <div style={{ marginTop: '30px' }}>
            <h3>📌 Your To-Do List</h3>
            {savedTasks.length === 0 && <p style={{ color: '#777' }}>No saved tasks.</p>}

            {savedTasks.map((t, i) => {
              const createLink = () => {
                const title = encodeURIComponent(t.subject + ": " + t.title);
                const d = t.deadline ? t.deadline.replace(/-/g, '') : "";
                if (d) window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${d}/${d}`, '_blank');
              }
              return (
                <div key={i} style={{ background: '#333', padding: '15px', marginBottom: '10px', borderRadius: '5px', borderLeft: '5px solid #9b59b6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{t.subject}</h4>
                    <p style={{ margin: 0, color: '#ccc' }}>{t.title}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#f1c40f', fontWeight: 'bold', marginBottom: '5px' }}>📅 {t.deadline}</div>
                    <button onClick={createLink} style={{ padding: '5px', fontSize: '12px' }}>➕ Calendar</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

>>>>>>> Stashed changes
    </div>
  );
}

export default App;
