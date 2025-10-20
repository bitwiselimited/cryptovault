import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Plus, Trash2, Search, X } from 'lucide-react'
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
  const totalProfit = calculateProfit()
  const profitPercentage = (totalValue - totalProfit) > 0 ? (totalProfit / (totalValue - totalProfit)) * 100 : 0

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8)

  return (
    <div className="container mx-auto px-6 py-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Portfolio</h1>
          <p className="text-xs linear-text">Track your crypto investments</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center linear-card rounded-lg p-0.5">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currency === 'INR' ? 'bg-blue-600 text-white' : 'text-gray-400'
              }`}
            >
              INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currency === 'USD' ? 'bg-blue-600 text-white' : 'text-gray-400'
              }`}
            >
              USD
            </button>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="linear-card rounded-lg p-4">
          <p className="text-xs linear-text mb-1">Total Value</p>
          <p className="text-xl font-semibold">{currency === 'INR' ? '₹' : '$'}{totalValue.toFixed(2)}</p>
        </div>
        <div className="linear-card rounded-lg p-4">
          <p className="text-xs linear-text mb-1">Profit/Loss</p>
          <p className={`text-xl font-semibold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalProfit >= 0 ? '+' : ''}{currency === 'INR' ? '₹' : '$'}{totalProfit.toFixed(2)}
          </p>
        </div>
        <div className="linear-card rounded-lg p-4">
          <p className="text-xs linear-text mb-1">Return</p>
          <p className={`text-xl font-semibold ${profitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
          </p>
        </div>
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
              <h3 className="text-sm font-semibold">Add Asset</h3>
              <button onClick={() => setShowAddForm(false)} className="p-1 linear-hover rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

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
                    <p className="text-xs font-medium flex-1 truncate">{coin.name}</p>
                    <span className="text-xs linear-text">${coin.current_price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}

            {selectedCoin && (
              <>
                <div className="linear-bg rounded-md p-3 mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={selectedCoin.image} alt={selectedCoin.name} className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-medium">{selectedCoin.name}</span>
                  </div>
                  <button onClick={() => setSelectedCoin(null)} className="text-xs linear-text hover:text-gray-200">
                    Change
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs linear-text mb-1">Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.00000001"
                      className="w-full px-3 py-2 linear-card rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs linear-text mb-1">Buy Price (USD)</label>
                    <input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-3 py-2 linear-card rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddToPortfolio}
                  disabled={!amount || !buyPrice}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-md text-xs font-medium transition-colors"
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
          <div className="linear-card rounded-lg p-12 text-center">
            <Wallet className="w-8 h-8 mx-auto mb-2 linear-text" />
            <p className="text-xs linear-text">No assets in portfolio</p>
          </div>
        ) : (
          portfolio.map((item, index) => {
            const coin = coins.find(c => c.id === item.coinId)
            if (!coin) return null
            
            const currentValue = item.amount * coin.current_price
            const invested = item.amount * item.buyPrice
            const profit = currentValue - invested
            const profitPercent = (profit / invested) * 100

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="linear-card rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{coin.name}</p>
                      <p className="text-xs linear-text">{item.amount} {coin.symbol.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="text-right mr-3">
                    <p className="text-sm font-semibold">
                      {currency === 'INR' ? '₹' : '$'}
                      {(currentValue * (currency === 'INR' ? inrRate : 1)).toFixed(2)}
                    </p>
                    <p className={`text-xs ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {profit >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      await removeFromPortfolio(item.id)
                      await loadPortfolio()
                    }}
                    className="p-1.5 linear-hover rounded text-red-400 hover:text-red-300 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Portfolio
