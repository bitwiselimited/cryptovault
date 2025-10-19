import { useState, useEffect, useCallback } from 'react'
import CoinCard from './components/CoinCard'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import AlertManager from './components/AlertManager'
import Portfolio from './components/Portfolio'
import LoginModal from './components/LoginModal'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : true
  })
  
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [exchangeRates, setExchangeRates] = useState({ inr: 83, usd: 1 })
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('alerts')
    return saved ? JSON.parse(saved) : []
  })
  
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('portfolio')
    return saved ? JSON.parse(saved) : []
  })
  
  const [lastAlertCheck, setLastAlertCheck] = useState(Date.now())
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === 'granted')
      })
    } else if (Notification.permission === 'granted') {
      setNotificationsEnabled(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts))
  }, [alerts])

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio))
  }, [portfolio])

  const fetchExchangeRates = useCallback(async () => {
    try {
      const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json')
      const data = await response.json()
      if (data && data.usd) {
        setExchangeRates({ inr: data.usd.inr || 83, usd: 1 })
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
    }
  }, [])

  const fetchCryptoData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h,7d'
      )
      
      if (!response.ok) throw new Error('Rate limit exceeded')
      
      const data = await response.json()
      setCoins(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching crypto data:', error)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCryptoData()
    fetchExchangeRates()
  }, [fetchCryptoData, fetchExchangeRates])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCryptoData()
      fetchExchangeRates()
    }, 300000)
    return () => clearInterval(interval)
  }, [fetchCryptoData, fetchExchangeRates])

  useEffect(() => {
    const checkAlerts = () => {
      if (!notificationsEnabled || alerts.length === 0) return
      
      alerts.forEach(alert => {
        if (!alert.active) return
        const coin = coins.find(c => c.id === alert.coinId)
        if (!coin) return
        
        if (coin.current_price <= alert.targetPrice && Date.now() - lastAlertCheck > 60000) {
          new Notification(`🚨 ${coin.name} Price Alert!`, {
            body: `${coin.name} dropped to $${coin.current_price.toFixed(2)} (Target: $${alert.targetPrice.toFixed(2)})`,
            icon: coin.image
          })
          setLastAlertCheck(Date.now())
        }
      })
    }
    
    const interval = setInterval(checkAlerts, 120000)
    checkAlerts()
    return () => clearInterval(interval)
  }, [alerts, coins, notificationsEnabled, lastAlertCheck])

  const filteredCoins = coins.filter(coin => {
    if (activeTab === 'gainers') return coin.price_change_percentage_24h > 5
    if (activeTab === 'losers') return coin.price_change_percentage_24h < -5
    if (activeTab === 'safe') return coin.market_cap > 10000000000 && Math.abs(coin.price_change_percentage_24h) < 5
    return true
  })

  const addAlert = (coinId, coinName, targetPrice) => {
    setAlerts(prev => [...prev, {
      id: Date.now().toString(),
      coinId, coinName, targetPrice,
      active: true,
      createdAt: Date.now()
    }])
  }

  const removeAlert = (alertId) => setAlerts(prev => prev.filter(a => a.id !== alertId))
  const toggleAlert = (alertId) => setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, active: !a.active } : a))

  const addToPortfolio = (coinId, coinName, amount, purchasePrice) => {
    setPortfolio(prev => [...prev, {
      id: Date.now().toString(),
      coinId, coinName,
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice),
      addedAt: Date.now()
    }])
  }

  const removeFromPortfolio = (itemId) => setPortfolio(prev => prev.filter(p => p.id !== itemId))

  const calculatePortfolioValue = () => {
    let totalValue = 0, totalCost = 0
    portfolio.forEach(item => {
      const coin = coins.find(c => c.id === item.coinId)
      if (coin) {
        totalValue += coin.current_price * item.amount
        totalCost += item.purchasePrice * item.amount
      }
    })
    return {
      totalValue, totalCost,
      profit: totalValue - totalCost,
      profitPercentage: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0
    }
  }

  const portfolioStats = calculatePortfolioValue()

  if (!user) return <LoginModal onLogin={setUser} darkMode={darkMode} />

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="gradient-bg min-h-screen">
        <Navbar 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          onLogout={() => { setUser(null); localStorage.removeItem('user') }}
        />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Dashboard 
            coins={coins}
            exchangeRates={exchangeRates}
            loading={loading}
            portfolioStats={portfolioStats}
            user={user}
          />
          
          <div className="glass-card rounded-2xl p-2 mb-6 animate-slide-up">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Coins', icon: '🌐' },
                { id: 'gainers', label: 'Top Gainers', icon: '📈' },
                { id: 'losers', label: 'Top Losers', icon: '📉' },
                { id: 'safe', label: 'Safe Bets', icon: '🛡️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AlertManager
            alerts={alerts}
            coins={coins}
            onRemoveAlert={removeAlert}
            onToggleAlert={toggleAlert}
            notificationsEnabled={notificationsEnabled}
          />

          <Portfolio
            portfolio={portfolio}
            coins={coins}
            exchangeRates={exchangeRates}
            onRemoveFromPortfolio={removeFromPortfolio}
            portfolioStats={portfolioStats}
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 h-64">
                  <div className="skeleton h-6 w-32 rounded mb-4"></div>
                  <div className="skeleton h-8 w-24 rounded mb-2"></div>
                  <div className="skeleton h-4 w-16 rounded mb-4"></div>
                  <div className="skeleton h-32 w-full rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoins.slice(0, 30).map((coin, index) => (
                <CoinCard
                  key={coin.id}
                  coin={coin}
                  exchangeRates={exchangeRates}
                  onAddAlert={addAlert}
                  onAddToPortfolio={addToPortfolio}
                  hasAlert={alerts.some(a => a.coinId === coin.id && a.active)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

        <footer className="py-8 text-center text-white/80">
          <p className="text-sm">Built with ❤️ using CoinGecko API • Updates every 5 min</p>
        </footer>
      </div>
    </div>
  )
}

export default App
