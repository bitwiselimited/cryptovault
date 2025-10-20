import React from 'react';
import BoomingCoins from './BoomingCoins';
import SafeInvestments from './SafeInvestments';
import NextBigThing from './NextBigThing';
import PriceAlerts from './PriceAlerts';
import Portfolio from './Portfolio';
import TrustedPlatforms from './TrustedPlatforms';

const Dashboard = ({
  marketData,
  inrRate,
  watchlist,
  onAddToWatchlist,
  onAddToPortfolio,
  onRequestNotification
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BoomingCoins
        marketData={marketData}
        inrRate={inrRate}
        watchlist={watchlist}
        onAddToWatchlist={onAddToWatchlist}
        onAddToPortfolio={onAddToPortfolio}
      />

      <SafeInvestments
        marketData={marketData}
        inrRate={inrRate}
        watchlist={watchlist}
        onAddToWatchlist={onAddToWatchlist}
        onAddToPortfolio={onAddToPortfolio}
      />

      <NextBigThing
        marketData={marketData}
        inrRate={inrRate}
        watchlist={watchlist}
        onAddToWatchlist={onAddToWatchlist}
      />

      <PriceAlerts
        marketData={marketData}
        onRequestNotification={onRequestNotification}
      />

      <Portfolio marketData={marketData} inrRate={inrRate} />

      <TrustedPlatforms />
    </div>
  );
};

export default Dashboard;
