import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Search, X } from 'lucide-react'
import { getAlerts, addAlert, removeAlert } from '../utils/db'
import { useData } from '../context/DataContext'
import { checkPriceAlerts } from '../utils/notifications'
import toast from 'react-hot-toast'

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
    
    toast.success('Price alert created')
  }

  const handleRemoveAlert = async (alertId) => {
    await removeAlert(alertId)
    await loadAlerts()
    toast.success('Alert removed')
  }

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 py-6 max-w-4xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Price Alerts</h1>
          <p className="text-xs text-secondary">Get notified when prices hit your targets</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 linear-button-primary"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Alert</span>
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="linear-card rounded-lg p-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Create Alert</h3>
              <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-white/[0.06] rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            {!selectedCoin && (
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search coin..."
                  className="linear-input w-full pl-9"
                  autoFocus
                />
              </div>
            )}

            {/* Coin List */}
            {searchQuery && !selectedCoin && (
              <div className="mb-3 max-h-48 overflow-y-auto space-y-1">
                {filteredCoins.map(coin => (
                  <motion.button
                    key={coin.id}
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      setSelectedCoin(coin)
                      setTargetPrice(coin.current_price.toString())
                      setSearchQuery('')
                    }}
                    className="w-full flex items-center space-x-2.5 p-2 hover:bg-white/[0.06] rounded-md text-left"
                  >
                    <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{coin.name}</p>
                      <p className="text-[10px] text-muted">{coin.symbol.toUpperCase()}</p>
                    </div>
                    <span className="text-xs text-secondary">${coin.current_price.toFixed(2)}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Selected Coin */}
            {selectedCoin && (
              <div className="bg-white/[0.03] rounded-lg p-3 mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img src={selectedCoin.image} alt={selectedCoin.name} className="w-7 h-7 rounded-full" />
                  <div>
                    <p className="text-xs font-medium">{selectedCoin.name}</p>
                    <p className="text-[10px] text-muted">Current: ${selectedCoin.current_price.toFixed(2)}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCoin(null)} className="text-xs text-secondary hover:text-primary">
                  Change
                </button>
              </div>
            )}

            {/* Alert Type */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => setAlertType('above')}
                className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  alertType === 'above'
                    ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                    : 'linear-card text-secondary'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Price Above</span>
              </button>
              <button
                onClick={() => setAlertType('below')}
                className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  alertType === 'below'
                    ? 'bg-accent-red/10 text-accent-red border border-accent-red/20'
                    : 'linear-card text-secondary'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Price Below</span>
              </button>
            </div>

            {/* Target Price */}
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Target price (USD)"
              step="0.01"
              className="linear-input w-full mb-3"
            />

            {/* Submit */}
            <button
              onClick={handleAddAlert}
              disabled={!selectedCoin || !targetPrice}
              className="linear-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Alert
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="space-y-2">
        {alerts.length === 0 ? (
          <div className="linear-card rounded-lg p-16 text-center">
            <Bell className="w-10 h-10 mx-auto mb-3 text-muted" />
            <p className="text-sm font-medium mb-1">No alerts yet</p>
            <p className="text-xs text-secondary">Create your first price alert</p>
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
      className={`linear-card rounded-lg p-3 ${isTriggered ? 'ring-1 ring-accent-green' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <img src={alert.coinImage} alt={alert.coinName} className="w-9 h-9 rounded-full flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{alert.coinName}</p>
            <div className="flex items-center space-x-2 text-xs text-secondary mt-0.5">
              <span className={`${alert.type === 'above' ? 'text-accent-green' : 'text-accent-red'}`}>
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
                  <motion.span 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-accent-green font-medium"
                  >
                    Triggered!
                  </motion.span>
                </>
              )}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(alert.id)}
          className="p-2 hover:bg-accent-red/10 rounded text-accent-red flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Alerts
