export const API_ENDPOINTS = {
  COINGECKO_MARKETS: 'https://api.coingecko.com/api/v3/coins/markets',
  COINGECKO_COIN: 'https://api.coingecko.com/api/v3/coins',
  EXCHANGE_RATE: 'https://api.exchangerate.host/latest',
};

export const TRUSTED_PLATFORMS = [
  {
    name: 'WazirX',
    logo: '🇮🇳',
    url: 'https://wazirx.com',
    description: 'India\'s most trusted crypto exchange',
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'CoinDCX',
    logo: '💎',
    url: 'https://coindcx.com',
    description: 'Trade with the largest Indian platform',
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'ZebPay',
    logo: '⚡',
    url: 'https://zebpay.com',
    description: 'Simple & secure crypto trading',
    color: 'from-green-500 to-green-600',
  },
  {
    name: 'Binance',
    logo: '🌐',
    url: 'https://www.binance.com',
    description: 'Global leader with Indian support',
    color: 'from-yellow-500 to-orange-500',
  },
];

export const REFRESH_INTERVAL = 180000; // 3 minutes
export const CACHE_DURATION = 120000; // 2 minutes
export const MAX_COINS_DISPLAY = 10;
export const PREDICTION_LOOKBACK_DAYS = 7;
