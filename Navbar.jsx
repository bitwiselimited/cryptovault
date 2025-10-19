function Navbar({ darkMode, setDarkMode, user, onLogout }) {
  return (
    <nav className="glass-card sticky top-0 z-50 mb-8">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">💎</div>
            <div>
              <h1 className="text-2xl font-bold text-white">CryptoVault</h1>
              <p className="text-xs text-white/70">Premium Crypto Tracker</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-white">
              <p className="text-sm font-semibold">Welcome, {user.name}!</p>
              <p className="text-xs opacity-70">{user.email}</p>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all hover-lift"
            >
              <span className="text-2xl">{darkMode ? '☀️' : '🌙'}</span>
            </button>
            
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white font-semibold transition-all hover-lift"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
