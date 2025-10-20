import { openDB } from 'idb'

const DB_NAME = 'SmartCryptoTrackerDB'
const DB_VERSION = 1

export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('watchlist')) {
        db.createObjectStore('watchlist', { keyPath: 'id' })
      }
      
      if (!db.objectStoreNames.contains('alerts')) {
        db.createObjectStore('alerts', { keyPath: 'id' })
      }
      
      if (!db.objectStoreNames.contains('portfolio')) {
        const portfolioStore = db.createObjectStore('portfolio', { keyPath: 'id', autoIncrement: true })
        portfolioStore.createIndex('username', 'username', { unique: false })
      }
    },
  })
  return db
}

// Watchlist
export async function addToWatchlist(coin) {
  const db = await initDB()
  await db.put('watchlist', {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    image: coin.image,
    addedAt: new Date().toISOString(),
  })
}

export async function removeFromWatchlist(coinId) {
  const db = await initDB()
  await db.delete('watchlist', coinId)
}

export async function getWatchlist() {
  const db = await initDB()
  return await db.getAll('watchlist')
}

export async function isInWatchlist(coinId) {
  const db = await initDB()
  const item = await db.get('watchlist', coinId)
  return !!item
}

// Alerts
export async function addAlert(alert) {
  const db = await initDB()
  await db.put('alerts', alert)
}

export async function removeAlert(alertId) {
  const db = await initDB()
  await db.delete('alerts', alertId)
}

export async function getAlerts() {
  const db = await initDB()
  return await db.getAll('alerts')
}

// Portfolio
export async function addToPortfolio(username, coinId, coinName, coinSymbol, coinImage, amount, buyPrice) {
  const db = await initDB()
  await db.add('portfolio', {
    username,
    coinId,
    coinName,
    coinSymbol,
    coinImage,
    amount,
    buyPrice,
    addedAt: new Date().toISOString(),
  })
}

export async function removeFromPortfolio(id) {
  const db = await initDB()
  await db.delete('portfolio', id)
}

export async function getPortfolio(username) {
  const db = await initDB()
  const tx = db.transaction('portfolio', 'readonly')
  const index = tx.store.index('username')
  return await index.getAll(username)
}
