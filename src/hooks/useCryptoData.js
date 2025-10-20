import { useState, useEffect } from 'react'
import { fetchCryptoData } from '../utils/api'

export function useCryptoData() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchCryptoData()
      setCoins(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchData, 120000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    coins,
    loading,
    error,
    refetch: fetchData
  }
}
