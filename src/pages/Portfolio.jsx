import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Plus, Trash2, DollarSign, TrendingUp, TrendingDown, PieChart, Search, Edit2 } from 'lucide-react'
import { getPortfolio, addToPortfolio, removeFromPortfolio } from '../utils/db'
import { useData } from '../context/DataContext'

const Portfolio = ({ username }) => {
  const { coins, inrRate } = useData()
  const [portfolio, setPortfolio] = useState([])
  const [currency, setCurrency] = useState('INR')
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [amount, setAmount] = useState('')
  const [buyPrice, setBuyPrice] = useState('')

  useEffect(() => {
    loadPortfolio()
  }, [username])

  const loadPortfolio = async () => {
    const items = await getPortfolio(username)
    setPortfolio(items)
  }

  const handleAddToPortfolio = async () => {
    if (!selectedCoin || !amount || !buyPrice) return
    
    await addToPortfolio(
      username,
      selectedCoin.id,
      selectedCoin.name,
      selectedCoin.symbol,
      selectedCoin.image,
      parseFloat(amount),
      parseFloat(buyPrice)
    )
    
    await loadPortfolio()
    setShowAddForm(false)
    setSelectedCoin(null)
    setAmount('')
    setBuyPrice('')
    setSearchQuery('')
  }

  const calculateTotal = () => {
    return portfolio.reduce((sum, item) => {
      const coin = coins.find(c => c.id === item.coinId)
      if (!coin) return sum
      const value = item.amount * coin.current_price
      return sum + (currency === 'INR' ? value * inrRate : value)
    }, 0)
  }

  const calculateInvested = () => {
    return portfolio.reduce((sum, item) => {
      const invested = item.amount * item.buyPrice
      return sum + (currency === 'INR' ? invested * inrRate : invested)
    }, 0)
  }

  const calculateProfit = () => {
    return portfolio.reduce((sum, item) => {
      const coin = coins.find(c => c.id === item.coinId)
      if (!coin) return sum
      const currentValue = item.amount * coin.current_price
      const invested = item.amount * item.buyPrice
      return sum + ((currentValue - invested) * (currency === 'INR' ? inrRate : 1))
    }, 0)
  }

  const totalValue = calculateTotal()
  const totalInvested = calculateInvested()
  const totalProfit = calculateProfit()
  const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0

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
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">My Portfolio</h1>
          </div>
          <p className="text-gray-400">Track and manage your crypto investments</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex rounded-xl bg-white/5 p-1.5 border border-accent-blue/20">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold smooth-transition ${
                currency === 'INR' 
                  ? 'bg-gradient-brand text-white shadow-lg' 
                  : 'text-gray-400'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold smooth-transition ${
                currency === 'USD' 
                  ? 'bg-gradient-brand text-white shadow-lg' 
                  : 'text-gray-400'
              }`}
            >
              $ USD
            </button>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-brand rounded-xl font-semibold shadow-lg hover:shadow-glow-blue smooth-transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Value"
          value={`${currency === 'INR' ? '₹' : '$'}${totalValue.toFixed(2)}`}
          icon={DollarSign}
          color="blue"
        />
        <StatsCard
          title="Total Invested"
          value={`${currency === 'INR' ? '₹' : '$'}${totalInvested.toFixed(2)}`}
          icon={Wallet}
          color="purple"
        />
        <StatsCard
          title="Total Profit/Loss"
          value={`${totalProfit >= 0 ? '+' : ''}${currency === 'INR' ? '₹' : '$'}${totalProfit.toFixed(2)}`}
          icon={totalProfit >= 0 ? TrendingUp : TrendingDown}
          color={totalProfit >= 0 ? 'green' : 'red'}
          positive={totalProfit >= 0}
        />
        <StatsCard
          title="Return %"
          value={`${profitPercentage >= 0 ? '+' : ''}${profitPercentage.toFixed(2)}%`}
          icon={PieChart}
          color={profitPercentage >= 0 ? 'green' : 'red'}
          positive={profitPercentage >= 0}
        />
      </div>

      {/* Add Asset Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card-modern rounded-2xl p-6 lg:p-8 space-y-6"
          >
            <h3 className="text-2xl font-bold gradient-text">Add Asset to Portfolio</h3>
            
            {/* Search Coin */}
            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cryptocurrency..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border-2 border-accent-blue/20 focus:border-accent-blue outline-none smooth-transition"
              />
            </div>

            {/* Coin Selection */}
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
                      setBuyPrice(coin.current_price.toString())
                      setSearchQuery('')
                    }}
                    className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-white/10 smooth-transition text-left"
                  >
                    <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <p className="font-bold">{coin.name}</p>
                      <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
                    </div>
                    <p className="font-bold">${coin.current_price.toFixed(2)}</p>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Selected Coin */}
            {selectedCoin && !searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-4 p-5 rounded-xl bg-gradient-brand/10 border-2 border-accent-blue/30"
              >
                <img src={selectedCoin.image} alt={selectedCoin.name} className="w-14 h-14 rounded-full" />
                <div className="flex-1">
                  <p className="font-bold text-lg">{selectedCoin.name}</p>
                  <p className="text-sm text-gray-400">Current: ${selectedCoin.current_price.toFixed(2)}</p>
                </div>
              </motion.div>
            )}

            {/* Amount & Price Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3">Amount/Quantity</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.00000001"
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border-2 border-accent-blue/20 focus:border-accent-blue outline-none smooth-transition text-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3">Buy Price (USD)</label>
                <input
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border-2 border-accent-blue/20 focus:border-accent-blue outline-none smooth-transition text-lg font-bold"
                />
              </div>
            </div>

            {/* Total Investment Preview */}
            {amount && buyPrice && (
              <div className="p-5 rounded-xl bg-accent-blue/10 border-2 border-accent-blue/30">
                <p className="text-sm text-gray-400 mb-1">Total Investment</p>
                <p className="text-2xl font-bold">${(parseFloat(amount) * parseFloat(buyPrice)).toFixed(2)}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToPortfolio}
                disabled={!selectedCoin || !amount || !buyPrice}
                className="flex-1 btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Portfolio
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setSelectedCoin(null)
                  setAmount('')
                  setBuyPrice('')
                  setSearchQuery('')
                }}
                className="px-6 py-4 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold smooth-transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Holdings */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Holdings ({portfolio.length})</h2>
        
        {portfolio.length === 0 ? (
          <div className="card-modern rounded-2xl p-16 text-center">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold mb-2">Portfolio is Empty</h3>
            <p className="text-gray-400 mb-6">Start tracking your crypto investments</p>
            <button onClick={() => setShowAddForm(true)} className="btn-primary">
              Add Your First Asset
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {portfolio.map((item, index) => {
              const coin = coins.find(c => c.id === item.coinId)
              if (!coin) return null
              
              const currentValue = item.amount * coin.current_price
              const invested = item.amount * item.buyPrice
              const profit = currentValue - invested
              const profitPercent = (profit / invested) * 100

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-modern rounded-2xl p-6 group hover:shadow-glow-blue"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center space-x-5 flex-1">
                      <img 
                        src={coin.image} 
                        alt={coin.name} 
                        className="w-16 h-16 rounded-full ring-2 ring-accent-blue/30 group-hover:ring-accent-blue/60 smooth-transition" 
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-1">{coin.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {item.amount} {coin.symbol.toUpperCase()}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs px-2 py-1 rounded bg-white/5">
                            Avg Buy: ${item.buyPrice.toFixed(2)}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-white/5">
                            Current: ${coin.current_price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-8">
                      <div className="text-right">
                        <p className="text-sm text-gray-400 mb-1">Value</p>
                        <p className="text-2xl font-bold">
                          {currency === 'INR' ? '₹' : '$'}
                          {(currentValue * (currency === 'INR' ? inrRate : 1)).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-400 mb-1">P/L</p>
                        <p className={`text-xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profit >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                        </p>
                        <p className={`text-sm ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profit >= 0 ? '+' : ''}{currency === 'INR' ? '₹' : '$'}
                          {(profit * (currency === 'INR' ? inrRate : 1)).toFixed(2)}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={async () => {
                          await removeFromPortfolio(item.id)
                          await loadPortfolio()
                        }}
                        className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 smooth-transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function StatsCard({ title, value, icon: Icon, color, positive = true }) {
  const colorClasses = {
    blue: 'from-accent-blue to-accent-blue/50',
    purple: 'from-accent-purple to-accent-purple/50',
    green: 'from-green-500 to-emerald-500',
    red: 'from-red-500 to-rose-500',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      className="card-modern rounded-2xl p-6 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full -mr-16 -mt-16`} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">{title}</p>
          <div className={`p-2 rounded-lg bg-${color === 'green' || color === 'red' ? color : `accent-${color}`}/20`}>
            <Icon className={`w-5 h-5 text-${color === 'green' || color === 'red' ? color : `accent-${color}`}-${color === 'green' ? '500' : color === 'red' ? '500' : ''}`} />
          </div>
        </div>
        
        <p className={`text-2xl lg:text-3xl font-bold ${
          color === 'green' ? 'text-green-400' : 
          color === 'red' ? 'text-red-400' : ''
        }`}>
          {value}
        </p>
      </div>
    </motion.div>
  )
}

export default Portfolio
