import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Search, X } from 'lucide-react'
import { getAlerts, addAlert, removeAlert } from '../utils/db'
import { useData } from '../context/DataContext'

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
  }, [])

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
  ).slice(0, 8)

  return (
    <div className="container mx-auto px-6 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Price Alerts</h1>
          <p className="text-xs linear-text">Get notified when prices hit targets</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Alert</span>
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="linear-card rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Create Alert</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 linear-hover rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            {!selectedCoin && (
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 w-4 h-4 linear-text" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search coin..."
                  className="w-full pl-9 pr-3 py-2 linear-card rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Coin List */}
            {searchQuery && !selectedCoin && (
              <div className="mb-3 max-h-48 overflow-y-auto space-y-1">
                {filteredCoins.map(coin => (
                  <button
                    key={coin.id}
                    onClick={() => {
                      setSelectedCoin(coin)
                      setBuyPrice(coin.current_price.toString())
                      setSearchQuery('')
                    }}
                    className="w-full flex items-center space-x-2 p-2 linear-hover rounded-md text-left"
                  >
                    <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{coin.name}</p>
                    </div>
                    <span className="text-xs linear-text">${coin.current_price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Coin */}
            {selectedCoin && (
              <div className="linear-bg rounded-md p-3 mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img src={selectedCoin.image} alt={selectedCoin.name} className="w-6 h-6 rounded-full" />
                  <span className="text-xs font-medium">{selectedCoin.name}</span>
                </div>
                <button
                  onClick={() => setSelectedCoin(null)}
                  className="text-xs linear-text hover:text-gray-200"
                >
                  Change
                </button>
              </div>
            )}

            {/* Alert Type */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => setAlertType('above')}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-md text-xs font-medium transition-colors ${
                  alertType === 'above'
                    ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                    : 'linear-card linear-text'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Above</span>
              </button>
              <button
                onClick={() => setAlertType('below')}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-md text-xs font-medium transition-colors ${
                  alertType === 'below'
                    ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                    : 'linear-card linear-text'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Below</span>
              </button>
            </div>

            {/* Target Price */}
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Target price (USD)"
              step="0.01"
              className="w-full px-3 py-2 linear-card rounded-md text-xs mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {/* Submit */}
            <button
              onClick={handleAddAlert}
              disabled={!selectedCoin || !targetPrice}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-md text-xs font-medium transition-colors"
            >
              Create Alert
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="space-y-2">
        {alerts.length === 0 ? (
          <div className="linear-card rounded-lg p-12 text-center">
            <Bell className="w-8 h-8 mx-auto mb-2 linear-text" />
            <p className="text-xs linear-text">No alerts created yet</p>
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
    </div>
  )
}

function AlertCard({ alert, index, onRemove, currentPrice }) {
  const isTriggered = currentPrice && (
    (alert.type === 'above' && currentPrice >= alert.targetPrice) ||
    (alert.type === 'below' && currentPrice <= alert.targetPrice)
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.03 }}
      className={`linear-card rounded-lg p-3 ${isTriggered ? 'ring-1 ring-green-500' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <img src={alert.coinImage} alt={alert.coinName} className="w-8 h-8 rounded-full flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{alert.coinName}</p>
            <div className="flex items-center space-x-2 text-xs linear-text">
              <span className={`${alert.type === 'above' ? 'text-green-500' : 'text-red-500'}`}>
                {alert.type === 'above' ? '↑' : '↓'} ${alert.targetPrice.toFixed(2)}
              </span>
              {currentPrice && (
                <>
                  <span>•</span>
                  <span>Now: ${currentPrice.toFixed(2)}</span>
                </>
              )}
              {isTriggered && (
                <>
                  <span>•</span>
                  <span className="text-green-500 font-medium">Triggered</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onRemove(alert.id)}
          className="p-1.5 linear-hover rounded text-red-400 hover:text-red-300 flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default Alerts
