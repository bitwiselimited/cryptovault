import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, TrendingUp, TrendingDown, ExternalLink, Globe, Twitter } from 'lucide-react'
import { useData } from '../context/DataContext'
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../utils/db'
import toast from 'react-hot-toast'

const CoinDetails = () => {
  const { coinId } = useParams()
  const navigate = useNavigate()
  const { coins, inrRate } = useData()
  const [currency, setCurrency] = useState('INR')
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  
  const coin = coins.find(c => c.id === coinId)

  useEffect(() => {
    if (coin) {
      checkWatchlist()
    }
  }, [coin])

  const checkWatchlist = async () => {
    const inList = await isInWatchlist(coinId)
    setIsWatchlisted(inList)
  }

  const toggleWatchlist = async () => {
    if (isWatchlisted) {
      await removeFromWatchlist(coinId)
      toast.success(`Removed from favorites`)
    } else {
      await addToWatchlist(coin)
      toast.success(`Added to favorites`)
    }
    setIsWatchlisted(!isWatchlisted)
  }

  if (!coin) {
    return (
      <div className="container mx-auto px-6 py-6 max-w-5xl">
        <div className="linear-card rounded-lg p-16 text-center">
          <p className="text-sm text-secondary mb-4">Coin not found</p>
          <button onClick={() => navigate('/')} className="linear-button-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const price = currency === 'INR' 
    ? (coin.current_price * inrRate).toLocaleString('en-IN', { minimumFractionDigits: 2 })
    : coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2 })

  const isPositive = coin.price_change_percentage_24h > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 py-6 max-w-5xl"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 mb-6 text-sm text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header */}
      <div className="linear-card rounded-lg p-6 mb-4">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.img 
              whileHover={{ scale: 1.1, rotate: 5 }}
              src={coin.image} 
              alt={coin.name} 
              className="w-16 h-16 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl font-semibold">{coin.name}</h1>
                <span className="text-sm text-secondary uppercase font-medium">{coin.symbol}</span>
              </div>
              <p className="text-xs text-secondary">Rank #{coin.market_cap_rank}</p>
            </div>
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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleWatchlist}
              className="p-2 rounded-md linear-button-ghost"
            >
              <Star className={`w-5 h-5 ${isWatchlisted ? 'fill-yellow-400 text-yellow-400' : 'text-secondary'}`} />
            </motion.button>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline space-x-3 mb-2">
            <span className="text-4xl font-semibold">
              {currency === 'INR' ? '₹' : '$'}{price}
            </span>
            <motion.span 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-md ${
                isPositive ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'
              }`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
            </motion.span>
          </div>
          <p className="text-xs text-secondary">24h price change</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-secondary mb-1">Market Cap</p>
            <p className="text-sm font-semibold">
              {currency === 'INR' ? '₹' : '$'}
              {((coin.market_cap * (currency === 'INR' ? inrRate : 1)) / 1e9).toFixed(2)}B
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-1">24h Volume</p>
            <p className="text-sm font-semibold">
              {currency === 'INR' ? '₹' : '$'}
              {((coin.total_volume * (currency === 'INR' ? inrRate : 1)) / 1e9).toFixed(2)}B
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-1">Circulating Supply</p>
            <p className="text-sm font-semibold">
              {coin.circulating_supply ? (coin.circulating_supply / 1e6).toFixed(2) + 'M' : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-1">Max Supply</p>
            <p className="text-sm font-semibold">
              {coin.max_supply ? (coin.max_supply / 1e6).toFixed(2) + 'M' : '∞'}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="linear-card rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Price Range (24h)</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-secondary">High</span>
              <span className="font-medium">
                {currency === 'INR' ? '₹' : '$'}
                {((coin.high_24h || coin.current_price) * (currency === 'INR' ? inrRate : 1)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-secondary">Low</span>
              <span className="font-medium">
                {currency === 'INR' ? '₹' : '$'}
                {((coin.low_24h || coin.current_price) * (currency === 'INR' ? inrRate : 1)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="linear-card rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Links</h3>
          <div className="space-y-2">
            <a
              href={`https://www.coingecko.com/en/coins/${coinId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-xs linear-button-ghost w-full text-left"
            >
              <span className="flex items-center space-x-2">
                <Globe className="w-3.5 h-3.5" />
                <span>CoinGecko</span>
              </span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CoinDetails
