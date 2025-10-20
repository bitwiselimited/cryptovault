import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Search, CheckCircle } from 'lucide-react'
import { getAlerts, addAlert, removeAlert } from '../utils/db'
import { useData } from '../context/DataContext'
import { checkPriceAlerts } from '../utils/notifications'

const Alerts = () => {
  const { coins } = useData()
  const [alerts, setAlerts] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [alertType, setAlertType] = useState('above')
  const [targetPrice, setTargetPrice] = useState('')

  useEffect(() => {
    loadAlerts()
    
    const interval = setInterval(() => {
      checkPriceAlerts(coins, alerts)
    }, 60000)
    
    return () => clearInterval(interval)
  }, [coins])

  const loadAlerts = async () => {
    const savedAlerts = await getAlerts()
    setAlerts(savedAlerts)
  }

  const handleAddAlert = async () => {
    if (!selectedCoin || !targetPrice) return
    
    const newAlert = {
      id: Date.now().toString(),
      coinId: selectedCoin.id,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol,
      coinImage: selectedCoin.image,
      type: alertType,
      targetPrice: parseFloat(targetPrice),
      currentPrice: selectedCoin.current_price,
      createdAt: new Date().toISOString(),
    }
    
    await addAlert(newAlert)
    await loadAlerts()
    
    setShowAddForm(false)
    setSelectedCoin(null)
    setTargetPrice('')
    setSearchQuery('')
  }

  const handleRemoveAlert = async (alertId) => {
    await removeAlert(alertId)
    await loadAlerts()
  }

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-glow-blue">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">Price Alerts</h1>
          </div>
          <p className="text-gray-400">Get instant notifications when prices hit your targets</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-brand rounded-xl font-semibold shadow-lg hover:shadow-glow-blue smooth-transition"
        >
          <Plus className="w-5 h-5" />
          <span>Create Alert</span>
        </button>
      </div>

      {/* Add Alert Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card-modern rounded-2xl p-6 lg:p-8 space-y-6"
          >
            <h3 className="text-2xl font-bold gradient-text">Create New Price Alert</h3>
            
            {/* Coin Search */}
            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a cryptocurrency..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border-2 border-accent-blue/20 focus:border-accent-blue outline-none smooth-transition"
              />
            </div>

            {/* Coin Selection Dropdown */}
            {searchQuery && !selectedCoin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-h-80 overflow-y-auto space-y-2 p-2 card-modern rounded-xl"
              >
                {filteredCoins.map(coin => (
                  <button
                    key={coin.id}
                    onClick={() => {
                      setSelectedCoin(coin)
                      setSearchQuery('')
                    }}
                    className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-white/10 smooth-transition text-left"
                  >
                    <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <p className="font-bold">{coin.name}</p>
                      <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${coin.current_price.toFixed(2)}</p>
                      <p className={`text-sm ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Selected Coin Display */}
            {selectedCoin && !searchQuery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-4 p-5 rounded-xl bg-gradient-brand/10 border-2 border-accent-blue/30"
              >
                <img src={selectedCoin.image} alt={selectedCoin.name} className="w-14 h-14 rounded-full ring-2 ring-accent-blue" />
                <div className="flex-1">
                  <p className="font-bold text-lg">{selectedCoin.name}</p>
                  <p className="text-sm text-gray-400">Current Price: ${selectedCoin.current_price.toFixed(2)}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </motion.div>
            )}

            {/* Alert Type Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-3">Alert Trigger</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setAlertType('above')}
                  className={`flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-bold smooth-transition ${
                    alertType === 'above' 
                      ? 'bg-green-500/20 text-green-400 border-2 border-green-500' 
                      : 'bg-white/5 text-gray-400 border-2 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Price Goes Above</span>
                </button>
                <button
                  onClick={() => setAlertType('below')}
                  className={`flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-bold smooth-transition ${
                    alertType === 'below' 
                      ? 'bg-red-500/20 text-red-400 border-2 border-red-500' 
                      : 'bg-white/5 text-gray-400 border-2 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <TrendingDown className="w-5 h-5" />
                  <span>Price Goes Below</span>
                </button>
              </div>
            </div>

            {/* Target Price Input */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-3">Target Price (USD)</label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Enter target price..."
                step="0.01"
                className="w-full px-5 py-4 rounded-xl bg-white/5 border-2 border-accent-blue/20 focus:border-accent-blue outline-none smooth-transition text-lg font-bold"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddAlert}
                disabled={!selectedCoin || !targetPrice}
                className="flex-1 btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Alert
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setSelectedCoin(null)
                  setSearchQuery('')
                  setTargetPrice('')
                }}
                className="px-6 py-4 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold smooth-transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Active Alerts ({alerts.length})</h2>
        
        {alerts.length === 0 ? (
          <div className="card-modern rounded-2xl p-16 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold mb-2">No Alerts Created Yet</h3>
            <p className="text-gray-400 mb-6">Create your first price alert to get started</p>
            <button onClick={() => setShowAddForm(true)} className="btn-primary">
              Create Your First Alert
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {alerts.map((alert, index) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                index={index}
                onRemove={handleRemoveAlert}
                currentPrice={coins.find(c => c.id === alert.coinId)?.current_price}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function AlertCard({ alert, index, onRemove, currentPrice }) {
  const isTriggered = currentPrice && (
    (alert.type === 'above' && currentPrice >= alert.targetPrice) ||
    (alert.type === 'below' && currentPrice <= alert.targetPrice)
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`card-modern rounded-2xl p-6 ${
        isTriggered ? 'ring-2 ring-green-500 shadow-glow-blue' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center space-x-5 flex-1">
          <img 
            src={alert.coinImage} 
            alt={alert.coinName} 
            className="w-14 h-14 rounded-full ring-2 ring-accent-blue/30" 
          />
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">{alert.coinName}</h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                alert.type === 'above' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {alert.type === 'above' ? '↑ Above' : '↓ Below'} ${alert.targetPrice.toFixed(2)}
              </span>
              {currentPrice && (
                <span className="text-sm text-gray-400">
                  Current: <span className="font-bold text-white">${currentPrice.toFixed(2)}</span>
                </span>
              )}
              {isTriggered && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-sm font-bold flex items-center space-x-1"
                >
                  <Bell className="w-4 h-4" />
                  <span>TRIGGERED!</span>
                </motion.span>
              )}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(alert.id)}
          className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 smooth-transition"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Alerts
