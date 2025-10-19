import { useState } from 'react'
import MiniChart from './MiniChart'

function CoinCard({ coin, exchangeRates, onAddAlert, onAddToPortfolio, hasAlert, index }) {
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [showPortfolioModal, setShowPortfolioModal] = useState(false)
  const [alertPrice, setAlertPrice] = useState(coin.current_price * 0.9)
  const [portfolioAmount, setPortfolioAmount] = useState('')
  const [purchasePrice, setPurchasePrice] = useState(coin.current_price)

  const handleAddAlert = () => {
    onAddAlert(coin.id, coin.name, parseFloat(alertPrice))
    setShowAlertModal(false)
  }

  const handleAddToPortfolio = () => {
    if (portfolioAmount && purchasePrice) {
      onAddToPortfolio(coin.id, coin.name, portfolioAmount, purchasePrice)
      setShowPortfolioModal(false)
      setPortfolioAmount('')
    }
  }

  const priceInINR = coin.current_price * exchangeRates.inr

  return (
    <>
      <div 
        className="glass-card rounded-2xl p-6 hover-lift transition-all animate-slide-up"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full" />
            <div>
              <h3 className="font-bold text-white text-lg">{coin.name}</h3>
              <p className="text-sm text-white/70 uppercase">{coin.symbol}</p>
            </div>
          </div>
          {hasAlert && (
            <div className="alert-active">
              <span className="text-2xl">🔔</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-2xl font-bold text-white">
            ${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
          </p>
          <p className="text-sm text-white/70">
            ₹{priceInINR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
            coin.price_change_percentage_24h >= 0 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} 
            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </div>
        </div>

        <div className="mb-4 h-20">
          <MiniChart sparklineData={coin.sparkline_in_7d?.price || []} isPositive={coin.price_change_percentage_24h >= 0} />
        </div>

        <div className="text-xs text-white/60 mb-4">
          <p>Market Cap: ${(coin.market_cap / 1e9).toFixed(2)}B</p>
          <p>Volume: ${(coin.total_volume / 1e6).toFixed(2)}M</p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowAlertModal(true)}
            className="flex-1 px-4 py-2 rounded-xl bg-yellow-500/80 hover:bg-yellow-600 text-white font-semibold transition-all text-sm"
          >
            🔔 Alert
          </button>
          <button
            onClick={() => setShowPortfolioModal(true)}
            className="flex-1 px-4 py-2 rounded-xl bg-blue-500/80 hover:bg-blue-600 text-white font-semibold transition-all text-sm"
          >
            ➕ Add
          </button>
        </div>
      </div>

      {showAlertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Set Price Alert for {coin.name}</h3>
            <p className="text-white/70 text-sm mb-4">
              You'll be notified when the price drops below your target
            </p>
            <input
              type="number"
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 mb-4"
              placeholder="Target price in USD"
              step="0.01"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleAddAlert}
                className="flex-1 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                Set Alert
              </button>
              <button
                onClick={() => setShowAlertModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Add {coin.name} to Portfolio</h3>
            <input
              type="number"
              value={portfolioAmount}
              onChange={(e) => setPortfolioAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 mb-3"
              placeholder="Amount (e.g., 0.5)"
              step="0.00000001"
            />
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 mb-4"
              placeholder="Purchase price in USD"
              step="0.01"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleAddToPortfolio}
                className="flex-1 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                Add to Portfolio
              </button>
              <button
                onClick={() => setShowPortfolioModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CoinCard
