import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, Star } from 'lucide-react'
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../utils/db'

const CoinCard = ({ coin, currency, inrRate, index }) => {
  const navigate = useNavigate()
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  
  const price = currency === 'INR' 
    ? (coin.current_price * inrRate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    
  const marketCap = currency === 'INR'
    ? `₹${((coin.market_cap * inrRate) / 1e9).toFixed(1)}B`
    : `$${(coin.market_cap / 1e9).toFixed(1)}B`

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02 }}
      onClick={() => navigate(`/coin/${coin.id}`)}
      className="linear-card rounded-lg p-3 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2.5 flex-1 min-w-0">
          <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold truncate">{coin.name}</h3>
              <span className="text-xs linear-text uppercase font-medium">{coin.symbol}</span>
            </div>
            <p className="text-xs linear-text">Rank #{coin.market_cap_rank}</p>
          </div>
        </div>
        
        <button
          onClick={toggleWatchlist}
          className="p-1.5 rounded-md linear-hover flex-shrink-0"
        >
          <Star className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg font-semibold mb-0.5">
            {currency === 'INR' ? '₹' : '$'}{price}
          </p>
          <p className="text-xs linear-text">{marketCap}</p>
        </div>
        
        <div className={`flex items-center space-x-1 text-xs font-medium ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
        </div>
      </div>
    </motion.div>
  )
}

export default CoinCard
