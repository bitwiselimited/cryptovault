import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react'
import CoinCard from '../components/CoinCard'
import { useData } from '../context/DataContext'

const Search = () => {
  const { coins, inrRate } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCoins, setFilteredCoins] = useState([])
  const [currency, setCurrency] = useState('INR')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    priceChange: 'all',
  })

  useEffect(() => {
    filterCoins()
  }, [searchQuery, coins, filters])

  const filterCoins = () => {
    let results = coins

    if (searchQuery.trim()) {
      results = results.filter(coin =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filters.minPrice) {
      results = results.filter(coin => coin.current_price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      results = results.filter(coin => coin.current_price <= parseFloat(filters.maxPrice))
    }
    if (filters.priceChange === 'gainers') {
      results = results.filter(coin => coin.price_change_percentage_24h > 0)
    } else if (filters.priceChange === 'losers') {
      results = results.filter(coin => coin.price_change_percentage_24h < 0)
    }

    setFilteredCoins(results)
  }

  return (
    <div className="container mx-auto px-6 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">Search</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 linear-text" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cryptocurrencies..."
              className="w-full pl-9 pr-10 py-2 linear-card rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 linear-hover rounded p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              showFilters ? 'linear-card' : 'linear-hover linear-text'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

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
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="linear-card rounded-lg p-4 mb-6"
        >
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs linear-text mb-1">Min Price (USD)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                placeholder="0"
                className="w-full px-3 py-2 linear-bg rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs linear-text mb-1">Max Price (USD)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                placeholder="∞"
                className="w-full px-3 py-2 linear-bg rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs linear-text mb-1">24h Change</label>
              <select
                value={filters.priceChange}
                onChange={(e) => setFilters({...filters, priceChange: e.target.value})}
                className="w-full px-3 py-2 linear-bg rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="gainers">Gainers</option>
                <option value="losers">Losers</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <div className="mb-4">
        <p className="text-xs linear-text">
          {searchQuery || Object.values(filters).some(v => v && v !== 'all')
            ? `${filteredCoins.length} results`
            : `${filteredCoins.length} cryptocurrencies`
          }
        </p>
      </div>

      {filteredCoins.length === 0 ? (
        <div className="linear-card rounded-lg p-12 text-center">
          <SearchIcon className="w-8 h-8 mx-auto mb-2 linear-text" />
          <p className="text-xs linear-text">No results found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredCoins.map((coin, index) => (
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

export default Search
