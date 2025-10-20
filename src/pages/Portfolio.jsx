import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Plus, Trash2, Search, X, TrendingUp, TrendingDown } from 'lucide-react'
import { getPortfolio, addToPortfolio, removeFromPortfolio } from '../utils/db'
import { useData } from '../context/DataContext'
import toast from 'react-hot-toast'

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
    if (!selectedCoin || !amount || !buyPrice) {
      toast.error('Please fill all fields')
      return
    }
    
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
    
    toast.success(`Added ${selectedCoin.name} to portfolio`)
  }

  const calculateStats = () => {
    let totalValue = 0
    let totalInvested = 0
    
    portfolio.forEach(item => {
      const coin = coins.find(c => c.id === item.coinId)
      if (coin) {
        const currentValue = item.amount * coin.current_price
        const invested = item.amount * item.buyPrice
        totalValue += currentValue * (currency === 'INR' ? inrRate : 1)
        totalInvested += invested * (currency === 'INR' ? inrRate : 1)
      }
    })
    
    const profit = totalValue - totalInvested
    const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0
    
    return { totalValue, totalInvested, profit, profitPercentage }
  }

  const { totalValue, totalInvested, profit, profitPercentage } = calculateStats()

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 py-6 max-w-5xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Portfolio</h1>
          <p className="text-xs text-secondary">Track your crypto investments</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center linear-card rounded-lg p-0.5">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currency === 'INR' ? 'bg-accent-blue text-white' : 'text-secondary'
              }`}
            >
              INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currency === 'USD' ? 'bg-accent-blue text-white' : 'text-secondary'
              }`}
            >
              USD
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 linear-button-primary"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div whileHover={{ y: -2 }} className="linear-card p-4">
          <p className="text-xs text-secondary mb-1">Total Value</p>
          <p className="text-xl font-semibold">{currency === 'INR' ? '₹' : '$'}{totalValue.toFixed(2)}</p>
        </motion.div>
        <motion.div whileHover={{ y: -2 }} className="linear-card p-4">
          <p className="text-xs text-secondary mb-1">Profit/Loss</p>
          <p className={`text-xl font-semibold ${profit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {profit >= 0 ? '+' : ''}{currency === 'INR' ? '₹' : '$'}{profit.toFixed(2)}
          </p>
        </motion.div>
        <motion.div whileHover={{ y: -2 }} className="linear-card p-4">
          <p className="text-xs text-secondary mb-1">Return</p>
          <div className="flex items-center space-x-1">
            <p className={`text-xl font-semibold ${profitPercentage >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
            </p>
            {profitPercentage >= 0 ? <TrendingUp className="w-4 h-4 text-accent-green" /> : <TrendingDown className="w-4 h-4 text-accent-red" />}
          </div>
        </motion.div>
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
              <h3 className="text-sm font-semibold">Add Asset</h3>
              <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-white/[0.06] rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

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

            {searchQuery && !selectedCoin && (
              <div className="mb-3 max-h-48 overflow-y-auto space-y-1">
                {filteredCoins.map(coin => (
                  <motion.button
                    key={coin.id}
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      setSelectedCoin(coin)
                      setBuyPrice(coin.current_price.toString())
                      setSearchQuery('')
                    }}
                    className="w-full flex items-center space-x-2.5 p-2 hover:bg-white/[0.06] rounded-md text-left"
                  >
                    <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                    <p className="text-xs font-medium flex-1 truncate">{coin.name}</p>
                    <span className="text-xs text-secondary">${coin.current_price.toFixed(2)}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {selectedCoin && (
              <>
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

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-secondary mb-1.5">Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.00000001"
                      className="linear-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-secondary mb-1.5">Buy Price (USD)</label>
                    <input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      className="linear-input w-full"
                    />
                  </div>
                </div>

                {amount && buyPrice && (
                  <div className="bg-accent-blue/10 rounded-lg p-3 mb-3 border border-accent-blue/20">
                    <p className="text-xs text-secondary mb-1">Total Investment</p>
                    <p className="text-lg font-semibold text-accent-blue">
                      ${(parseFloat(amount) * parseFloat(buyPrice)).toFixed(2)}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleAddToPortfolio}
                  disabled={!amount || !buyPrice}
                  className="linear-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Portfolio
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Holdings */}
      <div className="space-y-2">
        {portfolio.length === 0 ? (
          <div className="linear-card rounded-lg p-16 text-center">
            <Wallet className="w-10 h-10 mx-auto mb-3 text-muted" />
            <p className="text-sm font-medium mb-1">Portfolio is empty</p>
            <p className="text-xs text-secondary">Add your first crypto asset</p>
          </div>
        ) : (
          portfolio.map((item, index) => {
            const coin = coins.find(c => c.id === item.coinId)
            if (!coin) return null
            
            const currentValue = item.amount * coin.current_price
            const invested = item.amount * item.buyPrice
            const itemProfit = currentValue - invested
            const itemProfitPercent = (itemProfit / invested) * 100

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 2 }}
                className="linear-card rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{coin.name}</p>
                      <p className="text-xs text-secondary">{item.amount} {coin.symbol.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="text-right mr-3">
                    <p className="text-sm font-semibold">
                      {currency === 'INR' ? '₹' : '$'}
                      {(currentValue * (currency === 'INR' ? inrRate : 1)).toFixed(2)}
                    </p>
                    <p className={`text-xs ${itemProfit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                      {itemProfit >= 0 ? '+' : ''}{itemProfitPercent.toFixed(2)}%
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={async () => {
                      await removeFromPortfolio(item.id)
                      await loadPortfolio()
                      toast.success('Asset removed')
                    }}
                    className="p-2 hover:bg-accent-red/10 rounded text-accent-red flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}

export default Portfolio
