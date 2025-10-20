import { useState, useEffect } from 'react'
import { fetchExchangeRate } from '../utils/api'

export function useExchangeRate() {
  const [inrRate, setInrRate] = useState(83.0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true)
        const rate = await fetchExchangeRate()
        setInrRate(rate)
      } catch (error) {
        console.error('Error fetching exchange rate:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRate()
    
    // Refresh every 30 minutes
    const interval = setInterval(fetchRate, 1800000)
    
    return () => clearInterval(interval)
  }, [])

  return { inrRate, loading }
}
