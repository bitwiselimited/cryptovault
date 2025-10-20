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
import Favorites from './pages/Favorites'
import CoinDetails from './pages/CoinDetails'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'
import { requestNotificationPermission } from './utils/notifications'
import { initDB } from './utils/db'

function App() {
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    initDB()
    const savedUser = localStorage.getItem('cryptoTrackerUser')
    if (savedUser) {
      setUsername(savedUser)
      setIsLoggedIn(true)
    }
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
          
          <main className="pt-16">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/predictor" element={<Predictor />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/portfolio" element={<Portfolio username={username} />} />
                <Route path="/platforms" element={<Platforms />} />
                <Route path="/search" element={<Search />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/coin/:coinId" element={<CoinDetails />} />
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0D0E12]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold mb-3 text-white">Smart Crypto Tracker</h1>
          <p className="text-sm text-gray-400">Modern cryptocurrency portfolio management</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              autoFocus
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Continue →
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default App
