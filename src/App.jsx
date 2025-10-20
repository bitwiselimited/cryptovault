import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { useCryptoData } from './hooks/useCryptoData';
import { useNotifications } from './hooks/useNotifications';
import storageService from './services/storageService';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-linear-accent to-linear-accent-light rounded-2xl mb-4">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Smart Crypto Tracker
          </h1>
          <p className="text-gray-400">India Edition</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-linear-border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-linear-accent transition-colors"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-linear-accent to-linear-accent-light rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-linear-accent/50 transition-all"
          >
            Get Started
          </motion.button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Your data is stored locally on your device
        </p>
      </motion.div>
    </motion.div>
  );
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="shimmer w-16 h-16 rounded-2xl mx-auto mb-4"></div>
      <p className="text-gray-400 animate-pulse">Loading market data...</p>
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(storageService.getUser());
  const [watchlist, setWatchlist] = useState(storageService.getWatchlist());
  
  const { marketData, inrRate, loading, error, lastUpdated, refetch } = useCryptoData();
  const { permission, requestPermission } = useNotifications(marketData);

  const handleLogin = (username) => {
    const newUser = storageService.setUser(username);
    setUser(newUser);
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
  };

  const handleAddToWatchlist = (coinId) => {
    const currentWatchlist = storageService.getWatchlist();
    if (currentWatchlist.includes(coinId)) {
      const updated = storageService.removeFromWatchlist(coinId);
      setWatchlist(updated);
    } else {
      const updated = storageService.addToWatchlist(coinId);
      setWatchlist(updated);
    }
  };

  const handleAddToPortfolio = (coin) => {
    const amount = prompt(`How many ${coin.symbol.toUpperCase()} coins do you want to add?`);
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;

    const numAmount = parseFloat(amount);
    const totalInvested = coin.current_price * numAmount;

    storageService.addToPortfolio({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      amount: numAmount,
      totalInvested,
      purchasePrice: coin.current_price,
    });

    alert(`Added ${numAmount} ${coin.symbol.toUpperCase()} to your portfolio!`);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (loading && !marketData.length) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 max-w-md text-center">
          <p className="text-red-400 mb-4">Error loading data: {error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-linear-accent rounded-lg text-white font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onRefresh={refetch}
        lastUpdated={lastUpdated}
      />

      <Dashboard
        marketData={marketData}
        inrRate={inrRate}
        watchlist={watchlist}
        onAddToWatchlist={handleAddToWatchlist}
        onAddToPortfolio={handleAddToPortfolio}
        onRequestNotification={requestPermission}
      />

      {/* AdSense Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-panel p-4 text-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500 text-sm">
        <p>© 2025 Smart Crypto Tracker - India Edition. Made with ❤️ for Indian investors.</p>
        <p className="mt-2">Data provided by CoinGecko API. Not financial advice.</p>
      </footer>
    </div>
  );
}

export default App;
