import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Activity, Users, GitBranch, RefreshCw } from 'lucide-react'
import { useCryptoData } from '../hooks/useCryptoData'
import { analyzeNextBigThing } from '../utils/predictor'
import { useExchangeRate } from '../hooks/useExchangeRate'

const NextBigThingPredictor = () => {
  const { coins, loading, refetch } = useCryptoData()
  const { inrRate } = useExchangeRate()
  const [predictions, setPredictions] = useState([])
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    if (coins.length > 0) {
      analyzePredictions()
    }
  }, [coins])

  const analyzePredictions = async () => {
    setAnalyzing(true)
    // Simulate AI analysis delay
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
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          </motion.div>
          <p className="text-gray-400">Analyzing market trends...</p>
          <p className="text-sm text-gray-500 mt-2">AI prediction in progress</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Next Big Thing Predictor</h1>
          </div>
          <p className="text-gray-400">AI-powered analysis of emerging opportunities</p>
        </div>
        
        <button
          onClick={() => { refetch(); analyzePredictions(); }}
          className="p-2.5 rounded-lg bg-linear-dark-200 hover:bg-linear-hover transition-smooth"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Predictions */}
      <div className="space-y-4">
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
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-elevated rounded-xl p-6 relative overflow-hidden"
    >
      {/* Rank Badge */}
      <div className="absolute top-4 right-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
          index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
          'bg-linear-dark-200 text-gray-400'
        }`}>
          #{index + 1}
        </div>
      </div>

      <div className="flex items-start space-x-4 mb-6">
        <img src={coin.image} alt={coin.name} className="w-16 h-16 rounded-full ring-4 ring-purple-500/20" />
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{coin.name}</h3>
          <p className="text-gray-400 text-sm uppercase mb-2">{coin.symbol}</p>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              ₹{(coin.current_price * inrRate).toFixed(2)}
            </span>
            <span className={`text-sm ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {coin.price_change_percentage_24h > 0 ? '+' : ''}
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Prediction Score</span>
          <span className="text-lg font-bold text-purple-400">{score}/100</span>
        </div>
        <div className="w-full bg-linear-dark-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: index * 0.1 }}
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </div>

      {/* Reasons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {reasons.map((reason, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index * 0.1) + (idx * 0.05) }}
            className="flex items-start space-x-2 p-3 rounded-lg bg-linear-hover"
          >
            <div className="p-1.5 rounded-md bg-purple-500/20 mt-0.5">
              {getReasonIcon(reason.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-200">{reason.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function getReasonIcon(type) {
  const iconClass = "w-4 h-4 text-purple-400"
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

export default NextBigThingPredictor
