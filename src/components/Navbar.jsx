import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, User, Settings, Moon, Sun, RefreshCw } from 'lucide-react';
import storageService from '../services/storageService';

const Navbar = ({ onRefresh, lastUpdated, user, onLogout }) => {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    storageService.setPreferences({ theme: newTheme });
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const diff = Date.now() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes === 0) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass-panel border-b border-linear-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-linear-accent to-linear-accent-light p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                Smart Crypto Tracker
              </h1>
              <p className="text-xs text-gray-500">India Edition</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Last Updated */}
            <div className="hidden md:flex items-center text-xs text-gray-400">
              <span>Updated: {formatLastUpdated()}</span>
            </div>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              className="p-2 rounded-lg bg-linear-hover hover:bg-linear-border transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5 text-gray-300" />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-linear-hover hover:bg-linear-border transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
            </motion.button>

            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-200">{user.username}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-linear-hover hover:bg-red-500/20 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-300" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
