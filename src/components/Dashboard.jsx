import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw, DollarSign } from 'lucide-react'
import CoinCard from './CoinCard'
import { useCryptoData } from '../hooks/useCryptoData'
import { useExchangeRate } from '../hooks/useExchangeRate'

const Dashboard = () => {
  const { coins, loading, error, refetch } = useCryptoData()
  const { inrRate, loading: rateLoading } = useExchangeRate()
  const [currency, setCurrency] = useState('INR')
  const [sortBy, setSortBy] = useState('gainers')

  const boomingCoins = coins
    .filter(coin => coin.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 10)

  const safestCoins = coins
    .filter(coin => coin.market_cap > 10000000000) // >$10B market cap
    .sort((a, b) => {
      const volatilityA = Math.abs(a.price_change_percentage_24h || 0)
      const volatilityB = Math.abs(b.price_change_percentage_24h || 0)
      return volatilityA - volatilityB
    })
    .slice(0, 10)

  const topLosers = coins
    .filter(coin => coin.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 10)

  const displayCoins = sortBy === 'gainers' ? boomingCoins : sortBy === 'safe' ? safestCoins : topLosers

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-96"
      >
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading market data...</p>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-400 p-8"
      >
        Error loading data: {error}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Market Overview</h1>
          <p className="text-gray-400">Real-time crypto market insights</p>
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
            onClick={refetch}
            className="p-2.5 rounded-lg bg-linear-dark-200 hover:bg-linear-hover transition-smooth"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Market Cap"
          value={`${currency === 'INR' ? '₹' : '$'}${((coins.reduce((sum, c) => sum + c.market_cap, 0) / (currency === 'INR' ? 1 : inrRate)) / 1e12).toFixed(2)}T`}
          change="+5.2%"
          positive={true}
        />
        <StatsCard
          title="24h Volume"
          value={`${currency === 'INR' ? '₹' : '$'}${((coins.reduce((sum, c) => sum + c.total_volume, 0) / (currency === 'INR' ? 1 : inrRate)) / 1e9).toFixed(2)}B`}
          change="+12.8%"
          positive={true}
        />
        <StatsCard
          title="BTC Dominance"
          value="47.3%"
          change="-0.5%"
          positive={false}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-linear-border">
        {[
          { id: 'gainers', label: '🚀 Booming Coins', icon: TrendingUp },
          { id: 'safe', label: '🛡️ Safest Coins', icon: DollarSign },
          { id: 'losers', label: '📉 Top Losers', icon: TrendingDown },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setSortBy(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-smooth ${
                sortBy === tab.id
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Coins Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {displayCoins.map((coin, index) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            currency={currency}
            inrRate={inrRate}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  )
}

function StatsCard({ title, value, change, positive }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card-elevated rounded-xl p-6 transition-smooth"
    >
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-2xl font-bold mb-2">{value}</p>
      <div className={`flex items-center space-x-1 text-sm ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{change}</span>
      </div>
    </motion.div>
  )
}

export default Dashboard
