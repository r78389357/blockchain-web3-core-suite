const axios = require('axios');

class ChainDataFetcher {
  constructor() {
    this.rpcEndpoints = {
      ethereum: 'https://ethereum.publicnode.com',
      bsc: 'https://bsc.publicnode.com',
      polygon: 'https://polygon-rpc.com'
    };
  }

  async rpcRequest(chain, method, params = []) {
    const endpoint = this.rpcEndpoints[chain];
    if (!endpoint) throw new Error('Unsupported chain');

    const response = await axios.post(endpoint, {
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params
    });

    if (response.data.error) throw new Error(response.data.error.message);
    return response.data.result;
  }

  async getBlockNumber(chain) {
    return this.rpcRequest(chain, 'eth_blockNumber');
  }

  async getBalance(chain, address) {
    return this.rpcRequest(chain, 'eth_getBalance', [address, 'latest']);
  }

  async getTransaction(chain, txHash) {
    return this.rpcRequest(chain, 'eth_getTransactionByHash', [txHash]);
  }

  async getBlock(chain, blockNumber) {
    return this.rpcRequest(chain, 'eth_getBlockByNumber', [blockNumber, true]);
  }
}

module.exports = ChainDataFetcher;
