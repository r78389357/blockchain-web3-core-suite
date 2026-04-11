const axios = require('axios');

class GasPriceOracle {
  constructor() {
    this.rpcUrl = 'https://ethereum.publicnode.com';
    this.cache = { gas: null, timestamp: 0 };
    this.cacheTTL = 15000;
  }

  async fetchGasFromRPC() {
    const res = await axios.post(this.rpcUrl, {
      jsonrpc: '2.0',
      id: 2,
      method: 'eth_gasPrice'
    });
    return parseInt(res.data.result, 16);
  }

  async getGasPrice() {
    const now = Date.now();
    if (this.cache.gas && now - this.cache.timestamp < this.cacheTTL) {
      return this.cache.gas;
    }
    const gas = await this.fetchGasFromRPC();
    this.cache = { gas, timestamp: now };
    return gas;
  }

  async getFormattedGas() {
    const wei = await this.getGasPrice();
    const gwei = wei / 1e9;
    return {
      wei: wei.toString(),
      gwei: gwei.toFixed(2),
      timestamp: new Date().toISOString()
    };
  }

  estimateTransactionCost(gasLimit) {
    return this.getGasPrice().then(wei => (wei * gasLimit) / 1e18);
  }
}

module.exports = GasPriceOracle;
