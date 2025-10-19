function Portfolio({ portfolio, coins, exchangeRates, onRemoveFromPortfolio, portfolioStats }) {
  if (portfolio.length === 0) return null

  return (
    <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Your Portfolio
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/10">
          <p className="text-white/70 text-sm mb-1">Total Value</p>
          <p className="text-2xl font-bold text-white">
            ₹{(portfolioStats.totalValue * exchangeRates.inr).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/10">
          <p className="text-white/70 text-sm mb-1">Total Profit/Loss</p>
          <p className={`text-2xl font-bold ${portfolioStats.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {portfolioStats.profit >= 0 ? '+' : ''}₹{(portfolioStats.profit * exchangeRates.inr).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/10">
          <p className="text-white/70 text-sm mb-1">ROI</p>
          <p className={`text-2xl font-bold ${portfolioStats.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {portfolioStats.profitPercentage >= 0 ? '+' : ''}{portfolioStats.profitPercentage.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-2">Coin</th>
              <th className="text-right py-3 px-2">Amount</th>
              <th className="text-right py-3 px-2">Buy Price</th>
              <th className="text-right py-3 px-2">Current Price</th>
              <th className="text-right py-3 px-2">P&L</th>
              <th className="text-center py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map(item => {
              const coin = coins.find(c => c.id === item.coinId)
              if (!coin) return null
              
              const currentValue = coin.current_price * item.amount
              const costBasis = item.purchasePrice * item.amount
              const profitLoss = currentValue - costBasis
              const profitLossPercent = ((profitLoss / costBasis) * 100).toFixed(2)
              
              return (
                <tr key={item.id} className="border-b border-white/10">
                  <td className="py-3 px-2 font-semibold">{item.coinName}</td>
                  <td className="text-right py-3 px-2">{item.amount}</td>
                  <td className="text-right py-3 px-2">${item.purchasePrice.toFixed(2)}</td>
                  <td className="text-right py-3 px-2">${coin.current_price.toFixed(2)}</td>
                  <td className={`text-right py-3 px-2 font-semibold ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)} ({profitLossPercent}%)
                  </td>
                  <td className="text-center py-3 px-2">
                    <button
                      onClick={() => onRemoveFromPortfolio(item.id)}
                      className="px-3 py-1 rounded bg-red-500/80 hover:bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Portfolio
