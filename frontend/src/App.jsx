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

  // 🔎 YOUTUBE SEARCH STATE
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🤖 AI SUMMARY STATE
  const [activeSummary, setActiveSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(null);

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
<<<<<<< Updated upstream
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Student Assistant Dashboard</h1>

      <button onClick={fetchData} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Test Connection
      </button>

      {data && (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
          <h3>Result from Python:</h3>
          <p>Status: <strong>{data.status}</strong></p>
          <p>Project: {data.project}</p>
          <p>Days Left: {data.days_left}</p>
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
>>>>>>> Stashed changes
    </div>
  );
}

export default App;
