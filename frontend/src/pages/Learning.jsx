import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function Learning({ user, profile }) {
  // Local State for Learning Feature
  const [query, setQuery] = useState("")
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeSummary, setActiveSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(null)

  // API Functions
  const searchYoutube = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://shunya-backend-bhi0.onrender.com/api/youtube/search?query=${query}`);
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
      const res = await fetch('https://shunya-backend-bhi0.onrender.com/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, channel })
      });
      const data = await res.json();
      setActiveSummary({ id: videoId, text: data.summary });
    } catch (e) { console.error(e); }
    setSummaryLoading(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="header-section">
          <h1 className="page-title">Smart Learning</h1>
          <p className="page-subtitle">Curated videos for {profile?.degree} students.</p>
      </div>

      {/* Search Bar */}
      <div style={{display:'flex', gap:'15px', marginBottom:'30px'}}>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search for a topic..." style={{maxWidth:'400px'}} />
        <button className="btn btn-primary" onClick={searchYoutube} disabled={loading}>{loading ? "Searching..." : "Search"}</button>
      </div>

      {/* Video Grid */}
      <div className="grid-3">
        {videos.map(v => (
          <div key={v.id} className="card" style={{padding:0, overflow:'hidden', display:'flex', flexDirection:'column'}}>
            <img src={v.thumbnail} style={{width:'100%', height:'180px', objectFit:'cover'}} />
            <div style={{padding:'20px', flex:1, display:'flex', flexDirection:'column'}}>
              <h3 style={{marginTop:0, fontSize:'1rem', marginBottom:'10px'}}>{v.title}</h3>
              <div style={{marginTop:'auto', display:'flex', gap:'10px'}}>
                <a href={`https://youtube.com/watch?v=${v.id}`} target="_blank" className="btn btn-ghost" style={{flex:1, textAlign:'center', textDecoration:'none'}}>Watch</a>
                <button className="btn btn-primary" style={{flex:1}} onClick={() => explainVideo(v.id, v.title, v.channel)}>
                    {summaryLoading === v.id ? "..." : "Summary"}
                </button>
              </div>
              {activeSummary?.id === v.id && (
                <div style={{marginTop:'15px', padding:'10px', background:'rgba(255,255,255,0.05)', borderRadius:'8px', fontSize:'0.85rem'}}>
                  <ReactMarkdown>{activeSummary.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}