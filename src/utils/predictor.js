export function analyzeNextBigThing(coins) {
  // Filter coins with sufficient data
  const validCoins = coins.filter(coin => 
    coin.market_cap > 1000000 && // At least $1M market cap
    coin.total_volume > 0 &&
    coin.current_price > 0
  )

  // Score each coin
  const scoredCoins = validCoins.map(coin => {
    let score = 0
    const reasons = []

    // Volume surge (20 points)
    const volumeToMarketCap = coin.total_volume / coin.market_cap
    if (volumeToMarketCap > 0.2) {
      score += 20
      reasons.push({
        type: 'volume',
        text: `High volume ratio: ${(volumeToMarketCap * 100).toFixed(1)}% of market cap`
      })
    } else if (volumeToMarketCap > 0.1) {
      score += 10
    }

    // Price momentum (25 points)
    if (coin.price_change_percentage_24h > 10) {
      score += 25
      reasons.push({
        type: 'growth',
        text: `Strong 24h growth: +${coin.price_change_percentage_24h.toFixed(1)}%`
      })
    } else if (coin.price_change_percentage_24h > 5) {
      score += 15
      reasons.push({
        type: 'growth',
        text: `Positive momentum: +${coin.price_change_percentage_24h.toFixed(1)}%`
      })
    } else if (coin.price_change_percentage_24h > 0) {
      score += 5
    }

    // Market cap sweet spot (15 points)
    const marketCapB = coin.market_cap / 1e9
    if (marketCapB > 0.1 && marketCapB < 10) {
      score += 15
      reasons.push({
        type: 'community',
        text: `Optimal size: $${marketCapB.toFixed(2)}B market cap`
      })
    } else if (marketCapB >= 10 && marketCapB < 50) {
      score += 10
    }

    // Volatility check (20 points for low volatility)
    const volatility = Math.abs(coin.price_change_percentage_24h)
    if (volatility < 5) {
      score += 20
      reasons.push({
        type: 'development',
        text: `Low volatility: ${volatility.toFixed(1)}% (stable)`
      })
    } else if (volatility < 10) {
      score += 10
      reasons.push({
        type: 'development',
        text: `Moderate volatility: ${volatility.toFixed(1)}%`
      })
    }

    // Rank bonus (20 points)
    if (coin.market_cap_rank <= 100) {
      const rankScore = Math.max(0, 20 - (coin.market_cap_rank / 5))
      score += rankScore
      if (coin.market_cap_rank <= 50) {
        reasons.push({
          type: 'community',
          text: `Top ${coin.market_cap_rank} by market cap`
        })
      }
    }

    // Ensure at least 3 reasons
    if (reasons.length < 3) {
      reasons.push({
        type: 'development',
        text: `Market rank: #${coin.market_cap_rank}`
      })
    }
    if (reasons.length < 3) {
      reasons.push({
        type: 'volume',
        text: `24h volume: $${(coin.total_volume / 1e9).toFixed(2)}B`
      })
    }

    return {
      coin,
      score: Math.min(100, Math.round(score)),
      reasons: reasons.slice(0, 4)
    }
  })

  // Sort by score and return top 5
  return scoredCoins
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

export function calculateVolatility(priceChanges) {
  if (!priceChanges || priceChanges.length === 0) return 0
  
  const mean = priceChanges.reduce((a, b) => a + b, 0) / priceChanges.length
  const variance = priceChanges.reduce((sum, change) => {
    return sum + Math.pow(change - mean, 2)
  }, 0) / priceChanges.length
  
  return Math.sqrt(variance)
}
