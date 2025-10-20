import { API_ENDPOINTS, CACHE_DURATION } from '../utils/constants';

class ExchangeRateService {
  constructor() {
    this.cache = null;
    this.cacheTimestamp = 0;
  }

  async getINRRate() {
    // Return cached rate if still valid
    if (this.cache && Date.now() - this.cacheTimestamp < CACHE_DURATION) {
      return this.cache;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.EXCHANGE_RATE}?base=USD&symbols=INR`);
      const data = await response.json();
      
      const rate = data.rates?.INR || 83.12; // Fallback rate
      
      this.cache = rate;
      this.cacheTimestamp = Date.now();
      
      return rate;
    } catch (error) {
      console.error('Exchange Rate API Error:', error);
      // Return fallback rate if API fails
      return 83.12;
    }
  }

  convertToINR(usdAmount) {
    if (!this.cache) return null;
    return usdAmount * this.cache;
  }

  convertToUSD(inrAmount) {
    if (!this.cache) return null;
    return inrAmount / this.cache;
  }
}

export default new ExchangeRateService();
