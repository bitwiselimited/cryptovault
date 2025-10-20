import React from 'react'
import { motion } from 'framer-motion'
import { Building2, ExternalLink, Shield, Star, CheckCircle, TrendingUp, Users, Lock } from 'lucide-react'

const platforms = [
  {
    name: 'WazirX',
    description: 'India\'s most trusted cryptocurrency exchange with seamless INR deposits',
    features: ['Zero fees on INR deposits', 'P2P trading available', 'High liquidity', 'Mobile app'],
    rating: 4.5,
    users: '15M+',
    url: 'https://wazirx.com',
    logo: '🇮🇳',
    verified: true,
    color: 'blue',
  },
  {
    name: 'CoinDCX',
    description: 'India\'s safest crypto exchange backed by leading global investors',
    features: ['Low trading fees (0.1%)', 'Advanced trading tools', 'Staking rewards', 'Insurance coverage'],
    rating: 4.3,
    users: '13M+',
    url: 'https://coindcx.com',
    logo: '💎',
    verified: true,
    color: 'purple',
  },
  {
    name: 'ZebPay',
    description: 'Pioneer in Indian crypto market since 2014 with strong security',
    features: ['Easy KYC process', 'Instant INR withdrawals', 'Educational resources', '24/7 support'],
    rating: 4.2,
    users: '10M+',
    url: 'https://zebpay.com',
    logo: '⚡',
    verified: true,
    color: 'cyan',
  },
  {
    name: 'Binance',
    description: 'World\'s largest cryptocurrency exchange with global reach',
    features: ['500+ cryptocurrencies', 'Lowest fees (0.1%)', 'Advanced features', 'Futures trading'],
    rating: 4.7,
    users: '150M+',
    url: 'https://binance.com',
    logo: '🌍',
    verified: true,
    color: 'yellow',
  },
  {
    name: 'CoinSwitch',
    description: 'Simple and user-friendly platform perfect for beginners',
    features: ['Easy interface', 'SIP investment options', 'Portfolio tracker', 'Tax calculator'],
    rating: 4.1,
    users: '18M+',
    url: 'https://coinswitch.co',
    logo: '🔄',
    verified: true,
    color: 'green',
  },
  {
    name: 'Mudrex',
    description: 'Automated crypto investing and algo trading platform',
    features: ['Algo trading bots', 'Crypto investment sets', 'Tax reports', 'Auto rebalancing'],
    rating: 4.0,
    users: '5M+',
    url: 'https://mudrex.com',
    logo: '🤖',
    verified: true,
    color: 'pink',
  },
]

const Platforms = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">Trusted Platforms</h1>
        </div>
        <p className="text-gray-400">Best cryptocurrency exchanges for Indian investors</p>
      </div>

      {/* Security Banner */}
      <div className="card-modern rounded-2xl p-6 lg:p-8 border-l-4 border-accent-blue">
        <div className="flex items-start space-x-5">
          <div className="p-3 rounded-xl bg-accent-blue/20">
            <Shield className="w-7 h-7 text-accent-blue" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-3">🔒 Investment Safety Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Complete KYC Verification</p>
                  <p className="text-sm text-gray-400">Always verify your identity before trading</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Enable Two-Factor Authentication</p>
                  <p className="text-sm text-gray-400">Add extra layer of security to your account</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Start with Small Investments</p>
                  <p className="text-sm text-gray-400">Learn the platform before investing big</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Never Invest More Than You Can Lose</p>
                  <p className="text-sm text-gray-400">Crypto markets are highly volatile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform, index) => (
          <PlatformCard key={platform.name} platform={platform} index={index} />
        ))}
      </div>

      {/* Comparison Table */}
      <div className="card-modern rounded-2xl p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Quick Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 font-bold">Platform</th>
                <th className="text-left py-4 px-4 font-bold">Trading Fee</th>
                <th className="text-left py-4 px-4 font-bold">Users</th>
                <th className="text-left py-4 px-4 font-bold">Rating</th>
                <th className="text-left py-4 px-4 font-bold">Best For</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((platform, index) => (
                <motion.tr
                  key={platform.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-white/5 hover:bg-white/5 smooth-transition"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{platform.logo}</span>
                      <span className="font-bold">{platform.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-400">0.1% - 0.5%</td>
                  <td className="py-4 px-4 font-semibold text-accent-cyan">{platform.users}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{platform.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    {index < 3 ? 'Indian Users' : index === 3 ? 'Advanced Traders' : 'Beginners'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card-modern rounded-2xl p-6 bg-yellow-500/5 border-2 border-yellow-500/20">
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-lg bg-yellow-500/20">
            <Shield className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-yellow-400">Important Disclaimer</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Cryptocurrency investments are subject to market risks and high volatility. The platforms listed are for informational purposes only and do not constitute financial advice. Always conduct your own research (DYOR) and consult with a financial advisor before making investment decisions. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PlatformCard({ platform, index }) {
  const colorClasses = {
    blue: 'from-accent-blue to-accent-blue/50',
    purple: 'from-accent-purple to-accent-purple/50',
    cyan: 'from-accent-cyan to-accent-cyan/50',
    yellow: 'from-yellow-500 to-orange-500',
    green: 'from-green-500 to-emerald-500',
    pink: 'from-pink-500 to-rose-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="card-modern rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
    >
      {/* Background gradient */}
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${colorClasses[platform.color]} opacity-10 rounded-full -mr-20 -mt-20 group-hover:opacity-20 smooth-transition`} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">{platform.logo}</div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-xl">{platform.name}</h3>
                {platform.verified && (
                  <CheckCircle className="w-5 h-5 text-accent-blue" />
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(platform.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-400">{platform.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Users Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-accent-cyan/20 mb-4">
          <Users className="w-4 h-4 text-accent-cyan" />
          <span className="text-sm font-bold text-accent-cyan">{platform.users} Users</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-5 leading-relaxed">{platform.description}</p>

        {/* Features */}
        <div className="space-y-2.5 mb-6">
          {platform.features.map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colorClasses[platform.color]}`} />
              <span className="text-sm text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center space-x-2 w-full py-3.5 px-4 bg-gradient-to-r ${colorClasses[platform.color]} text-white font-bold rounded-xl shadow-lg hover:shadow-xl smooth-transition group-hover:scale-105`}
        >
          <span>Visit Platform</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  )
}

export default Platforms
