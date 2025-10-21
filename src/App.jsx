import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Predictor from './pages/Predictor'
import Alerts from './pages/Alerts'
import Portfolio from './pages/Portfolio'
import Platforms from './pages/Platforms'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import CoinDetails from './pages/CoinDetails'
import LoginScreen from './components/LoginScreen'
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
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('cryptoTrackerUser')
      setUsername('')
      setIsLoggedIn(false)
    }
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <ThemeProvider>
      <DataProvider>
        <div className="min-h-screen">
          <Navbar username={username} onLogout={handleLogout} />
          
          <main className="pt-14">
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
          
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(24, 24, 27, 0.95)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '13px',
              },
            }}
          />
        </div>
      </DataProvider>
    </ThemeProvider>
  )
}

export default App
