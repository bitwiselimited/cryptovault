import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { fetchCryptoData, fetchExchangeRate } from '../utils/api'

const DataContext = createContext()

export function DataProvider({ children }) {
  const [coins, setCoins] = useState([])
  const [inrRate, setInrRate] = useState(83.0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [cryptoData, exchangeRate] = await Promise.all([
        fetchCryptoData(),
        fetchExchangeRate()
      ])
      
      setCoins(cryptoData)
      setInrRate(exchangeRate)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err.message)
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchData, 120000)
    
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <DataContext.Provider value={{ 
      coins, 
      inrRate, 
      loading, 
      error, 
      lastUpdate,
      refetch: fetchData 
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}
