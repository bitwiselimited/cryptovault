import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Activity, Users, GitBranch, RefreshCw, Zap, Target } from 'lucide-react'
import { useData } from '../context/DataContext'
import { analyzeNextBigThing } from '../utils/predictor'

const Predictor = () => {
  const { coins, inrRate, loading, refetch } = useData()
  const [predictions, setPredictions] = useState([])
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    if (coins.length > 0) {
      analyzePredictions()
    }
  }, [coins])

  const analyzePredictions = async () => {
    setAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const results = analyzeNextBigThing(coins)
    setPredictions(results)
    setAnalyzing(false)
  }

  if (loading || analyzing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-96"
      >
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <p className="text-2xl font-bold mb-2 gradient-text">AI Analysis in Progress</p>
          <p className="text-gray-400">Scanning market trends and patterns...</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-glow-purple">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">Next Big Thing Predictor</h1>
          </div>
          <p className="text-gray-400 flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>AI-powered analysis of emerging crypto opportunities</span>
          </p>
        </div>
        
        <button
          onClick={() => { refetch(); analyzePredictions(); }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-brand rounded-xl font-semibold shadow-lg hover:shadow-glow-purple smooth-transition"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Re-analyze</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className="card-modern rounded-2xl p-6 border-l-4 border-accent-purple">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-accent-purple/20">
            <Target className="w-6 h-6 text-accent-purple" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">How Our AI Prediction Works</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                <span><strong className="text-white">Volume Analysis:</strong> Identifies coins with increasing trading activity</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                <span><strong className="text-white">Price Momentum:</strong> Tracks consistent growth patterns</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                <span><strong className="text-white">Stability Score:</strong> Measures volatility and market confidence</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-6">
        {predictions.map((prediction, index) => (
          <PredictionCard
            key={prediction.coin.id}
            prediction={prediction}
            index={index}
            inrRate={inrRate}
          />
        ))}
      </div>
    </motion.div>
  )
}

function PredictionCard({ prediction, index, inrRate }) {
  const { coin, score, reasons } = prediction
  
  const badges = [
    { label: '🥇 Top Pick', color: 'from-yellow-400 to-orange-500' },
    { label: '🥈 Strong Potential', color: 'from-gray-300 to-gray-400' },
    { label: '🥉 Good Prospect', color: 'from-orange-400 to-orange-600' },
    { label: '⭐ Notable', color: 'from-accent-blue to-accent-purple' },
    { label: '💎 Hidden Gem', color: 'from-accent-cyan to-accent-blue' },
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, type: 'spring' }}
      className="card-modern rounded-2xl p-6 lg:p-8 relative overflow-hidden group"
    >
      {/* Animated background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${
          index === 0 ? 'from-yellow-500/10 to-orange-500/5' :
          index === 1 ? 'from-purple-500/10 to-pink-500/5' :
          'from-blue-500/10 to-cyan-500/5'
        } opacity-0 group-hover:opacity-100 smooth-transition`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img 
                src={coin.image} 
                alt={coin.name} 
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full ring-4 ring-accent-purple/30 group-hover:ring-accent-purple/60 smooth-transition" 
              />
              <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-lg bg-gradient-to-r ${badges[index].color} text-white text-xs font-bold shadow-lg`}>
                #{index + 1}
              </div>
            </div>
            
            <div className="flex-1">
              <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${badges[index].color} text-white text-sm font-bold mb-2`}>
                {badges[index].label}
              </div>
              <h3 className="text-2xl font-bold mb-1">{coin.name}</h3>
              <p className="text-gray-400 text-sm uppercase font-semibold tracking-wide mb-3">{coin.symbol}</p>
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold">
                  ₹{(coin.current_price * inrRate).toFixed(2)}
                </span>
                <span className={`px-3 py-1 rounded-lg font-bold ${
                  coin.price_change_percentage_24h > 0 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {coin.price_change_percentage_24h > 0 ? '+' : ''}
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">AI Confidence Score</span>
            <span className="text-2xl font-bold gradient-text">{score}/100</span>
          </div>
          <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.5, delay: index * 0.1, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${
                score >= 80 ? 'from-green-500 to-emerald-400' :
                score >= 60 ? 'from-accent-blue to-accent-cyan' :
                'from-accent-purple to-accent-pink'
              } relative`}
            >
              <motion.div
                animate={{ x: [0, 100, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* Analysis Reasons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index * 0.1) + (idx * 0.08) }}
              className="flex items-start space-x-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 smooth-transition border border-white/5"
            >
              <div className="p-2 rounded-lg bg-gradient-brand/20">
                {getReasonIcon(reason.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-relaxed">{reason.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function getReasonIcon(type) {
  const iconClass = "w-5 h-5 text-accent-blue"
  switch (type) {
    case 'volume':
      return <Activity className={iconClass} />
    case 'growth':
      return <TrendingUp className={iconClass} />
    case 'community':
      return <Users className={iconClass} />
    case 'development':
      return <GitBranch className={iconClass} />
    default:
      return <Sparkles className={iconClass} />
  }
}

export default Predictor
