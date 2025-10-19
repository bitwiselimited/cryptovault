function AlertManager({ alerts, coins, onRemoveAlert, onToggleAlert, notificationsEnabled }) {
  if (alerts.length === 0) return null

  return (
    <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <span className="mr-2">🔔</span>
          Active Alerts ({alerts.length})
        </h2>
        {!notificationsEnabled && (
          <span className="text-xs text-yellow-400">⚠️ Enable notifications</span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.map(alert => {
          const coin = coins.find(c => c.id === alert.coinId)
          const isTriggered = coin && coin.current_price <= alert.targetPrice
          
          return (
            <div 
              key={alert.id}
              className={`p-4 rounded-xl border-2 ${
                isTriggered 
                  ? 'bg-red-500/20 border-red-500 alert-active' 
                  : alert.active 
                    ? 'bg-green-500/20 border-green-500' 
                    : 'bg-gray-500/20 border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">{alert.coinName}</span>
                <button
                  onClick={() => onToggleAlert(alert.id)}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    alert.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}
                >
                  {alert.active ? 'ON' : 'OFF'}
                </button>
              </div>
              <p className="text-white/70 text-sm mb-2">
                Target: ${alert.targetPrice.toFixed(2)}
              </p>
              {coin && (
                <p className="text-white/70 text-sm mb-2">
                  Current: ${coin.current_price.toFixed(2)}
                </p>
              )}
              {isTriggered && (
                <p className="text-red-400 text-xs font-semibold mb-2">
                  🚨 TRIGGERED!
                </p>
              )}
              <button
                onClick={() => onRemoveAlert(alert.id)}
                className="w-full px-3 py-1 rounded bg-red-500/80 hover:bg-red-600 text-white text-sm font-semibold"
              >
                Remove
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AlertManager
