import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, TrendingUp, Bell, Wallet, Building2, Search, Star, User, LogOut, Moon, Sun, Command } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Navbar = ({ username, onLogout }) => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'k') {
          e.preventDefault()
          document.querySelector('a[href="/search"]')?.click()
        }
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/favorites', label: 'Favorites', icon: Star },
    { path: '/predictor', label: 'Predictor', icon: TrendingUp },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/portfolio', label: 'Portfolio', icon: Wallet },
    { path: '/platforms', label: 'Platforms', icon: Building2 },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-dark-100/80 dark:bg-dark-100/80 light:bg-white/80 backdrop-blur-xl border-b border-white/[0.08] shadow-sm' 
        : 'bg-transparent border-b border-white/[0.05]'
    }`}>
      <div className="mx-auto px-6 max-w-[1400px]">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center"
            >
              <TrendingUp className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-sm font-semibold">Smart Crypto</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-secondary hover:text-primary'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-white/[0.06] dark:bg-white/[0.06] light:bg-black/[0.04] rounded-md -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <Link
              to="/search"
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 linear-button-ghost text-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 bg-white/[0.06] rounded text-[10px] text-muted">
                <Command className="w-2.5 h-2.5 mr-0.5" />K
              </kbd>
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md linear-button-ghost"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 linear-card">
              <User className="w-3.5 h-3.5 text-secondary" />
              <span className="text-xs font-medium max-w-[80px] truncate">{username}</span>
            </div>
            
            <button
              onClick={onLogout}
              className="p-2 rounded-md linear-button-ghost text-accent-red hover:bg-accent-red/10"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
