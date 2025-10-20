import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, Activity, Users, GitBranch, RefreshCw, Target, Zap } from 'lucide-react'
import { useData } from '../context/DataContext'
import { analyzeNextBigThing } from '../utils/predictor'
import toast from 'react-hot-toast'

const Predictor = () => {
  const navigate = useNavigate()
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
    await new Promise(resolve => setTimeout(resolve, 1200))
    const results = analyzeNextBigThing(coins)
    setPredictions(results)
    setAnalyzing(false)
    toast.success('AI analysis complete')
  }

  if (loading || analyzing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-2 border-accent-purple border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-sm text-secondary">Analyzing market trends...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 py-6 max-w-5xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">AI Predictor</h1>
          <p className="text-xs text-secondary">Machine learning powered market analysis</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { refetch(); analyzePredictions(); }}
          className="flex items-center space-x-2 linear-button-primary"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-analyze</span>
        </motion.button>
      </div>

      {/* Info */}
      <div className="linear-card rounded-lg p-4 mb-6 border-l-2 border-accent-purple">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-accent-purple/10">
            <Target className="w-4 h-4 text-accent-purple" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold mb-2">AI Analysis Factors</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-secondary">
              <div className="flex items-center space-x-1.5">
                <Zap className="w-3 h-3 text-accent-blue" />
                <span>Volume surge detection</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <TrendingUp className="w-3 h-3 text-accent-green" />
                <span>Price momentum tracking</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Activity className="w-3 h-3 text-accent-purple" />
                <span>Volatility analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-3">
        {predictions.map((prediction, index) => (
          <PredictionCard
            key={prediction.coin.id}
            prediction={prediction}
            index={index}
            inrRate={inrRate}
            onClick={() => navigate(`/coin/${prediction.coin.id}`)}
          />
        ))}
      </div>
    </motion.div>
  )
}

function PredictionCard({ prediction, index, inrRate, onClick }) {
  const { coin, score, reasons } = prediction
  
  const badges = ['🥇 #1 Pick', '🥈 #2 Pick', '🥉 #3 Pick', '⭐ Notable', '💎 Potential']
  const isPositive = coin.price_change_percentage_24h > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="linear-card rounded-lg p-4 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative">
            <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full" />
            {index < 3 && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-semibold truncate">{coin.name}</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-accent-purple/10 text-accent-purple">
                {badges[index]}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-medium">₹{(coin.current_price * inrRate).toFixed(2)}</span>
              <span className={`${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
                {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-secondary mb-1">AI Score</p>
          <motion.p 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
            className={`text-2xl font-bold ${
              score >= 80 ? 'text-accent-green' :
              score >= 60 ? 'text-accent-blue' :
              'text-accent-purple'
            }`}
          >
            {score}
          </motion.p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: index * 0.1 }}
            className={`h-full rounded-full ${
              score >= 80 ? 'bg-accent-green' :
              score >= 60 ? 'bg-accent-blue' :
              'bg-accent-purple'
            }`}
          />
        </div>
      </div>

      {/* Reasons */}
      <div className="grid grid-cols-2 gap-2">
        {reasons.slice(0, 4).map((reason, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + idx * 0.05 }}
            className="flex items-start space-x-2"
          >
            <div className="mt-0.5 flex-shrink-0">{getReasonIcon(reason.type)}</div>
            <p className="text-xs text-secondary leading-relaxed">{reason.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function getReasonIcon(type) {
  const iconClass = "w-3 h-3 text-accent-purple"
  switch (type) {
    case 'volume': return <Activity className={iconClass} />
    case 'growth': return <TrendingUp className={iconClass} />
    case 'community': return <Users className={iconClass} />
    case 'development': return <GitBranch className={iconClass} />
    default: return <Sparkles className={iconClass} />
  }
}

export default Predictor
