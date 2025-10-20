import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Predictor from './pages/Predictor'
import Alerts from './pages/Alerts'
import Portfolio from './pages/Portfolio'
import Platforms from './pages/Platforms'
import Search from './pages/Search'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'
import { requestNotificationPermission } from './utils/notifications'
import { initDB } from './utils/db'

function App() {
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Initialize database
    initDB()
    
    // Check for saved user
    const savedUser = localStorage.getItem('cryptoTrackerUser')
    if (savedUser) {
      setUsername(savedUser)
      setIsLoggedIn(true)
    }
    
    // Request notification permission
    requestNotificationPermission()
  }, [])

  const handleLogin = (name) => {
    localStorage.setItem('cryptoTrackerUser', name)
    setUsername(name)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('cryptoTrackerUser')
    setUsername('')
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <ThemeProvider>
      <DataProvider>
        <div className="min-h-screen">
          <Navbar username={username} onLogout={handleLogout} />
          
          <main className="container mx-auto px-4 py-8 max-w-7xl">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/predictor" element={<Predictor />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/portfolio" element={<Portfolio username={username} />} />
                <Route path="/platforms" element={<Platforms />} />
                <Route path="/search" element={<Search />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </DataProvider>
    </ThemeProvider>
  )
}

function LoginScreen({ onLogin }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onLogin(name.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-3xl p-8 md:p-12 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-brand mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">
            Smart Crypto Tracker
          </h1>
          <p className="text-gray-400">Track, Analyze, and Profit</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Enter Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-5 py-4 rounded-xl bg-dark-bg-secondary border-2 border-dark-border text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue smooth-transition text-lg"
              autoFocus
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full btn-primary py-4 text-lg"
          >
            Start Tracking →
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-dark-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-accent-blue">100+</div>
              <div className="text-xs text-gray-400">Coins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-purple">Real-time</div>
              <div className="text-xs text-gray-400">Updates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-cyan">Free</div>
              <div className="text-xs text-gray-400">Forever</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default App
