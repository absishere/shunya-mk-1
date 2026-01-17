import { useState, useEffect } from 'react'
import SkeletonCard from '../components/SkeletonCard'

export default function Finance({ user }) {
  const [loading, setLoading] = useState(false)
  const [expenses, setExpenses] = useState([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [amountInput, setAmountInput] = useState("")
  const [categoryInput, setCategoryInput] = useState("Food")
  const [aiAdvice, setAiAdvice] = useState("")

  const fetchExpenses = async () => {
    if (!user) return;

    setLoading(true)

    try {
      const res = await fetch(
        `https://shunya-backend-bhi0.onrender.com/api/finance/expenses?user_id=${user.uid}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await res.json();
      setExpenses(data.expenses || []);
      setTotalSpent(data.total || 0);

    } catch (e) {
      console.error("Finance fetch error:", e);
    } finally {
      setLoading(false);   // ✅ always executes
    }
  };


  // Auto-load on mount
  useEffect(() => {
    if (user) fetchExpenses();
  }, [user]);

  const addExpense = async () => {
    if (!amountInput || !user) return;
    setAiAdvice("Analyzing...");
    try {
      const res = await fetch('https://shunya-backend-bhi0.onrender.com/api/finance/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
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

  return (
    <div>
      <div className="header-section">
        <h1 className="page-title">Expense Tracker</h1>
        <p className="page-subtitle">Track spending and get AI financial advice.</p>
      </div>

      <div className="grid-2">

        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {/* Input Card */}
            <div className="card">
              <h3>Add Expense</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <select value={categoryInput} onChange={e => setCategoryInput(e.target.value)}>
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Education</option>
                  <option>Fun</option>
                </select>
                <input
                  type="number"
                  value={amountInput}
                  onChange={e => setAmountInput(e.target.value)}
                  placeholder="Amount (₹)"
                />
                <button className="btn btn-primary" onClick={addExpense}>
                  Track Expense
                </button>
              </div>

              {aiAdvice && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid var(--primary)',
                  borderRadius: '8px',
                  color: '#a5b4fc'
                }}>
                  🤖 {aiAdvice}
                </div>
              )}
            </div>

            {/* History Card */}
            <div className="card">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3>History</h3>
                <span className="tag" style={{ background: 'var(--accent)', color: 'white' }}>
                  Total: ₹{totalSpent}
                </span>
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {expenses.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No expenses yet.
                  </div>
                )}
                {expenses.map((e, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '500' }}>{e.category}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {e.date}
                      </div>
                    </div>
                    <div style={{ color: 'var(--accent)', fontWeight: '600' }}>
                      ₹{e.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  )
}