import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import storageService from '../services/storageService';
import { formatCurrency, formatPercentage } from '../utils/helpers';

const Portfolio = ({ marketData, inrRate }) => {
  const [portfolio, setPortfolio] = useState(storageService.getPortfolio());
  const [totalValue, setTotalValue] = useState({ usd: 0, inr: 0 });
  const [totalPnL, setTotalPnL] = useState({ usd: 0, inr: 0, percentage: 0 });

  useEffect(() => {
    if (!marketData.length || !portfolio.length) return;

    let valueUSD = 0;
    let investedUSD = 0;

    portfolio.forEach((holding) => {
      const coin = marketData.find((c) => c.id === holding.id);
      if (coin) {
        const currentValue = coin.current_price * holding.amount;
        valueUSD += currentValue;
        investedUSD += holding.totalInvested;
      }
    });

    const valueINR = valueUSD * inrRate;
    const pnlUSD = valueUSD - investedUSD;
    const pnlINR = pnlUSD * inrRate;
    const pnlPercentage = investedUSD > 0 ? (pnlUSD / investedUSD) * 100 : 0;

    setTotalValue({ usd: valueUSD, inr: valueINR });
    setTotalPnL({ usd: pnlUSD, inr: pnlINR, percentage: pnlPercentage });
  }, [marketData, portfolio, inrRate]);

  const handleRemove = (coinId) => {
    const updated = storageService.removeFromPortfolio(coinId);
    setPortfolio(updated);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-100">My Portfolio</h2>
          <p className="text-sm text-gray-500">Track your crypto investments</p>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-panel p-6">
          <p className="text-sm text-gray-400 mb-2">Total Value (USD)</p>
          <p className="text-2xl font-bold text-gray-100">
            {formatCurrency(totalValue.usd, 'USD')}
          </p>
        </div>

        <div className="glass-panel p-6">
          <p className="text-sm text-gray-400 mb-2">Total Value (INR)</p>
          <p className="text-2xl font-bold text-gray-100">
            {formatCurrency(totalValue.inr, 'INR')}
          </p>
        </div>

        <div className="glass-panel p-6">
          <p className="text-sm text-gray-400 mb-2">Total P&L</p>
          <div className="flex items-center space-x-2">
            {totalPnL.percentage >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <p
              className={`text-2xl font-bold ${
                totalPnL.percentage >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatPercentage(totalPnL.percentage)}
            </p>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {formatCurrency(totalPnL.usd, 'USD')}
          </p>
        </div>
      </div>

      {/* Holdings */}
      {portfolio.length > 0 ? (
        <div className="space-y-3">
          {portfolio.map((holding) => {
            const coin = marketData.find((c) => c.id === holding.id);
            if (!coin) return null;

            const currentValue = coin.current_price * holding.amount;
            const pnl = currentValue - holding.totalInvested;
            const pnlPercentage = (pnl / holding.totalInvested) * 100;

            return (
              <motion.div
                key={holding.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-10 h-10 rounded-full"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-100">{coin.name}</h3>
                        <span className="text-xs text-gray-500 uppercase">
                          {coin.symbol}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {holding.amount.toFixed(6)} coins @ {formatCurrency(holding.totalInvested / holding.amount, 'USD')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right mr-4">
                    <p className="text-sm font-semibold text-gray-200">
                      {formatCurrency(currentValue, 'USD')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatCurrency(currentValue * inrRate, 'INR')}
                    </p>
                    <p
                      className={`text-sm font-medium mt-1 ${
                        pnl >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {formatPercentage(pnlPercentage)} ({formatCurrency(pnl, 'USD')})
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemove(holding.id)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center">
          <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Your portfolio is empty</p>
          <p className="text-sm text-gray-600 mt-2">
            Add coins to track your investments
          </p>
        </div>
      )}
    </motion.section>
  );
};

export default Portfolio;
