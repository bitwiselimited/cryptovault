import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import CoinCard from './CoinCard';
import coinGeckoService from '../services/coinGeckoService';

const BoomingCoins = ({ marketData, inrRate, onAddToWatchlist, onAddToPortfolio, watchlist }) => {
  const [boomingCoins, setBoomingCoins] = React.useState([]);

  React.useEffect(() => {
    if (marketData.length) {
      coinGeckoService.getBoomingCoins(marketData).then(setBoomingCoins);
    }
  }, [marketData]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Booming Coins</h2>
          <p className="text-sm text-gray-500">Highest gains & volume surge in 24h</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {boomingCoins.map((coin) => (
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

export default BoomingCoins;
