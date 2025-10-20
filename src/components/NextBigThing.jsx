import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Activity, Users } from 'lucide-react';
import predictionEngine from '../services/predictionEngine';
import { formatCurrency, formatPercentage } from '../utils/helpers';

const NextBigThing = ({ marketData, inrRate, onAddToWatchlist, watchlist }) => {
  const [predictions, setPredictions] = React.useState([]);

  React.useEffect(() => {
    if (marketData.length) {
      predictionEngine.predictNextBigThings(marketData).then(setPredictions);
    }
  }, [marketData]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 75) return 'text-green-400';
    if (confidence >= 60) return 'text-blue-400';
    return 'text-yellow-400';
  };

  const getRecommendationColor = (level) => {
    const colors = {
      strong: 'from-green-500 to-emerald-500',
      moderate: 'from-blue-500 to-indigo-500',
      watch: 'from-yellow-500 to-orange-500',
      weak: 'from-gray-500 to-gray-600',
    };
    return colors[level] || colors.weak;
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg animate-pulse-glow">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold gradient-text">Next Big Thing Predictor</h2>
          <p className="text-sm text-gray-500">AI-powered predictions based on momentum & growth</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {predictions.map((prediction, index) => {
          const { coin, score, signals, confidence, recommendation } = prediction;
          
          return (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="predictor-glow glass-panel p-6 relative overflow-hidden"
            >
              {/* Rank Badge */}
              <div className="absolute top-4 right-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-linear-accent to-linear-accent-light flex items-center justify-center font-bold text-white">
                  #{index + 1}
                </div>
              </div>

              {/* Coin Info */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-100">{coin.name}</h3>
                  <p className="text-sm text-gray-500 uppercase">{coin.symbol}</p>
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current Price</p>
                  <p className="text-sm font-semibold text-gray-200">
                    {formatCurrency(coin.current_price, 'USD')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatCurrency(coin.current_price * inrRate, 'INR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">7-Day Change</p>
                  <p className={`text-sm font-semibold ${
                    coin.price_change_percentage_7d_in_currency >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    {formatPercentage(coin.price_change_percentage_7d_in_currency || 0)}
                  </p>
                </div>
              </div>

              {/* Prediction Score */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Prediction Score</span>
                  <span className="text-sm font-bold text-linear-accent-light">
                    {score.toFixed(0)}/100
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-linear-accent to-linear-accent-light"
                  />
                </div>
              </div>

              {/* Confidence */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Confidence Level</span>
                  <span className={`text-sm font-bold ${getConfidenceColor(confidence)}`}>
                    {confidence.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                    className={`h-full bg-gradient-to-r ${
                      confidence >= 75
                        ? 'from-green-500 to-emerald-500'
                        : confidence >= 60
                        ? 'from-blue-500 to-indigo-500'
                        : 'from-yellow-500 to-orange-500'
                    }`}
                  />
                </div>
              </div>

              {/* Recommendation */}
              <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${getRecommendationColor(recommendation.level)} bg-opacity-10`}>
                <p className="text-xs font-semibold text-center text-gray-100">
                  {recommendation.text}
                </p>
              </div>

              {/* Signals */}
              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500 font-medium mb-2">Key Signals:</p>
                {signals.slice(0, 3).map((signal, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2 text-xs"
                  >
                    {signal.type === 'volume' && <Activity className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                    {signal.type === 'momentum' && <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />}
                    {signal.type === 'consistency' && <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />}
                    {signal.type === 'position' && <Users className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
                    <span className="text-gray-300 leading-tight">{signal.message}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAddToWatchlist(coin.id)}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                  watchlist.includes(coin.id)
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-linear-accent/20 text-linear-accent-light hover:bg-linear-accent/30'
                }`}
              >
                {watchlist.includes(coin.id) ? '⭐ In Watchlist' : '+ Add to Watchlist'}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default NextBigThing;
