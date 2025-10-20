class PredictionEngine {
  analyzeCoin(coin, historicalData = null) {
    const score = this.calculatePredictionScore(coin);
    const signals = this.generateSignals(coin);
    const confidence = this.calculateConfidence(coin, signals);
    
    return {
      coin,
      score,
      signals,
      confidence,
      recommendation: this.getRecommendation(score, confidence),
    };
  }

  calculatePredictionScore(coin) {
    let score = 0;
    const weights = {
      priceChange7d: 0.25,
      volumeChange: 0.25,
      marketCapRank: 0.15,
      consistency: 0.20,
      community: 0.15,
    };

    // 1. Price trend (7-day growth)
    const priceChange7d = coin.price_change_percentage_7d_in_currency || 0;
    if (priceChange7d > 0 && priceChange7d < 50) {
      score += (priceChange7d / 50) * weights.priceChange7d * 100;
    }

    // 2. Volume momentum
    const volumeChange = coin.total_volume / (coin.market_cap / 100);
    if (volumeChange > 2 && volumeChange < 15) {
      score += ((volumeChange - 2) / 13) * weights.volumeChange * 100;
    }

    // 3. Market cap rank (lower is better, top 200)
    if (coin.market_cap_rank && coin.market_cap_rank <= 200) {
      score += ((200 - coin.market_cap_rank) / 200) * weights.marketCapRank * 100;
    }

    // 4. Price consistency (reward steady growth over spikes)
    const priceChange24h = coin.price_change_percentage_24h || 0;
    const consistency = this.calculateConsistency(priceChange24h, priceChange7d);
    score += consistency * weights.consistency * 100;

    // 5. Community strength (based on market cap and volume ratio)
    const liquidityRatio = coin.total_volume / coin.market_cap;
    if (liquidityRatio > 0.05 && liquidityRatio < 0.3) {
      score += ((liquidityRatio - 0.05) / 0.25) * weights.community * 100;
    }

    return Math.min(Math.max(score, 0), 100);
  }

  calculateConsistency(change24h, change7d) {
    if (change24h <= 0 || change7d <= 0) return 0;
    
    // Ideal: 7-day change is proportional to 24h change (steady growth)
    const expectedDaily = change7d / 7;
    const variance = Math.abs(change24h - expectedDaily) / expectedDaily;
    
    // Lower variance = higher consistency
    return Math.max(0, 1 - (variance / 2));
  }

  generateSignals(coin) {
    const signals = [];
    
    const priceChange7d = coin.price_change_percentage_7d_in_currency || 0;
    const priceChange24h = coin.price_change_percentage_24h || 0;
    const volumeRatio = (coin.total_volume / coin.market_cap) * 100;

    // Volume surge signal
    if (volumeRatio > 10) {
      signals.push({
        type: 'volume',
        strength: 'strong',
        message: `+${volumeRatio.toFixed(0)}% volume surge - High trading activity`,
      });
    } else if (volumeRatio > 5) {
      signals.push({
        type: 'volume',
        strength: 'moderate',
        message: `+${volumeRatio.toFixed(0)}% volume increase`,
      });
    }

    // Consistent growth signal
    if (priceChange7d > 0 && priceChange24h > 0) {
      const avgDaily = priceChange7d / 7;
      if (priceChange24h >= avgDaily * 0.7 && priceChange24h <= avgDaily * 1.5) {
        signals.push({
          type: 'consistency',
          strength: 'strong',
          message: 'Steady 7-day growth pattern detected',
        });
      }
    }

    // Momentum signal
    if (priceChange7d > 15 && priceChange7d < 60) {
      signals.push({
        type: 'momentum',
        strength: 'strong',
        message: `${priceChange7d.toFixed(1)}% gain in 7 days - Strong uptrend`,
      });
    }

    // Market position signal
    if (coin.market_cap_rank && coin.market_cap_rank <= 50) {
      signals.push({
        type: 'position',
        strength: 'strong',
        message: `Top ${coin.market_cap_rank} by market cap - Established asset`,
      });
    } else if (coin.market_cap_rank <= 150) {
      signals.push({
        type: 'position',
        strength: 'moderate',
        message: `Rank #${coin.market_cap_rank} - Growing presence`,
      });
    }

    return signals;
  }

  calculateConfidence(coin, signals) {
    let confidence = 50; // Base confidence

    // Increase based on number of positive signals
    confidence += signals.length * 8;

    // Boost for strong signals
    const strongSignals = signals.filter(s => s.strength === 'strong').length;
    confidence += strongSignals * 7;

    // Market cap factor (higher cap = more confidence)
    if (coin.market_cap > 10000000000) confidence += 10; // >$10B
    else if (coin.market_cap > 1000000000) confidence += 5; // >$1B

    // Volatility penalty
    const priceChange24h = Math.abs(coin.price_change_percentage_24h || 0);
    if (priceChange24h > 20) confidence -= 15;
    else if (priceChange24h > 10) confidence -= 7;

    return Math.min(Math.max(confidence, 0), 100);
  }

  getRecommendation(score, confidence) {
    if (score >= 70 && confidence >= 70) {
      return { level: 'strong', text: 'Strong Buy Signal', color: 'green' };
    } else if (score >= 55 && confidence >= 60) {
      return { level: 'moderate', text: 'Potential Opportunity', color: 'blue' };
    } else if (score >= 40) {
      return { level: 'watch', text: 'Monitor Closely', color: 'yellow' };
    } else {
      return { level: 'weak', text: 'Low Confidence', color: 'gray' };
    }
  }

  async predictNextBigThings(marketData) {
    const predictions = marketData
      .map(coin => this.analyzeCoin(coin))
      .filter(p => p.score >= 40 && p.confidence >= 50)
      .sort((a, b) => {
        // Sort by weighted score and confidence
        const scoreA = (a.score * 0.6) + (a.confidence * 0.4);
        const scoreB = (b.score * 0.6) + (b.confidence * 0.4);
        return scoreB - scoreA;
      })
      .slice(0, 5);

    return predictions;
  }
}

export default new PredictionEngine();
