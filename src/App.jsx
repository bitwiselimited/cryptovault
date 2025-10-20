import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import PriceAlerts from './components/PriceAlerts'
import NextBigThingPredictor from './components/NextBigThingPredictor'
import Portfolio from './components/Portfolio'
import TrustedPlatforms from './components/TrustedPlatforms'
import { requestNotificationPermission } from './utils/notifications'
import { initDB } from './utils/db'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [theme, setTheme] = useState('dark')
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
    setActiveTab('dashboard')
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-linear">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        username={username}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <Dashboard key="dashboard" />}
          {activeTab === 'predictor' && <NextBigThingPredictor key="predictor" />}
          {activeTab === 'alerts' && <PriceAlerts key="alerts" />}
          {activeTab === 'portfolio' && <Portfolio key="portfolio" username={username} />}
          {activeTab === 'platforms' && <TrustedPlatforms key="platforms" />}
        </AnimatePresence>
      </main>
    </div>
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
    <div className="min-h-screen bg-gradient-linear flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated rounded-2xl p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Smart Crypto Tracker
        </h1>
        <p className="text-gray-400 mb-8">India Edition</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter your name to continue
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg bg-linear-dark-200 border border-linear-border text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-smooth"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-smooth"
          >
            Start Tracking
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default App
