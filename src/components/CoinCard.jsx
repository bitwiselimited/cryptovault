import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Star, ExternalLink, BarChart2 } from 'lucide-react'
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../utils/db'

const CoinCard = ({ coin, currency, inrRate, index }) => {
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const price = currency === 'INR' 
    ? (coin.current_price * inrRate).toFixed(2)
    : coin.current_price.toFixed(2)
    
  const marketCap = currency === 'INR'
    ? ((coin.market_cap * inrRate) / 1e9).toFixed(2)
    : (coin.market_cap / 1e9).toFixed(2)
    
  const volume = currency === 'INR'
    ? ((coin.total_volume * inrRate) / 1e9).toFixed(2)
    : (coin.total_volume / 1e9).toFixed(2)

  const isPositive = coin.price_change_percentage_24h > 0

  useEffect(() => {
    checkWatchlist()
  }, [coin.id])

  const checkWatchlist = async () => {
    const inList = await isInWatchlist(coin.id)
    setIsWatchlisted(inList)
  }

  const toggleWatchlist = async (e) => {
    e.stopPropagation()
    if (isWatchlisted) {
      await removeFromWatchlist(coin.id)
    } else {
      await addToWatchlist(coin)
    }
    setIsWatchlisted(!isWatchlisted)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="card-modern rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
    >
      {/* Animated Background Gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${
          isPositive 
            ? 'from-green-500/10 to-emerald-500/5' 
            : 'from-red-500/10 to-rose-500/5'
        } opacity-0 group-hover:opacity-100 smooth-transition`}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={coin.image} 
                alt={coin.name} 
                className="w-12 h-12 rounded-full ring-2 ring-accent-blue/20 group-hover:ring-accent-blue/50 smooth-transition" 
              />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                isPositive ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {isPositive ? '↑' : '↓'}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg">{coin.name}</h3>
              <p className="text-sm text-gray-400 uppercase font-semibold">{coin.symbol}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleWatchlist}
              className={`p-2 rounded-lg smooth-transition ${
                isWatchlisted 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Star
                className={`w-5 h-5 ${isWatchlisted ? 'fill-yellow-400' : ''}`}
              />
            </motion.button>
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-bold">
              {currency === 'INR' ? '₹' : '$'}{price}
            </span>
            <motion.div 
              animate={{ scale: isHovered ? 1.05 : 1 }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold ${
                isPositive 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
            </motion.div>
          </div>
          
          <div className="text-xs text-gray-400">
            Rank #{coin.market_cap_rank}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 dark:border-white/5 light:border-gray-200">
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <BarChart2 className="w-3 h-3 text-accent-blue" />
              <p className="text-xs text-gray-400 font-semibold">Market Cap</p>
            </div>
            <p className="text-sm font-bold">
              {currency === 'INR' ? '₹' : '$'}{marketCap}B
            </p>
          </div>
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <TrendingUp className="w-3 h-3 text-accent-purple" />
              <p className="text-xs text-gray-400 font-semibold">24h Volume</p>
            </div>
            <p className="text-sm font-bold">
              {currency === 'INR' ? '₹' : '$'}{volume}B
            </p>
          </div>
        </div>

        {/* Hover Action */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-white/5"
          >
            <button className="w-full flex items-center justify-center space-x-2 py-2 bg-gradient-brand rounded-lg text-white font-semibold text-sm">
              <span>View Details</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default CoinCard
