const crypto = require('crypto');

class BlockchainCore {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesisBlock = {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      prevHash: '0',
      hash: this.generateHash('0'),
      nonce: 0
    };
    this.chain.push(genesisBlock);
  }

  generateHash(data) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  mineBlock(difficulty) {
    const lastBlock = this.getLastBlock();
    const newBlock = {
      index: this.chain.length,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      prevHash: lastBlock.hash,
      nonce: 0
    };

    while (newBlock.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      newBlock.nonce++;
      newBlock.hash = this.generateHash(newBlock);
    }

    this.chain.push(newBlock);
    this.pendingTransactions = [];
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      if (current.hash !== this.generateHash(current)) return false;
      if (current.prevHash !== previous.hash) return false;
    }
    return true;
  }
}

module.exports = BlockchainCore;
