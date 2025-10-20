const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'
const EXCHANGE_RATE_BASE = 'https://api.exchangerate.host'

// Cache management
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCached(key) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

export async function fetchCryptoData() {
  const cacheKey = 'crypto_markets'
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(
      `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    setCache(cacheKey, data)
    return data
  } catch (error) {
    console.error('Error fetching crypto data:', error)
    throw error
  }
}

export async function fetchExchangeRate() {
  const cacheKey = 'exchange_rate_inr'
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(
      `${EXCHANGE_RATE_BASE}/latest?base=USD&symbols=INR`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    const rate = data.rates.INR
    setCache(cacheKey, rate)
    return rate
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    // Fallback rate
    return 83.0
  }
}

export async function fetchCoinDetails(coinId) {
  const cacheKey = `coin_details_${coinId}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(
      `${COINGECKO_BASE}/coins/${coinId}?localization=false&tickers=false&community_data=true&developer_data=true`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    setCache(cacheKey, data)
    return data
  } catch (error) {
    console.error('Error fetching coin details:', error)
    throw error
  }
}
