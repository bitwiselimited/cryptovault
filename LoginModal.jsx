import { useState } from 'react'

function LoginModal({ onLogin, darkMode }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim() && email.trim()) {
      onLogin({ name: name.trim(), email: email.trim() })
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'dark' : ''}`}>
      <div className="gradient-bg fixed inset-0"></div>
      <div className="glass-card rounded-3xl p-8 max-w-md w-full relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💎</div>
          <h1 className="text-4xl font-bold text-white mb-2">CryptoVault</h1>
          <p className="text-white/70">Premium Crypto Tracker</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-primary-500"
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-primary-500"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-lg transition-all hover-lift shadow-lg"
          >
            Start Tracking 🚀
          </button>
        </form>
        
        <p className="text-white/50 text-xs text-center mt-6">
          No backend • Data stored locally • 100% free
        </p>
      </div>
    </div>
  )
}

export default LoginModal
