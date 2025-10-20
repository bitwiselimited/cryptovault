import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw, Activity } from 'lucide-react'
import CoinCard from '../components/CoinCard'
import { useData } from '../context/DataContext'

const Dashboard = () => {
  const { coins, inrRate, loading, error, refetch, lastUpdate } = useData()
  const [currency, setCurrency] = useState('INR')
  const [filter, setFilter] = useState('all')

  const getFilteredCoins = () => {
    let filtered = [...coins]
    
    if (filter === 'gainers') {
      filtered = filtered.filter(c => c.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    } else if (filter === 'losers') {
      filtered = filtered.filter(c => c.price_change_percentage_24h < 0)
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    } else if (filter === 'volume') {
      filtered = filtered.sort((a, b) => b.total_volume - a.total_volume)
    }
    
    return filtered.slice(0, 50)
  }

  const displayCoins = getFilteredCoins()
  const totalMarketCap = coins.reduce((sum, c) => sum + c.market_cap, 0)
  const avgChange = coins.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / coins.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm linear-text">Loading markets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="linear-card rounded-lg p-6 text-center">
          <p className="text-sm text-red-400 mb-3">Error: {error}</p>
          <button onClick={refetch} className="text-sm text-blue-500 hover:text-blue-400">
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Markets</h1>
          <p className="text-xs linear-text flex items-center space-x-1.5">
            <Activity className="w-3 h-3" />
            <span>Live data</span>
            {lastUpdate && (
              <>
                <span>•</span>
                <span>{new Date(lastUpdate).toLocaleTimeString()}</span>
              </>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center linear-card rounded-lg p-0.5">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currency === 'INR' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currency === 'USD' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              USD
            </button>
          </div>
          
          <button
            onClick={refetch}
            className="p-2 rounded-md linear-hover text-gray-400 hover:text-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="linear-card rounded-lg p-4">
          <p className="text-xs linear-text mb-1">Market Cap</p>
          <p className="text-xl font-semibold">
            {currency === 'INR' ? '₹' : '$'}
            {((totalMarketCap / (currency === 'INR' ? 1 : inrRate)) / 1e12).toFixed(2)}T
          </p>
        </div>
        <div className="linear-card rounded-lg p-4">
          <p className="text-xs linear-text mb-1">Avg 24h Change</p>
          <p className={`text-xl font-semibold ${avgChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
          </p>
        </div>
        <div className="linear-card rounded-lg p-4">
          <p className="text-xs linear-text mb-1">Cryptocurrencies</p>
          <p className="text-xl font-semibold">{coins.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-4">
        {[
          { id: 'all', label: 'All' },
          { id: 'gainers', label: 'Gainers' },
          { id: 'losers', label: 'Losers' },
          { id: 'volume', label: 'Volume' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filter === f.id 
                ? 'linear-card' 
                : 'text-gray-400 hover:text-gray-200 linear-hover'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Coins Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
    </div>
  )
}

export default Dashboard
