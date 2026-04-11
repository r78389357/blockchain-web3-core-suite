class Web3Dashboard {
  constructor() {
    this.widgets = ['balance', 'transactions', 'nfts', 'staking', 'governance'];
    this.userSettings = new Map();
    this.chainPresets = ['ethereum', 'bsc', 'polygon'];
  }

  getUserDashboard(address) {
    const user = address.toLowerCase();
    return this.userSettings.get(user) || {
      theme: 'dark',
      defaultChain: 'ethereum',
      enabledWidgets: this.widgets,
      currency: 'USD'
    };
  }

  updateSettings(address, settings) {
    const user = address.toLowerCase();
    const current = this.getUserDashboard(address);
    const updated = { ...current, ...settings };
    this.userSettings.set(user, updated);
    return updated;
  }

  generateDashboardData(address) {
    return {
      address,
      chain: this.getUserDashboard(address).defaultChain,
      walletBalance: (Math.random() * 10).toFixed(4),
      recentTransactions: Math.floor(Math.random() * 20),
      nftCount: Math.floor(Math.random() * 50),
      stakedAmount: (Math.random() * 5).toFixed(4),
      pendingRewards: (Math.random() * 0.5).toFixed(4),
      lastUpdated: new Date().toISOString()
    };
  }

  getSupportedChains() {
    return this.chainPresets;
  }
}

module.exports = Web3Dashboard;
