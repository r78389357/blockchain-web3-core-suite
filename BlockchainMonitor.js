const axios = require('axios');

class BlockchainMonitor {
  constructor(chain) {
    this.chain = chain;
    this.lastBlock = 0;
    this.alertThreshold = 1000000;
    this.alerts = [];
  }

  async getLatestBlock() {
    const res = await axios.post('https://ethereum.publicnode.com', {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_blockNumber'
    });
    return parseInt(res.data.result, 16);
  }

  async monitorBlocks() {
    const current = await this.getLatestBlock();
    if (this.lastBlock === 0) {
      this.lastBlock = current;
      return { status: 'Monitoring started', currentBlock: current };
    }

    const newBlocks = current - this.lastBlock;
    this.lastBlock = current;
    return { currentBlock: current, newBlocks };
  }

  checkLargeTransaction(txValue) {
    const value = parseInt(txValue, 16) / 1e18;
    if (value >= this.alertThreshold) {
      const alert = {
        type: 'LARGE_TX',
        value: `${value} ETH`,
        timestamp: new Date().toISOString()
      };
      this.alerts.push(alert);
      return alert;
    }
    return null;
  }

  getAlerts() {
    return this.alerts;
  }
}

module.exports = BlockchainMonitor;
