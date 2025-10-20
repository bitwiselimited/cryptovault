import { useState, useEffect, useCallback } from 'react';
import coinGeckoService from '../services/coinGeckoService';
import exchangeRateService from '../services/exchangeRateService';
import { REFRESH_INTERVAL } from '../utils/constants';

export const useCryptoData = () => {
  const [marketData, setMarketData] = useState([]);
  const [inrRate, setInrRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch in parallel
      const [coins, rate] = await Promise.all([
        coinGeckoService.getMarketData('usd', 100),
        exchangeRateService.getINRRate(),
      ]);

      setMarketData(coins);
      setInrRate(rate);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 3 minutes
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return { marketData, inrRate, loading, error, lastUpdated, refetch: fetchData };
};
