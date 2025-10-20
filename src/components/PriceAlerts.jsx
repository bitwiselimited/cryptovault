import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Search } from 'lucide-react'
import { getAlerts, addAlert, removeAlert } from '../utils/db'
import { useCryptoData } from '../hooks/useCryptoData'
import { checkPriceAlerts } from '../utils/notifications'

const PriceAlerts = () => {
  const { coins } = useCryptoData()
  const [alerts, setAlerts] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [alertType, setAlertType] = useState('above')
  const [targetPrice, setTargetPrice] = useState('')

  useEffect(() => {
    loadAlerts()
    
    // Check alerts every minute
    const interval = setInterval(() => {
      checkPriceAlerts(coins, alerts)
    }, 60000)
    
    return () => clearInterval(interval)
  }, [coins, alerts])

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
    
    // Reset form
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
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Price Alerts</h1>
          </div>
          <p className="text-gray-400">Get notified when prices hit your targets</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-smooth"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add Alert</span>
        </button>
      </div>

      {/* Add Alert Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-elevated rounded-xl p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold mb-4">Create New Alert</h3>
            
            {/* Coin Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a coin..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-linear-dark-200 border border-linear-border text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-smooth"
              />
            </div>

            {/* Coin Selection */}
            {searchQuery && (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredCoins.map(coin => (
                  <button
                    key={coin.id}
                    onClick={() => {
                      setSelectedCoin(coin)
                      setSearchQuery('')
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-linear-hover transition-smooth text-left"
                  >
                    <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium">{coin.name}</p>
                      <p className="text-sm text-gray-400">${coin.current_price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Coin */}
            {selectedCoin && !searchQuery && (
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-linear-hover">
                <img src={selectedCoin.image} alt={selectedCoin.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="font-medium">{selectedCoin.name}</p>
                  <p className="text-sm text-gray-400">Current: ${selectedCoin.current_price.toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* Alert Type */}
            <div className="flex rounded-lg bg-linear-dark-200 p-1">
              <button
                onClick={() => setAlertType('above')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md transition-smooth ${
                  alertType === 'above' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Price Above</span>
              </button>
              <button
                onClick={() => setAlertType('below')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md transition-smooth ${
                  alertType === 'below' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                <span>Price Below</span>
              </button>
            </div>

            {/* Target Price */}
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Enter target price (USD)"
              step="0.01"
              className="w-full px-4 py-3 rounded-lg bg-linear-dark-200 border border-linear-border text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-smooth"
            />

            {/* Submit */}
            <button
              onClick={handleAddAlert}
              disabled={!selectedCoin || !targetPrice}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-smooth"
            >
              Create Alert
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="card-elevated rounded-xl p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No alerts set yet</p>
            <p className="text-sm text-gray-500 mt-2">Create your first alert to get started</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              index={index}
              onRemove={handleRemoveAlert}
              currentPrice={coins.find(c => c.id === alert.coinId)?.current_price}
            />
          ))
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
      className={`card-elevated rounded-xl p-5 ${isTriggered ? 'ring-2 ring-green-500' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <img src={alert.coinImage} alt={alert.coinName} className="w-12 h-12 rounded-full" />
          
          <div className="flex-1">
            <h3 className="font-semibold text-white">{alert.coinName}</h3>
            <div className="flex items-center space-x-3 mt-1">
              <span className={`text-sm px-2 py-0.5 rounded ${
                alert.type === 'above' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {alert.type === 'above' ? '↑ Above' : '↓ Below'}
              </span>
              <span className="text-sm text-gray-400">
                Target: ${alert.targetPrice.toFixed(2)}
              </span>
              {currentPrice && (
                <span className="text-sm text-gray-400">
                  Current: ${currentPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {isTriggered && (
            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
              Triggered!
            </div>
          )}
        </div>

        <button
          onClick={() => onRemove(alert.id)}
          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-smooth ml-4"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}

export default PriceAlerts
