import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState("")
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  const searchYoutube = async () => {
    if(!query) return;
    setLoading(true);
    try {
      // Send the query to our Python backend
      const response = await fetch(`http://localhost:8000/api/youtube/search?query=${query}`);
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
    setLoading(false);
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
              display: 'flex', gap: '15px', 
              background: '#242424', padding: '15px', 
              borderRadius: '8px', textAlign: 'left' 
            }}>
            <img src={video.thumbnail} alt={video.title} style={{ width: '160px', borderRadius: '4px' }} />
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{video.title}</h3>
              <p style={{ color: '#aaa', margin: 0 }}>{video.channel}</p>
              <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" style={{ color: '#646cff', display: 'block', marginTop: '10px' }}>
                Watch on YouTube
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App