import { useState } from 'react'

export default function Planner({ user }) {
  const [homeLoc, setHomeLoc] = useState("")
  const [collegeLoc, setCollegeLoc] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [schedule, setSchedule] = useState(null)
  const [scheduleLoading, setScheduleLoading] = useState(false)

  const generateSchedule = async () => {
    if (!user) return;
    setScheduleLoading(true);
    try {
      const res = await fetch('https://shunya-backend-bhi0.onrender.com/api/scheduler/generate', {
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

  return (
    <div>
      <div className="header-section">
        <h1 className="page-title">Daily Planner</h1>
        <p className="page-subtitle">Optimize your routine based on traffic data.</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Plan Your Day</h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginTop:'20px'}}>
            <div><label className="tag">Home</label><input value={homeLoc} onChange={e=>setHomeLoc(e.target.value)} style={{marginTop:'5px'}} /></div>
            <div><label className="tag">College</label><input value={collegeLoc} onChange={e=>setCollegeLoc(e.target.value)} style={{marginTop:'5px'}} /></div>
            <div><label className="tag">Start</label><input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} style={{marginTop:'5px'}} /></div>
            <div><label className="tag">End</label><input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} style={{marginTop:'5px'}} /></div>
          </div>
          <button className="btn btn-primary" style={{width:'100%', marginTop:'20px'}} onClick={generateSchedule} disabled={scheduleLoading}>
            {scheduleLoading ? "Calculating..." : "Generate Optimized Routine"}
          </button>
        </div>

        {schedule && (
          <div className="card">
            <div style={{marginBottom:'20px', padding:'15px', background:'rgba(99, 102, 241, 0.1)', borderRadius:'8px', border:'1px solid var(--primary)'}}>
              🚗 <strong>Commute Analysis:</strong> {schedule.commute_summary}
            </div>
            {schedule.routine.map((item, i) => (
              <div key={i} style={{display:'flex', gap:'15px', marginBottom:'15px', alignItems:'center'}}>
                <div style={{minWidth:'80px', fontWeight:'700', color:'white'}}>{item.time}</div>
                <div style={{flex:1, padding:'10px', background:'rgba(255,255,255,0.03)', borderRadius:'6px', borderLeft: item.type==='commute' ? '3px solid var(--accent)' : '3px solid var(--primary)'}}>
                  {item.activity}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}