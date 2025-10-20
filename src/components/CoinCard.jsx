import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Star, Plus } from 'lucide-react';
import { formatCurrency, formatPercentage, getPercentageColor } from '../utils/helpers';

const CoinCard = ({ coin, inrRate, onAddToWatchlist, onAddToPortfolio, isWatched }) => {
  const priceUSD = coin.current_price;
  const priceINR = priceUSD * inrRate;
  const change24h = coin.price_change_percentage_24h || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(99, 102, 241, 0.15)' }}
      className="glass-panel p-5 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-100">{coin.name}</h3>
            <p className="text-sm text-gray-500 uppercase">{coin.symbol}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddToWatchlist(coin.id)}
            className={`p-2 rounded-lg transition-colors ${
              isWatched
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-linear-hover hover:bg-linear-border text-gray-400'
            }`}
          >
            <Star className="w-4 h-4" fill={isWatched ? 'currentColor' : 'none'} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddToPortfolio(coin)}
            className="p-2 rounded-lg bg-linear-accent/20 hover:bg-linear-accent/30 text-linear-accent-light transition-colors"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-gray-500 mb-1">Price (USD)</p>
          <p className="text-lg font-bold text-gray-100">
            {formatCurrency(priceUSD, 'USD')}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Price (INR)</p>
          <p className="text-lg font-bold text-gray-100">
            {formatCurrency(priceINR, 'INR')}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-linear-border">
          <div className="flex items-center space-x-1">
            {change24h >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${getPercentageColor(change24h)}`}>
              {formatPercentage(change24h)}
            </span>
          </div>

          <span className="text-xs text-gray-500">24h</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CoinCard;
