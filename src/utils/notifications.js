export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

export function sendNotification(title, options = {}) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    })
  }
}

export function checkPriceAlerts(coins, alerts) {
  alerts.forEach(alert => {
    const coin = coins.find(c => c.id === alert.coinId)
    if (!coin) return

    const shouldTrigger = 
      (alert.type === 'above' && coin.current_price >= alert.targetPrice) ||
      (alert.type === 'below' && coin.current_price <= alert.targetPrice)

    if (shouldTrigger) {
      sendNotification(
        `Price Alert: ${alert.coinName}`,
        {
          body: `${alert.coinName} is now ${alert.type} $${alert.targetPrice}. Current price: $${coin.current_price.toFixed(2)}`,
          tag: alert.id,
          requireInteraction: true,
        }
      )
    }
  })
}
