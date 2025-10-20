import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, Activity, BarChart3 } from 'lucide-react'
import CoinCard from '../components/CoinCard'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'

const Dashboard = () => {
  const { coins, inrRate, loading, error, refetch, lastUpdate } = useData()
  const { theme } = useTheme()
  const [currency, setCurrency] = useState('INR')
  const [sortBy, setSortBy] = useState('gainers')

  const boomingCoins = coins
    .filter(coin => coin.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 12)

  const safestCoins = coins
    .filter(coin => coin.market_cap > 10000000000)
    .sort((a, b) => {
      const volatilityA = Math.abs(a.price_change_percentage_24h || 0)
      const volatilityB = Math.abs(b.price_change_percentage_24h || 0)
      return volatilityA - volatilityB
    })
    .slice(0, 12)

  const topLosers = coins
    .filter(coin => coin.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 12)

  const displayCoins = sortBy === 'gainers' ? boomingCoins : sortBy === 'safe' ? safestCoins : topLosers

  const totalMarketCap = coins.reduce((sum, c) => sum + c.market_cap, 0)
  const total24hVolume = coins.reduce((sum, c) => sum + c.total_volume, 0)
  const avgChange = coins.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / coins.length

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-96"
      >
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-4 border-accent-blue border-t-transparent rounded-full"
            />
          </div>
          <p className="text-xl font-semibold mb-2">Loading Market Data...</p>
          <p className="text-sm text-gray-400">Fetching latest crypto prices</p>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-12 card-modern rounded-2xl"
      >
        <div className="text-red-400 text-lg">Error: {error}</div>
        <button onClick={refetch} className="mt-4 btn-primary">
          Try Again
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">Market Overview</h1>
          <p className="text-gray-400 flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Live cryptocurrency market data</span>
            {lastUpdate && (
              <span className="text-xs">• Updated {new Date(lastUpdate).toLocaleTimeString()}</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex rounded-xl bg-white/5 p-1.5 border border-accent-blue/20">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold smooth-transition ${
                currency === 'INR' 
                  ? 'bg-gradient-brand text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold smooth-transition ${
                currency === 'USD' 
                  ? 'bg-gradient-brand text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>
          
          <button
            onClick={refetch}
            className="p-3 rounded-xl bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue smooth-transition group"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 smooth-transition" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Market Cap"
          value={`${currency === 'INR' ? '₹' : '$'}${((totalMarketCap / (currency === 'INR' ? 1 : inrRate)) / 1e12).toFixed(2)}T`}
          change={avgChange >= 0 ? `+${avgChange.toFixed(1)}%` : `${avgChange.toFixed(1)}%`}
          positive={avgChange >= 0}
          icon={DollarSign}
          color="blue"
        />
        <StatsCard
          title="24h Trading Volume"
          value={`${currency === 'INR' ? '₹' : '$'}${((total24hVolume / (currency === 'INR' ? 1 : inrRate)) / 1e9).toFixed(2)}B`}
          change="+12.8%"
          positive={true}
          icon={BarChart3}
          color="purple"
        />
        <StatsCard
          title="Active Cryptocurrencies"
          value={coins.length.toString()}
          change="Real-time"
          positive={true}
          icon={Activity}
          color="cyan"
        />
      </div>

      {/* Filter Tabs */}
      <div className="card-modern rounded-2xl p-2">
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'gainers', label: '🚀 Top Gainers', icon: TrendingUp, color: 'green' },
            { id: 'safe', label: '🛡️ Most Stable', icon: DollarSign, color: 'blue' },
            { id: 'losers', label: '📉 Top Losers', icon: TrendingDown, color: 'red' },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id)}
                className={`flex items-center justify-center space-x-2 px-4 py-4 rounded-xl smooth-transition ${
                  sortBy === tab.id
                    ? 'bg-gradient-brand text-white shadow-lg'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold hidden sm:inline">{tab.label}</span>
                <span className="font-semibold sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Coins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

function StatsCard({ title, value, change, positive, icon: Icon, color }) {
  const colorClasses = {
    blue: 'from-accent-blue to-accent-blue/50',
    purple: 'from-accent-purple to-accent-purple/50',
    cyan: 'from-accent-cyan to-accent-cyan/50',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="card-modern rounded-2xl p-6 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full -mr-16 -mt-16`} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">{title}</p>
          <div className={`p-2 rounded-lg bg-accent-${color}/20`}>
            <Icon className={`w-5 h-5 text-accent-${color}`} />
          </div>
        </div>
        
        <p className="text-3xl font-bold mb-3">{value}</p>
        
        <div className={`flex items-center space-x-2 text-sm font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{change}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard
