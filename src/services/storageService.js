const STORAGE_KEYS = {
  USER: 'crypto_tracker_user',
  PORTFOLIO: 'crypto_tracker_portfolio',
  WATCHLIST: 'crypto_tracker_watchlist',
  ALERTS: 'crypto_tracker_alerts',
  PREFERENCES: 'crypto_tracker_preferences',
};

class StorageService {
  // User Management
  getUser() {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  setUser(username) {
    const user = {
      username,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Portfolio Management
  getPortfolio() {
    const portfolio = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
    return portfolio ? JSON.parse(portfolio) : [];
  }

  addToPortfolio(coin) {
    const portfolio = this.getPortfolio();
    const existing = portfolio.find(c => c.id === coin.id);
    
    if (existing) {
      existing.amount += coin.amount;
      existing.totalInvested += coin.totalInvested;
    } else {
      portfolio.push({
        ...coin,
        addedAt: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
    return portfolio;
  }

  removeFromPortfolio(coinId) {
    const portfolio = this.getPortfolio().filter(c => c.id !== coinId);
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
    return portfolio;
  }

  updatePortfolioCoin(coinId, updates) {
    const portfolio = this.getPortfolio();
    const index = portfolio.findIndex(c => c.id === coinId);
    
    if (index !== -1) {
      portfolio[index] = { ...portfolio[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
    }
    
    return portfolio;
  }

  // Watchlist Management
  getWatchlist() {
    const watchlist = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    return watchlist ? JSON.parse(watchlist) : [];
  }

  addToWatchlist(coinId) {
    const watchlist = this.getWatchlist();
    if (!watchlist.includes(coinId)) {
      watchlist.push(coinId);
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
    }
    return watchlist;
  }

  removeFromWatchlist(coinId) {
    const watchlist = this.getWatchlist().filter(id => id !== coinId);
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
    return watchlist;
  }

  // Price Alerts Management
  getAlerts() {
    const alerts = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return alerts ? JSON.parse(alerts) : [];
  }

  addAlert(alert) {
    const alerts = this.getAlerts();
    alerts.push({
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      triggered: false,
    });
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    return alerts;
  }

  removeAlert(alertId) {
    const alerts = this.getAlerts().filter(a => a.id !== alertId);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    return alerts;
  }

  updateAlert(alertId, updates) {
    const alerts = this.getAlerts();
    const index = alerts.findIndex(a => a.id === alertId);
    
    if (index !== -1) {
      alerts[index] = { ...alerts[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    }
    
    return alerts;
  }

  // Preferences
  getPreferences() {
    const prefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return prefs ? JSON.parse(prefs) : {
      currency: 'INR',
      theme: 'dark',
      notifications: true,
    };
  }

  setPreferences(preferences) {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    return updated;
  }
}

export default new StorageService();
