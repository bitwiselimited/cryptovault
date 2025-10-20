import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Plus, Trash2, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { getPortfolio, addToPortfolio, removeFromPortfolio } from '../utils/db'
import { useCryptoData } from '../hooks/useCryptoData'
import { useExchangeRate } from '../hooks/useExchangeRate'

const Portfolio = ({ username }) => {
  const { coins } = useCryptoData()
  const { inrRate } = useExchangeRate()
  const [portfolio, setPortfolio] = useState([])
  const [currency, setCurrency] = useState('INR')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadPortfolio()
  }, [username])

  const loadPortfolio = async () => {
    const items = await getPortfolio(username)
    setPortfolio(items)
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
  const profitPercentage = portfolio.length > 0 
    ? (totalProfit / (totalValue - totalProfit)) * 100 
    : 0

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
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Portfolio</h1>
          </div>
          <p className="text-gray-400">Track your crypto investments</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg bg-linear-dark-200 p-1">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                currency === 'INR' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                currency === 'USD' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg transition-smooth"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Add Asset</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-elevated rounded-xl p-6">
          <div className="flex items-center space-x-2 text-gray-400 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Total Value</span>
          </div>
          <p className="text-3xl font-bold">
            {currency === 'INR' ? '₹' : '$'}{totalValue.toFixed(2)}
          </p>
        </div>

        <div className="card-elevated rounded-xl p-6">
          <div className="flex items-center space-x-2 text-gray-400 mb-2">
            {totalProfit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm">Total P/L</span>
          </div>
          <p className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalProfit >= 0 ? '+' : ''}{currency === 'INR' ? '₹' : '$'}{totalProfit.toFixed(2)}
          </p>
        </div>

        <div className="card-elevated rounded-xl p-6">
          <div className="flex items-center space-x-2 text-gray-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Return %</span>
          </div>
          <p className={`text-3xl font-bold ${profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Portfolio Items */}
      <div className="space-y-3">
        {portfolio.length === 0 ? (
          <div className="card-elevated rounded-xl p-12 text-center">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">Your portfolio is empty</p>
            <p className="text-sm text-gray-500 mt-2">Add your first asset to get started</p>
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-elevated rounded-xl p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full" />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{coin.name}</h3>
                      <p className="text-sm text-gray-400">
                        {item.amount} {coin.symbol.toUpperCase()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {currency === 'INR' ? '₹' : '$'}
                        {(currentValue * (currency === 'INR' ? inrRate : 1)).toFixed(2)}
                      </p>
                      <p className={`text-sm ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {profit >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      await removeFromPortfolio(item.id)
                      await loadPortfolio()
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-smooth ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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
