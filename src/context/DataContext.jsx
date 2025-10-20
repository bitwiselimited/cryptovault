import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { fetchCryptoData, fetchExchangeRate } from '../utils/api'
import toast from 'react-hot-toast'

const DataContext = createContext()

export function DataProvider({ children }) {
  const [coins, setCoins] = useState([])
  const [inrRate, setInrRate] = useState(83.0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchData = useCallback(async (showToast = false) => {
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
      
      if (showToast) {
        toast.success('Market data updated')
      }
    } catch (err) {
      setError(err.message)
      toast.error('Failed to fetch market data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => fetchData(false), 120000)
    
    return () => clearInterval(interval)
  }, [fetchData])

  const refetch = () => fetchData(true)

  return (
    <DataContext.Provider value={{ 
      coins, 
      inrRate, 
      loading, 
      error, 
      lastUpdate,
      refetch 
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
