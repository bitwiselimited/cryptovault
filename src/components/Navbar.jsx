import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, TrendingUp, Bell, Wallet, Building2, Search, User, LogOut, Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Navbar = ({ username, onLogout }) => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/predictor', label: 'Predictor', icon: TrendingUp },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/portfolio', label: 'Portfolio', icon: Wallet },
    { path: '/platforms', label: 'Platforms', icon: Building2 },
    { path: '/search', label: 'Search', icon: Search },
  ]

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-dark-border dark:border-dark-border light:border-light-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center group-hover:shadow-glow-blue smooth-transition">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold gradient-text">Smart Crypto</div>
              <div className="text-xs text-gray-400">Tracker</div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <div className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl smooth-transition ${
                    isActive 
                      ? 'bg-accent-blue/20 text-accent-blue' 
                      : 'text-gray-400 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-white/5'
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeNavItem"
                      className="absolute -bottom-[1.35rem] left-0 right-0 h-0.5 bg-gradient-brand"
                      initial={false}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 smooth-transition"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-accent-blue" />
              )}
            </button>
            
            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5">
              <User className="w-5 h-5 text-accent-cyan" />
              <span className="text-sm font-semibold">{username}</span>
            </div>
            
            {/* Logout */}
            <button
              onClick={onLogout}
              className="hidden sm:flex p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 smooth-transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-white/5 hover:bg-white/10 smooth-transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden py-4 border-t border-dark-border"
          >
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl smooth-transition ${
                      isActive 
                        ? 'bg-accent-blue/20 text-accent-blue' 
                        : 'text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                )
              })}
              
              <div className="pt-4 border-t border-dark-border space-y-2">
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-accent-cyan" />
                    <span className="font-semibold">{username}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
