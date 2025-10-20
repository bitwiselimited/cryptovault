import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, Shield, Zap } from 'lucide-react'

const LoginScreen = ({ onLogin }) => {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onLogin(name.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-dark-200 via-dark-100 to-dark-200">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl float-animation" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl float-animation" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple mb-6 shadow-lg"
          >
            <TrendingUp className="w-9 h-9 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-semibold mb-3"
          >
            Smart Crypto Tracker
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-secondary"
          >
            Modern portfolio management & market analytics
          </motion.p>
        </div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-xs font-medium text-secondary mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="linear-input w-full"
              autoFocus
              required
            />
          </div>
          
          <button
            type="submit"
            className="linear-button-primary w-full"
          >
            Get Started →
          </button>
        </motion.form>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 grid grid-cols-3 gap-6"
        >
          {[
            { icon: Sparkles, label: 'AI Predictions', color: 'text-accent-purple' },
            { icon: Shield, label: 'Secure', color: 'text-accent-green' },
            { icon: Zap, label: 'Real-time', color: 'text-accent-blue' },
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <feature.icon className={`w-5 h-5 mx-auto mb-2 ${feature.color}`} />
              <p className="text-xs text-secondary">{feature.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginScreen
