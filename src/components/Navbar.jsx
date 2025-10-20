import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, TrendingUp, Bell, Wallet, Building2, Search, Star, User, LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Navbar = ({ username, onLogout }) => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/favorites', label: 'Favorites', icon: Star },
    { path: '/predictor', label: 'Predictor', icon: TrendingUp },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/portfolio', label: 'Portfolio', icon: Wallet },
    { path: '/platforms', label: 'Platforms', icon: Building2 },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b linear-border bg-[#0D0E12]/80 dark:bg-[#0D0E12]/80 light:bg-white/80 backdrop-blur-xl">
      <div className="mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
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
                  className={`relative flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive 
                      ? 'text-white dark:text-white light:text-gray-900' 
                      : 'text-gray-400 hover:text-gray-200 dark:hover:text-gray-200 light:hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 linear-bg rounded-md -z-10"
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
              className="p-2 rounded-md linear-hover text-gray-400 hover:text-gray-200 transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md linear-hover text-gray-400 hover:text-gray-200 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 rounded-md linear-bg">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium">{username}</span>
            </div>
            
            <button
              onClick={onLogout}
              className="p-2 rounded-md linear-hover text-gray-400 hover:text-red-400 transition-colors"
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
