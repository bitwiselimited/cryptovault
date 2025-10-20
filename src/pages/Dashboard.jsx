import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw, Activity, DollarSign, BarChart3 } from 'lucide-react'
import CoinCard from '../components/CoinCard'
import { GridSkeleton } from '../components/LoadingSkeleton'
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
    } else if (filter === 'marketcap') {
      filtered = filtered.sort((a, b) => b.market_cap - a.market_cap)
    }
    
    return filtered.slice(0, 50)
  }

  const displayCoins = getFilteredCoins()
  const totalMarketCap = coins.reduce((sum, c) => sum + c.market_cap, 0)
  const total24hVolume = coins.reduce((sum, c) => sum + c.total_volume, 0)
  const avgChange = coins.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / coins.length

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-6 max-w-[1400px]">
        <div className="mb-6">
          <div className="h-8 skeleton rounded w-48 mb-2" />
          <div className="h-4 skeleton rounded w-64" />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="linear-card p-4">
              <div className="h-3 skeleton rounded w-24 mb-2" />
              <div className="h-6 skeleton rounded w-32" />
            </div>
          ))}
        </div>
        <GridSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-6 max-w-[1400px]">
        <div className="linear-card rounded-lg p-12 text-center">
          <p className="text-sm text-accent-red mb-3">Error: {error}</p>
          <button onClick={refetch} className="linear-button-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 py-6 max-w-[1400px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Markets</h1>
          <p className="text-xs text-secondary flex items-center space-x-1.5">
            <Activity className="w-3 h-3" />
            <span>Live cryptocurrency prices</span>
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
            onClick={refetch}
            className="p-2 rounded-md linear-button-ghost"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={DollarSign}
          label="Market Cap"
          value={`${currency === 'INR' ? '₹' : '$'}${((totalMarketCap / (currency === 'INR' ? 1 : inrRate)) / 1e12).toFixed(2)}T`}
          change={avgChange >= 0 ? `+${avgChange.toFixed(1)}%` : `${avgChange.toFixed(1)}%`}
          positive={avgChange >= 0}
        />
        <StatCard
          icon={BarChart3}
          label="24h Volume"
          value={`${currency === 'INR' ? '₹' : '$'}${((total24hVolume / (currency === 'INR' ? 1 : inrRate)) / 1e9).toFixed(2)}B`}
          change="+12.3%"
          positive={true}
        />
        <StatCard
          icon={Activity}
          label="Cryptocurrencies"
          value={coins.length.toString()}
          change="Live"
          positive={true}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-4">
        {[
          { id: 'all', label: 'All' },
          { id: 'gainers', label: 'Top Gainers' },
          { id: 'losers', label: 'Top Losers' },
          { id: 'volume', label: 'Volume' },
          { id: 'marketcap', label: 'Market Cap' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filter === f.id 
                ? 'linear-card text-primary' 
                : 'text-secondary hover:text-primary hover:bg-white/[0.03]'
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
    </motion.div>
  )
}

function StatCard({ icon: Icon, label, value, change, positive }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="linear-card p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-secondary font-medium uppercase tracking-wide">{label}</span>
        <Icon className="w-4 h-4 text-accent-blue" />
      </div>
      <p className="text-xl font-semibold mb-1">{value}</p>
      <div className={`flex items-center space-x-1 text-xs ${positive ? 'text-accent-green' : 'text-accent-red'}`}>
        {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span>{change}</span>
      </div>
    </motion.div>
  )
}

export default Dashboard
