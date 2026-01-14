import { useState } from 'react'
import './App.css'
import ReactMarkdown from 'react-markdown'

function App() {
  const [query, setQuery] = useState("")
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  
  // --- STATE FOR AI SUMMARY ---
  const [activeSummary, setActiveSummary] = useState(null) 
  const [summaryLoading, setSummaryLoading] = useState(null)

  const searchYoutube = async () => {
    if(!query) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/youtube/search?query=${query}`);
      const data = await response.json();
      setVideos(data.videos || []);
      setActiveSummary(null); // Clear old summaries when searching new stuff
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
    setLoading(false);
  }

  // --- FUNCTION: CALL GEMINI ---
  const explainVideo = async (videoId, title, channel) => {
    setSummaryLoading(videoId);
    setActiveSummary(null); 
    
    try {
      const response = await fetch('http://localhost:8000/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, channel })
      });
      const data = await response.json();
      setActiveSummary({ id: videoId, text: data.summary });
      
    } catch (error) {
      console.error("AI Error:", error);
    }
    setSummaryLoading(null);
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>📚 Smart Study Manager</h1>
      
      {/* Search Section */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to learn? (e.g. Python for Beginners)"
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button onClick={searchYoutube} disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? "Searching..." : "Find Resources"}
        </button>
      </div>

      {/* Results Section */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {videos.map((video) => (
          <div key={video.id} style={{ 
              background: '#242424', padding: '15px', 
              borderRadius: '8px', textAlign: 'left' 
            }}>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <img src={video.thumbnail} alt={video.title} style={{ width: '160px', borderRadius: '4px' }} />
              <div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{video.title}</h3>
                <p style={{ color: '#aaa', margin: 0 }}>{video.channel}</p>
                
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" style={{ color: '#646cff', textDecoration: 'none' }}>
                        Watch on YouTube
                    </a>
                    
                    {/* --- THE PINK BUTTON --- */}
                    <button 
                        onClick={() => explainVideo(video.id, video.title, video.channel)}
                        style={{ padding: '8px 12px', fontSize: '12px', background: '#e91e63', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {summaryLoading === video.id ? "Analyzing..." : "✨ AI Summary"}
                    </button>
                </div>
              </div>
            </div>

            {/* --- AI SUMMARY DISPLAY --- */}
            {activeSummary && activeSummary.id === video.id && (
                <div style={{ marginTop: '15px', padding: '15px', background: '#333', borderRadius: '5px', borderLeft: '4px solid #e91e63' }}>
                    <strong style={{display: 'block', marginBottom: '10px'}}>🤖 Gemini Summary:</strong>
                    <ReactMarkdown>{activeSummary.text}</ReactMarkdown>
                </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}

export default App