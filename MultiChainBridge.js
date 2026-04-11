class MultiChainBridge {
  constructor() {
    this.supportedChains = ['ETH', 'BSC', 'POLYGON', 'AVALANCHE'];
    this.bridgeRecords = [];
    this.feePercentage = 0.1;
  }

  initiateBridge(params) {
    const { fromChain, toChain, user, token, amount } = params;
    if (!this.supportedChains.includes(fromChain) || !this.supportedChains.includes(toChain)) {
      throw new Error('Unsupported chain');
    }

    const fee = (amount * this.feePercentage) / 100;
    const receiveAmount = amount - fee;
    const bridgeId = `BRIDGE_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const record = {
      bridgeId,
      fromChain,
      toChain,
      user,
      token,
      amount,
      fee,
      receiveAmount,
      status: 'PENDING',
      timestamp: new Date().toISOString()
    };

    this.bridgeRecords.push(record);
    return record;
  }

  completeBridge(bridgeId) {
    const record = this.bridgeRecords.find(r => r.bridgeId === bridgeId);
    if (!record) throw new Error('Bridge record not found');
    if (record.status !== 'PENDING') throw new Error('Invalid status');
    record.status = 'COMPLETED';
    record.completedAt = new Date().toISOString();
    return record;
  }

  getUserBridges(user) {
    return this.bridgeRecords.filter(r => r.user.toLowerCase() === user.toLowerCase());
  }

  getBridgeById(bridgeId) {
    return this.bridgeRecords.find(r => r.bridgeId === bridgeId);
  }
}

module.exports = MultiChainBridge;
