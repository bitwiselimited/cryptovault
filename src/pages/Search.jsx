import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, X, SlidersHorizontal, Filter } from 'lucide-react'
import CoinCard from '../components/CoinCard'
import { GridSkeleton } from '../components/LoadingSkeleton'
import { useData } from '../context/DataContext'

const Search = () => {
  const { coins, inrRate, loading } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCoins, setFilteredCoins] = useState([])
  const [currency, setCurrency] = useState('INR')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minMarketCap: '',
    priceChange: 'all',
  })

  useEffect(() => {
    filterCoins()
  }, [searchQuery, coins, filters])

  useEffect(() => {
    // Auto-focus search input
    const input = document.querySelector('input[type="text"]')
    if (input) input.focus()
  }, [])

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
    if (filters.minMarketCap) {
      results = results.filter(coin => coin.market_cap >= parseFloat(filters.minMarketCap) * 1e9)
    }
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
  }

  const hasActiveFilters = Object.values(filters).some(v => v && v !== 'all')

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-6 max-w-[1400px]">
        <GridSkeleton />
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">Search</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cryptocurrencies by name or symbol..."
              className="linear-input w-full pl-9 pr-10"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 hover:bg-white/[0.06] rounded p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              showFilters || hasActiveFilters ? 'linear-card ring-1 ring-accent-blue' : 'linear-button-ghost'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
            )}
          </button>

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
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="linear-card rounded-lg p-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-accent-blue" />
                <h3 className="text-sm font-semibold">Advanced Filters</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-accent-blue hover:text-accent-blue/80"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-secondary mb-1.5">Min Price (USD)</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  placeholder="0"
                  className="linear-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5">Max Price (USD)</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  placeholder="∞"
                  className="linear-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5">Min Market Cap (B)</label>
                <input
                  type="number"
                  value={filters.minMarketCap}
                  onChange={(e) => setFilters({...filters, minMarketCap: e.target.value})}
                  placeholder="0"
                  className="linear-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5">24h Change</label>
                <select
                  value={filters.priceChange}
                  onChange={(e) => setFilters({...filters, priceChange: e.target.value})}
                  className="linear-input w-full"
                >
                  <option value="all">All Coins</option>
                  <option value="gainers">Gainers Only</option>
                  <option value="losers">Losers Only</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="mb-4">
        <p className="text-xs text-secondary">
          {searchQuery || hasActiveFilters
            ? `${filteredCoins.length} result${filteredCoins.length !== 1 ? 's' : ''}`
            : `${filteredCoins.length} cryptocurrencies`
          }
        </p>
      </div>

      {filteredCoins.length === 0 ? (
        <div className="linear-card rounded-lg p-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <SearchIcon className="w-12 h-12 mx-auto mb-3 text-muted" />
          </motion.div>
          <h3 className="text-sm font-semibold mb-1">No results found</h3>
          <p className="text-xs text-secondary mb-4">Try adjusting your search or filters</p>
          {(searchQuery || hasActiveFilters) && (
            <button
              onClick={() => {
                setSearchQuery('')
                clearFilters()
              }}
              className="linear-button-primary"
            >
              Clear all filters
            </button>
          )}
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
    </motion.div>
  )
}

export default Search
