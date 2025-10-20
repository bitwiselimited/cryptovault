import React from 'react'
import { motion } from 'framer-motion'
import { Home, TrendingUp, Bell, Wallet, Building2, User, LogOut, Moon, Sun } from 'lucide-react'

const Navbar = ({ activeTab, setActiveTab, username, onLogout, theme, setTheme }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'predictor', label: 'Predictor', icon: TrendingUp },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'platforms', label: 'Platforms', icon: Building2 },
  ]

  return (
    <nav className="sticky top-0 z-50 glass-blur border-b border-linear-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold hidden sm:inline">Smart Crypto</span>
            </div>
            
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-3 py-2 rounded-lg transition-smooth ${
                      isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium hidden md:inline">{tab.label}</span>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-linear-hover rounded-lg"
                        style={{ zIndex: -1 }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-linear-hover">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium hidden sm:inline">{username}</span>
            </div>
            
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-linear-hover transition-smooth text-gray-400 hover:text-red-400"
              title="Logout"
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
