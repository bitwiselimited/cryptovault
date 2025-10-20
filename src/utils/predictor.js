export function analyzeNextBigThing(coins) {
  const validCoins = coins.filter(coin => 
    coin.market_cap > 1000000 &&
    coin.total_volume > 0 &&
    coin.current_price > 0
  )

  const scoredCoins = validCoins.map(coin => {
    let score = 0
    const reasons = []

    // Volume Analysis (25 points)
    const volumeToMarketCap = coin.total_volume / coin.market_cap
    if (volumeToMarketCap > 0.3) {
      score += 25
      reasons.push({
        type: 'volume',
        text: `Exceptional volume: ${(volumeToMarketCap * 100).toFixed(1)}% of market cap`
      })
    } else if (volumeToMarketCap > 0.15) {
      score += 15
      reasons.push({
        type: 'volume',
        text: `High trading volume: ${(volumeToMarketCap * 100).toFixed(1)}%`
      })
    }

    // Price Momentum (30 points)
    const priceChange = coin.price_change_percentage_24h
    if (priceChange > 15) {
      score += 30
      reasons.push({
        type: 'growth',
        text: `Strong uptrend: +${priceChange.toFixed(1)}% in 24h`
      })
    } else if (priceChange > 7) {
      score += 20
      reasons.push({
        type: 'growth',
        text: `Positive momentum: +${priceChange.toFixed(1)}%`
      })
    } else if (priceChange > 3) {
      score += 10
    }

    // Market Cap Analysis (20 points)
    const marketCapB = coin.market_cap / 1e9
    if (marketCapB > 0.1 && marketCapB < 5) {
      score += 20
      reasons.push({
        type: 'community',
        text: `Growth stage: $${marketCapB.toFixed(2)}B market cap`
      })
    } else if (marketCapB >= 5 && marketCapB < 50) {
      score += 15
      reasons.push({
        type: 'community',
        text: `Established: $${marketCapB.toFixed(2)}B cap`
      })
    }

    // Volatility Score (15 points for controlled volatility)
    const volatility = Math.abs(priceChange)
    if (volatility < 8 && volatility > 2) {
      score += 15
      reasons.push({
        type: 'development',
        text: `Stable growth: ${volatility.toFixed(1)}% volatility`
      })
    } else if (volatility < 15) {
      score += 8
    }

    // Rank Bonus (10 points)
    if (coin.market_cap_rank <= 50) {
      score += 10
      reasons.push({
        type: 'community',
        text: `Top ${coin.market_cap_rank} by market cap`
      })
    } else if (coin.market_cap_rank <= 100) {
      score += 5
    }

    // Ensure minimum reasons
    while (reasons.length < 4) {
      if (reasons.length === 0) {
        reasons.push({
          type: 'development',
          text: `Rank #${coin.market_cap_rank} globally`
        })
      } else if (reasons.length === 1) {
        reasons.push({
          type: 'volume',
          text: `24h volume: $${(coin.total_volume / 1e9).toFixed(2)}B`
        })
      } else if (reasons.length === 2) {
        reasons.push({
          type: 'community',
          text: `Market cap: $${marketCapB.toFixed(2)}B`
        })
      } else {
        reasons.push({
          type: 'growth',
          text: `Current price: $${coin.current_price.toFixed(2)}`
        })
      }
    }

    return {
      coin,
      score: Math.min(100, Math.round(score)),
      reasons: reasons.slice(0, 4)
    }
  })

  return scoredCoins
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}
