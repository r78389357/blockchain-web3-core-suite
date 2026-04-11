class TransactionMempool {
  constructor() {
    this.pendingTxs = [];
    this.maxSize = 1000;
    this.minGasPrice = 1000000000;
  }

  addTransaction(tx) {
    if (this.pendingTxs.length >= this.maxSize) throw new Error('Mempool full');
    if (tx.gasPrice < this.minGasPrice) throw new Error('Gas price too low');
    if (!tx.from || !tx.to || !tx.value || !tx.gasPrice) throw new Error('Invalid transaction');

    const exists = this.pendingTxs.some(t => t.hash === tx.hash);
    if (exists) throw new Error('Transaction already exists');

    this.pendingTxs.push(tx);
    this.pendingTxs.sort((a, b) => b.gasPrice - a.gasPrice);
    return true;
  }

  getTopTransactions(limit = 10) {
    return this.pendingTxs.slice(0, limit);
  }

  removeTransaction(txHash) {
    const index = this.pendingTxs.findIndex(t => t.hash === txHash);
    if (index === -1) return false;
    this.pendingTxs.splice(index, 1);
    return true;
  }

  clearMempool() {
    this.pendingTxs = [];
  }

  getMempoolSize() {
    return this.pendingTxs.length;
  }
}

module.exports = TransactionMempool;
