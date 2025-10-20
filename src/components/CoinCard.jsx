import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Star } from 'lucide-react'
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../utils/db'

const CoinCard = ({ coin, currency, inrRate, index }) => {
  const [isWatchlisted, setIsWatchlisted] = React.useState(false)
  
  const price = currency === 'INR' 
    ? (coin.current_price * inrRate).toFixed(2)
    : coin.current_price.toFixed(2)
    
  const marketCap = currency === 'INR'
    ? ((coin.market_cap * inrRate) / 1e9).toFixed(2)
    : (coin.market_cap / 1e9).toFixed(2)

  const isPositive = coin.price_change_percentage_24h > 0

  React.useEffect(() => {
    checkWatchlist()
  }, [coin.id])

  const checkWatchlist = async () => {
    const inList = await isInWatchlist(coin.id)
    setIsWatchlisted(inList)
  }

  const toggleWatchlist = async () => {
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
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="card-elevated rounded-xl p-5 transition-smooth cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-semibold text-white">{coin.name}</h3>
            <p className="text-sm text-gray-400 uppercase">{coin.symbol}</p>
          </div>
        </div>
        
        <button
          onClick={toggleWatchlist}
          className="p-2 rounded-lg hover:bg-linear-hover transition-smooth"
        >
          <Star
            className={`w-5 h-5 ${isWatchlisted ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
          />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">
            {currency === 'INR' ? '₹' : '$'}{price}
          </span>
          <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-md ${
            isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-linear-border">
          <div>
            <p className="text-xs text-gray-400 mb-1">Market Cap</p>
            <p className="text-sm font-medium">
              {currency === 'INR' ? '₹' : '$'}{marketCap}B
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">24h Volume</p>
            <p className="text-sm font-medium">
              {currency === 'INR' ? '₹' : '$'}
              {((coin.total_volume * (currency === 'INR' ? inrRate : 1)) / 1e9).toFixed(2)}B
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CoinCard
