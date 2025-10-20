import React from 'react'
import { motion } from 'framer-motion'
import { Building2, ExternalLink, Shield, Star, Users, Lock, CheckCircle } from 'lucide-react'

const platforms = [
  {
    name: 'WazirX',
    description: 'India\'s most trusted crypto exchange with seamless INR deposits',
    rating: 4.5,
    users: '15M+',
    url: 'https://wazirx.com',
    features: ['Zero INR fees', 'P2P trading', 'High liquidity'],
    verified: true,
  },
  {
    name: 'CoinDCX',
    description: 'Safest exchange backed by leading global investors',
    rating: 4.3,
    users: '13M+',
    url: 'https://coindcx.com',
    features: ['Low fees 0.1%', 'Advanced tools', 'Insurance'],
    verified: true,
  },
  {
    name: 'ZebPay',
    description: 'Pioneer in Indian crypto market since 2014',
    rating: 4.2,
    users: '10M+',
    url: 'https://zebpay.com',
    features: ['Easy KYC', 'Instant withdrawals', '24/7 support'],
    verified: true,
  },
  {
    name: 'Binance',
    description: 'World\'s largest cryptocurrency exchange',
    rating: 4.7,
    users: '150M+',
    url: 'https://binance.com',
    features: ['500+ coins', 'Lowest fees', 'Futures trading'],
    verified: true,
  },
  {
    name: 'CoinSwitch',
    description: 'User-friendly platform for beginners',
    rating: 4.1,
    users: '18M+',
    url: 'https://coinswitch.co',
    features: ['Easy interface', 'SIP options', 'Tax calculator'],
    verified: true,
  },
  {
    name: 'Mudrex',
    description: 'Automated crypto investing platform',
    rating: 4.0,
    users: '5M+',
    url: 'https://mudrex.com',
    features: ['Algo trading', 'Auto rebalancing', 'Tax reports'],
    verified: true,
  },
]

const Platforms = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 py-6 max-w-6xl"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Trading Platforms</h1>
        <p className="text-xs text-secondary">Best crypto exchanges for Indian investors</p>
      </div>

      {/* Security Banner */}
      <div className="linear-card rounded-lg p-4 mb-6 border-l-2 border-accent-blue">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-accent-blue/10">
            <Shield className="w-4 h-4 text-accent-blue" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold mb-2">Safety Guidelines</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-secondary">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-3 h-3 text-accent-green" />
                <span>Complete KYC verification</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-3 h-3 text-accent-green" />
                <span>Enable 2FA security</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-3 h-3 text-accent-green" />
                <span>Start with small amounts</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-3 h-3 text-accent-green" />
                <span>Never invest more than you can lose</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="linear-card rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-semibold">{platform.name}</h3>
                  {platform.verified && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.08 + 0.2 }}
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-accent-blue" />
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{platform.rating}</span>
                  <span className="text-muted">•</span>
                  <Users className="w-3 h-3 text-muted" />
                  <span className="text-muted">{platform.users}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-secondary leading-relaxed mb-4">{platform.description}</p>

            <div className="space-y-1.5 mb-4">
              {platform.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 + idx * 0.05 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-1 h-1 rounded-full bg-accent-blue" />
                  <span className="text-xs text-secondary">{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full py-2.5 linear-button-primary"
            >
              <span>Visit Platform</span>
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="linear-card rounded-lg p-4 bg-yellow-500/5 border-l-2 border-yellow-500">
        <div className="flex items-start space-x-3">
          <Lock className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-yellow-500 mb-1">Disclaimer</p>
            <p className="text-xs text-secondary leading-relaxed">
              Cryptocurrency investments are subject to market risks and high volatility. The platforms listed are for informational purposes only and do not constitute financial advice. Always conduct your own research (DYOR) and consult with a financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Platforms
