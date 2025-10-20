import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, Star, ArrowUpRight } from 'lucide-react'
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../utils/db'
import toast from 'react-hot-toast'

const CoinCard = ({ coin, currency, inrRate, index }) => {
  const navigate = useNavigate()
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const price = currency === 'INR' 
    ? (coin.current_price * inrRate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    
  const marketCap = currency === 'INR'
    ? `₹${((coin.market_cap * inrRate) / 1e9).toFixed(1)}B`
    : `$${(coin.market_cap / 1e9).toFixed(1)}B`

  const isPositive = coin.price_change_percentage_24h > 0
  const changeColor = isPositive ? 'text-accent-green' : 'text-accent-red'

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
      toast.success(`Removed ${coin.name} from favorites`)
    } else {
      await addToWatchlist(coin)
      toast.success(`Added ${coin.name} to favorites`)
    }
    setIsWatchlisted(!isWatchlisted)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      onClick={() => navigate(`/coin/${coin.id}`)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="linear-card p-3 cursor-pointer group relative overflow-hidden"
    >
      {/* Hover gradient effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.05 : 0,
        }}
        className="absolute inset-0 bg-gradient-to-br from-accent-blue to-accent-purple pointer-events-none"
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
            <div className="relative">
              <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full flex-shrink-0" />
              <motion.div
                animate={{ scale: isHovered ? 1.2 : 1 }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 blur-md -z-10"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-semibold truncate">{coin.name}</h3>
                <motion.div
                  animate={{ x: isHovered ? 2 : 0, opacity: isHovered ? 1 : 0 }}
                  className="flex-shrink-0"
                >
                  <ArrowUpRight className="w-3 h-3 text-accent-blue" />
                </motion.div>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-xs text-muted uppercase font-medium">{coin.symbol}</span>
                <span className="text-xs text-muted">•</span>
                <span className="text-xs text-muted">#{coin.market_cap_rank}</span>
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleWatchlist}
            className="p-1.5 rounded-md hover:bg-white/[0.06] transition-colors flex-shrink-0"
          >
            <Star className={`w-4 h-4 transition-colors ${isWatchlisted ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
          </motion.button>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-semibold mb-0.5">
              {currency === 'INR' ? '₹' : '$'}{price}
            </p>
            <p className="text-xs text-muted">{marketCap}</p>
          </div>
          
          <motion.div 
            animate={{ scale: isHovered ? 1.05 : 1 }}
            className={`flex items-center space-x-1 text-xs font-medium ${changeColor} px-2 py-1 rounded-md bg-white/[0.03]`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default CoinCard
