import React from 'react'
import { motion } from 'framer-motion'
import { Building2, ExternalLink, Shield, Star } from 'lucide-react'

const platforms = [
  {
    name: 'WazirX',
    description: 'India\'s most trusted crypto exchange with INR support',
    features: ['Zero fees on INR deposits', 'P2P trading', 'High liquidity'],
    rating: 4.5,
    url: 'https://wazirx.com',
    logo: '🇮🇳',
  },
  {
    name: 'CoinDCX',
    description: 'India\'s safest crypto exchange, backed by leading investors',
    features: ['Low trading fees', 'Advanced trading tools', 'Mobile app'],
    rating: 4.3,
    url: 'https://coindcx.com',
    logo: '💎',
  },
  {
    name: 'ZebPay',
    description: 'Pioneer in Indian crypto market since 2014',
    features: ['Easy KYC', 'Instant withdrawals', 'Educational resources'],
    rating: 4.2,
    url: 'https://zebpay.com',
    logo: '⚡',
  },
  {
    name: 'Binance',
    description: 'World\'s largest crypto exchange with global reach',
    features: ['Massive coin selection', 'Low fees', 'Advanced features'],
    rating: 4.7,
    url: 'https://binance.com',
    logo: '🌍',
  },
  {
    name: 'CoinSwitch',
    description: 'Simple and user-friendly platform for beginners',
    features: ['Easy interface', 'SIP options', 'Portfolio tracker'],
    rating: 4.1,
    url: 'https://coinswitch.co',
    logo: '🔄',
  },
  {
    name: 'Mudrex',
    description: 'Automated crypto investing and trading platform',
    features: ['Algo trading', 'Coin sets', 'Tax reports'],
    rating: 4.0,
    url: 'https://mudrex.com',
    logo: '🤖',
  },
]

const TrustedPlatforms = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Trusted Platforms</h1>
        </div>
        <p className="text-gray-400">Best crypto exchanges available in India</p>
      </div>

      {/* Info Banner */}
      <div className="card-elevated rounded-xl p-6 border-l-4 border-blue-500">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white mb-1">Investment Safety Tips</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Always complete KYC verification before trading</li>
              <li>• Enable 2FA (Two-Factor Authentication) for security</li>
              <li>• Start with small investments to understand the platform</li>
              <li>• Never invest more than you can afford to lose</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="card-elevated rounded-xl p-6 transition-smooth group"
          >
            {/* Logo & Name */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{platform.logo}</div>
                <div>
                  <h3 className="font-bold text-white text-lg">{platform.name}</h3>
                  <div className="flex items-center space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(platform.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">{platform.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-4">{platform.description}</p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {platform.features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-smooth group-hover:shadow-lg"
            >
              <span>Visit Platform</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="card-elevated rounded-xl p-6 bg-yellow-500/5 border border-yellow-500/20">
        <p className="text-sm text-gray-400">
          <strong className="text-yellow-400">Disclaimer:</strong> Cryptocurrency investments are subject to market risks. 
          Please do your own research before investing. The platforms listed are for informational purposes only and 
          do not constitute financial advice.
        </p>
      </div>
    </motion.div>
  )
}

export default TrustedPlatforms
