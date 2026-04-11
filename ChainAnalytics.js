class ChainAnalytics {
  constructor() {
    this.transactionHistory = [];
    this.blockStats = [];
  }

  logTransaction(tx) {
    this.transactionHistory.push({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      gasPrice: tx.gasPrice,
      timestamp: Date.now()
    });
  }

  logBlock(block) {
    this.blockStats.push({
      number: block.number,
      txCount: block.transactions.length,
      miner: block.miner,
      timestamp: block.timestamp
    });
  }

  getDailyVolume() {
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return this.transactionHistory
      .filter(tx => tx.timestamp >= dayAgo)
      .reduce((sum, tx) => sum + parseFloat(tx.value || 0), 0)
      .toFixed(4);
  }

  getAverageBlockTime() {
    if (this.blockStats.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < this.blockStats.length; i++) {
      total += this.blockStats[i].timestamp - this.blockStats[i - 1].timestamp;
    }
    return (total / (this.blockStats.length - 1)).toFixed(2);
  }

  getTopMiners(limit = 5) {
    const miners = {};
    this.blockStats.forEach(b => {
      miners[b.miner] = (miners[b.miner] || 0) + 1;
    });
    return Object.entries(miners)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }
}

module.exports = ChainAnalytics;
