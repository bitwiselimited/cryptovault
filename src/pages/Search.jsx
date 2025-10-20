import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, X, TrendingUp, Filter, SlidersHorizontal } from 'lucide-react'
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
    minMarketCap: '',
    priceChange: 'all', // all, gainers, losers
  })

  useEffect(() => {
    filterCoins()
  }, [searchQuery, coins, filters])

  const filterCoins = () => {
    let results = coins

    // Text search
    if (searchQuery.trim()) {
      results = results.filter(coin =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Price filters
    if (filters.minPrice) {
      results = results.filter(coin => coin.current_price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      results = results.filter(coin => coin.current_price <= parseFloat(filters.maxPrice))
    }

    // Market cap filter
    if (filters.minMarketCap) {
      results = results.filter(coin => coin.market_cap >= parseFloat(filters.minMarketCap) * 1e9)
    }

    // Price change filter
    if (filters.priceChange === 'gainers') {
      results = results.filter(coin => coin.price_change_percentage_24h > 0)
    } else if (filters.priceChange === 'losers') {
      results = results.filter(coin => coin.price_change_percentage_24h < 0)
    }

    setFilteredCoins(results)
  }

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minMarketCap: '',
      priceChange: 'all',
    })
    setSearchQuery('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 gradient-text">Search Cryptocurrencies</h1>
        <p className="text-gray-400">Discover and filter from {coins.length}+ cryptocurrencies</p>
      </div>

      {/* Search Bar */}
      <div className="card-modern rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or symbol (e.g., Bitcoin, BTC, ETH)..."
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/5 border-2 border-accent-blue/20 focus:border-accent-blue text-lg smooth-transition outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg smooth-transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex rounded-xl bg-white/5 p-1.5 border border-accent-blue/20">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold smooth-transition ${
                  currency === 'INR' 
                    ? 'bg-gradient-brand text-white' 
                    : 'text-gray-400'
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold smooth-transition ${
                  currency === 'USD' 
                    ? 'bg-gradient-brand text-white' 
                    : 'text-gray-400'
                }`}
              >
                $ USD
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold smooth-transition ${
                showFilters 
                  ? 'bg-accent-purple/20 text-accent-purple' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Min Price (USD)</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-accent-blue/20 focus:border-accent-blue outline-none smooth-transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Max Price (USD)</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  placeholder="∞"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-accent-blue/20 focus:border-accent-blue outline-none smooth-transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Min Market Cap (B)</label>
                <input
                  type="number"
                  value={filters.minMarketCap}
                  onChange={(e) => setFilters({...filters, minMarketCap: e.target.value})}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-accent-blue/20 focus:border-accent-blue outline-none smooth-transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">24h Change</label>
                <select
                  value={filters.priceChange}
                  onChange={(e) => setFilters({...filters, priceChange: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-accent-blue/20 focus:border-accent-blue outline-none smooth-transition"
                >
                  <option value="all">All Coins</option>
                  <option value="gainers">Gainers Only</option>
                  <option value="losers">Losers Only</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold smooth-transition"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {searchQuery || Object.values(filters).some(v => v && v !== 'all') 
              ? `Found ${filteredCoins.length} result${filteredCoins.length !== 1 ? 's' : ''}`
              : `All Cryptocurrencies (${filteredCoins.length})`
            }
          </h2>
        </div>

        {filteredCoins.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-modern rounded-2xl p-16 text-center"
          >
            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold mb-2">No Results Found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </motion.div>
  )
}

export default Search
