import { API_ENDPOINTS, CACHE_DURATION } from '../utils/constants';

class CoinGeckoService {
  constructor() {
    this.cache = new Map();
    this.requestQueue = [];
    this.requestCount = 0;
    this.maxRequestsPerMinute = 25; // Stay under 30 limit
    this.resetTime = Date.now() + 60000;
  }

  async rateLimitedFetch(url) {
    // Reset counter every minute
    if (Date.now() > this.resetTime) {
      this.requestCount = 0;
      this.resetTime = Date.now() + 60000;
    }

    // Wait if we've hit the limit
    if (this.requestCount >= this.maxRequestsPerMinute) {
      const waitTime = this.resetTime - Date.now();
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.resetTime = Date.now() + 60000;
    }

    this.requestCount++;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('CoinGecko API Error:', error);
      throw error;
    }
  }

  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  async getMarketData(currency = 'usd', perPage = 100) {
    const cacheKey = `markets_${currency}_${perPage}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const url = `${API_ENDPOINTS.COINGECKO_MARKETS}?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=7d`;
    
    const data = await this.rateLimitedFetch(url);
    this.setCache(cacheKey, data);
    return data;
  }

  async getCoinDetails(coinId) {
    const cacheKey = `coin_${coinId}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const url = `${API_ENDPOINTS.COINGECKO_COIN}/${coinId}?localization=false&tickers=false&community_data=true&developer_data=true`;
    
    const data = await this.rateLimitedFetch(url);
    this.setCache(cacheKey, data);
    return data;
  }

  async getBoomingCoins(marketData) {
    // Sort by 24h price change and volume
    return marketData
      .filter(coin => coin.price_change_percentage_24h > 0)
      .sort((a, b) => {
        const scoreA = a.price_change_percentage_24h * Math.log10(a.total_volume);
        const scoreB = b.price_change_percentage_24h * Math.log10(b.total_volume);
        return scoreB - scoreA;
      })
      .slice(0, 10);
  }

  async getSafeInvestments(marketData) {
    // High market cap, low volatility (low price change variance)
    return marketData
      .filter(coin => coin.market_cap > 1000000000) // > $1B market cap
      .map(coin => ({
        ...coin,
        volatility: Math.abs(coin.price_change_percentage_24h) + 
                   Math.abs(coin.price_change_percentage_7d_in_currency || 0),
      }))
      .sort((a, b) => a.volatility - b.volatility)
      .slice(0, 10);
  }
}

export default new CoinGeckoService();
