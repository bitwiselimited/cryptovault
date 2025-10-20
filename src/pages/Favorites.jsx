import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import CoinCard from '../components/CoinCard'
import { getWatchlist } from '../utils/db'
import { useData } from '../context/DataContext'

const Favorites = () => {
  const { coins, inrRate } = useData()
  const [watchlist, setWatchlist] = useState([])
  const [currency, setCurrency] = useState('INR')

  useEffect(() => {
    loadWatchlist()
    
    // Reload when returning to page
    const interval = setInterval(loadWatchlist, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadWatchlist = async () => {
    const list = await getWatchlist()
    setWatchlist(list)
  }

  const favoriteCoins = coins.filter(coin => 
    watchlist.some(w => w.id === coin.id)
  )

  return (
    <div className="container mx-auto px-6 py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Favorites</h1>
          <p className="text-xs linear-text">Your watchlisted cryptocurrencies</p>
        </div>
        
        <div className="flex items-center linear-card rounded-lg p-0.5">
          <button
            onClick={() => setCurrency('INR')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              currency === 'INR' ? 'bg-blue-600 text-white' : 'text-gray-400'
            }`}
          >
            INR
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              currency === 'USD' ? 'bg-blue-600 text-white' : 'text-gray-400'
            }`}
          >
            USD
          </button>
        </div>
      </div>

      {favoriteCoins.length === 0 ? (
        <div className="linear-card rounded-lg p-16 text-center">
          <Star className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <h3 className="text-sm font-semibold mb-1">No favorites yet</h3>
          <p className="text-xs linear-text">Click the star icon on any coin to add it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {favoriteCoins.map((coin, index) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              currency={currency}
              inrRate={inrRate}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
