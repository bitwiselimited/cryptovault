import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import CoinCard from './CoinCard';
import coinGeckoService from '../services/coinGeckoService';

const SafeInvestments = ({ marketData, inrRate, onAddToWatchlist, onAddToPortfolio, watchlist }) => {
  const [safeCoins, setSafeCoins] = React.useState([]);

  React.useEffect(() => {
    if (marketData.length) {
      coinGeckoService.getSafeInvestments(marketData).then(setSafeCoins);
    }
  }, [marketData]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Safe Investments</h2>
          <p className="text-sm text-gray-500">High market cap & low volatility</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {safeCoins.map((coin) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            inrRate={inrRate}
            onAddToWatchlist={onAddToWatchlist}
            onAddToPortfolio={onAddToPortfolio}
            isWatched={watchlist.includes(coin.id)}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default SafeInvestments;
