import { NavLink } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { motion } from 'framer-motion'
import { auth } from '../firebaseConfig'

const spring = {
  type: "spring",
  stiffness: 260,
  damping: 24
}

// Icons unchanged
const Icons = {
  Home: () => <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Youtube: () => <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>,
  Brain: () => <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5 10 10 0 0 0-10 10"></path><path d="M8.5 8.5a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 1 0 5"></path></svg>,
  Wallet: () => <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
  Map: () => <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>,
  Task: () => <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
}

export default function Sidebar({ user, profile }) {
  const handleLogout = () => signOut(auth)

  return (
    <motion.aside 
      className="sidebar"
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={spring}
    >
      <div className="brand">
        🚀 <span>Shunya</span>
      </div>

      <nav className="nav-menu">
        {[
          { to: "/", label: "Dashboard", icon: <Icons.Home /> },
          { to: "/learning", label: "Learning", icon: <Icons.Youtube /> },
          { to: "/skills", label: "Skill Plan", icon: <Icons.Brain /> },
          { to: "/finance", label: "Finance", icon: <Icons.Wallet /> },
          { to: "/planner", label: "Commute", icon: <Icons.Map /> },
          { to: "/tasks", label: "Tasks", icon: <Icons.Task /> },
        ].map(item => (
          <NavLink key={item.to} to={item.to} className="nav-item">
            {({ isActive }) => (
              <motion.div
                className="nav-inner"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                animate={{
                  backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0)"
                }}
                transition={spring}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <motion.div 
        className="user-profile"
        whileHover={{ scale: 1.03 }}
        transition={spring}
      >
        <img src={user.photoURL} className="user-avatar" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.displayName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{profile?.year}</div>
        </div>
        <button onClick={handleLogout} className="btn-ghost">Logout</button>
      </motion.div>
    </motion.aside>
  )
}
