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
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  }

  return (
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
    </div>
  )
}

export default App