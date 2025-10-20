import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, AlertCircle } from 'lucide-react';
import storageService from '../services/storageService';
import { formatCurrency } from '../utils/helpers';

const PriceAlerts = ({ marketData, onRequestNotification }) => {
  const [alerts, setAlerts] = useState(storageService.getAlerts());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    coinId: '',
    type: 'above',
    price: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const coin = marketData.find(c => c.id === formData.coinId);
    if (!coin) return;

    const newAlert = {
      coinId: formData.coinId,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      type: formData.type,
      price: parseFloat(formData.price),
    };

    const updated = storageService.addAlert(newAlert);
    setAlerts(updated);
    setFormData({ coinId: '', type: 'above', price: '' });
    setShowForm(false);

    // Request notification permission
    onRequestNotification();
  };

  const handleDelete = (alertId) => {
    const updated = storageService.removeAlert(alertId);
    setAlerts(updated);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Price Alerts</h2>
            <p className="text-sm text-gray-500">Get notified when prices hit your targets</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-linear-accent rounded-lg text-white font-medium hover:bg-linear-accent-light transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Alert</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-6 mb-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Coin
                </label>
                <select
                  value={formData.coinId}
                  onChange={(e) => setFormData({ ...formData, coinId: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-linear-border rounded-lg text-gray-200 focus:outline-none focus:border-linear-accent"
                >
                  <option value="">Choose a coin...</option>
                  {marketData.slice(0, 50).map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()}) - ${coin.current_price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Alert Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-linear-border rounded-lg text-gray-200 focus:outline-none focus:border-linear-accent"
                  >
                    <option value="above">Price Above</option>
                    <option value="below">Price Below</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="0.00"
                    className="w-full px-4 py-2 bg-gray-800 border border-linear-border rounded-lg text-gray-200 focus:outline-none focus:border-linear-accent"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-linear-accent rounded-lg text-white font-medium hover:bg-linear-accent-light transition-colors"
                >
                  Create Alert
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-800 rounded-lg text-gray-300 font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      {alerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alerts.map((alert) => {
            const coin = marketData.find(c => c.id === alert.coinId);
            const currentPrice = coin?.current_price || 0;
            const isTriggered = alert.triggered;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`glass-panel p-4 ${
                  isTriggered ? 'border-green-500/50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {coin && (
                      <img
                        src={coin.image}
                        alt={alert.coinName}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-100">{alert.coinName}</p>
                      <p className="text-xs text-gray-500 uppercase">{alert.coinSymbol}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(alert.id)}
                    className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Target:</span>
                    <span className="font-semibold text-gray-200">
                      {alert.type === 'above' ? '↑' : '↓'} {formatCurrency(alert.price, 'USD')}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current:</span>
                    <span className="font-semibold text-gray-200">
                      {formatCurrency(currentPrice, 'USD')}
                    </span>
                  </div>

                  {isTriggered && (
                    <div className="flex items-center space-x-2 mt-3 p-2 bg-green-500/10 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">
                        Alert Triggered!
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center">
          <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No alerts set yet</p>
          <p className="text-sm text-gray-600 mt-2">
            Create your first alert to get notified about price changes
          </p>
        </div>
      )}
    </motion.section>
  );
};

export default PriceAlerts;
