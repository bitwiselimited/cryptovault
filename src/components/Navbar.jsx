import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, TrendingUp, Bell, Wallet, Building2, Search, Star, User, LogOut, Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Navbar = ({ username, onLogout }) => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/favorites', label: 'Favorites', icon: Star },
    { path: '/predictor', label: 'Predictor', icon: TrendingUp },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/portfolio', label: 'Portfolio', icon: Wallet },
    { path: '/platforms', label: 'Platforms', icon: Building2 },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0A0B0F]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-sm' : 'bg-transparent border-b border-white/[0.05]'
      }`}>
        <div className="mx-auto px-4 sm:px-6 max-w-[1400px]">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
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
                  <Link key={item.path} to={item.path} className="relative">
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'text-primary' : 'text-secondary hover:text-primary'
                    }`}>
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-white/[0.06] rounded-md -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
            
            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {/* Search - Desktop */}
              <Link to="/search" className="hidden sm:flex p-2 rounded-md linear-button-ghost">
                <Search className="w-4 h-4" />
              </Link>
              
              {/* Theme Toggle */}
              <button onClick={toggleTheme} className="p-2 rounded-md linear-button-ghost">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              
              {/* User - Desktop */}
              <div className="hidden md:flex items-center space-x-2 px-2.5 py-1.5 linear-card">
                <User className="w-3.5 h-3.5 text-secondary" />
                <span className="text-xs font-medium max-w-[80px] truncate">{username}</span>
              </div>
              
              {/* Logout - Desktop */}
              <button onClick={onLogout} className="hidden md:flex p-2 rounded-md linear-button-ghost text-accent-red">
                <LogOut className="w-4 h-4" />
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md linear-button-ghost"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-14 right-0 bottom-0 w-[280px] bg-[#0F1014] border-l border-white/[0.08] z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 space-y-2">
                {/* User Info */}
                <div className="flex items-center space-x-3 p-4 linear-card mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{username}</p>
                    <p className="text-xs text-secondary">Crypto Trader</p>
                  </div>
                </div>

                {/* Navigation Links */}
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30' 
                          : 'text-secondary hover:bg-white/[0.06] hover:text-primary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  )
                })}

                {/* Search Link */}
                <Link
                  to="/search"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-secondary hover:bg-white/[0.06] hover:text-primary transition-all"
                >
                  <Search className="w-5 h-5" />
                  <span className="text-sm font-medium">Search</span>
                </Link>

                {/* Divider */}
                <div className="border-t border-white/[0.08] my-4" />

                {/* Logout */}
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-accent-red hover:bg-accent-red/10 transition-all w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
