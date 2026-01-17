import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebaseConfig'
import './App.css'

// Components
import Sidebar from './components/Sidebar'
import Login from './pages/Login'         // We'll create this momentarily
import Onboarding from './pages/Onboarding' // And this

// Pages
import Dashboard from './pages/Dashboard'
import Learning from './pages/Learning'
import Skills from './pages/Skills'
import Finance from './pages/Finance'
import Planner from './pages/Planner'
import Tasks from './pages/Tasks'

function AnimatedRoutes({ user, profile }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ height: "100%" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard user={user} profile={profile} />} />
          <Route path="/learning" element={<Learning user={user} profile={profile} />} />
          <Route path="/skills" element={<Skills user={user} profile={profile} />} />
          <Route path="/finance" element={<Finance user={user} />} />
          <Route path="/planner" element={<Planner user={user} />} />
          <Route path="/tasks" element={<Tasks user={user} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        const docSnap = await getDoc(doc(db, "users", currentUser.uid))
        if (docSnap.exists()) setProfile(docSnap.data())
        else setProfile(null)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) return <div className="loading-screen">Loading Shunya...</div>

  // Auth Flow
  if (!user) return <Login />
  if (!profile) return <Onboarding user={user} setProfile={setProfile} />

  return (
    <Router>
      <div className="app-container">
        <Sidebar user={user} profile={profile} />

        <main className="main-content">
          <AnimatedRoutes
            user={user}
            profile={profile}
          />
        </main>
      </div>
    </Router>
  )
}

export default App