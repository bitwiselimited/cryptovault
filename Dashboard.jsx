function Dashboard({ coins, exchangeRates, loading, portfolioStats, user }) {
  const topGainer = coins.reduce((max, coin) => 
    coin.price_change_percentage_24h > (max?.price_change_percentage_24h || -Infinity) ? coin : max, null)
  
  const topLoser = coins.reduce((min, coin) => 
    coin.price_change_percentage_24h < (min?.price_change_percentage_24h || Infinity) ? coin : min, null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="glass-card rounded-2xl p-6 hover-lift transition-all animate-slide-up">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Portfolio Value</h3>
          <span className="text-2xl">💰</span>
        </div>
        <p className="text-2xl font-bold text-white mb-1">
          ₹{(portfolioStats.totalValue * exchangeRates.inr).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
        <p className="text-sm text-white/70">
          ${portfolioStats.totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </p>
        <p className={`text-sm mt-2 ${portfolioStats.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {portfolioStats.profit >= 0 ? '▲' : '▼'} {Math.abs(portfolioStats.profitPercentage).toFixed(2)}%
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 hover-lift transition-all animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Top Gainer</h3>
          <span className="text-2xl">🚀</span>
        </div>
        {!loading && topGainer ? (
          <>
            <p className="text-xl font-bold text-white mb-1">{topGainer.name}</p>
            <p className="text-green-400 font-semibold">
              ▲ {topGainer.price_change_percentage_24h.toFixed(2)}%
            </p>
          </>
        ) : (
          <div className="skeleton h-8 w-24 rounded"></div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 hover-lift transition-all animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Top Loser</h3>
          <span className="text-2xl">📉</span>
        </div>
        {!loading && topLoser ? (
          <>
            <p className="text-xl font-bold text-white mb-1">{topLoser.name}</p>
            <p className="text-red-400 font-semibold">
              ▼ {Math.abs(topLoser.price_change_percentage_24h).toFixed(2)}%
            </p>
          </>
        ) : (
          <div className="skeleton h-8 w-24 rounded"></div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 hover-lift transition-all animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Market Status</h3>
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-2xl font-bold text-white mb-1">{coins.length}</p>
        <p className="text-sm text-white/70">Coins Tracked</p>
        <p className="text-xs text-green-400 mt-2">● Live</p>
      </div>
    </div>
  )
}

export default Dashboard
