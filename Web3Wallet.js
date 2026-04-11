const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

class Web3Wallet {
  constructor() {
    this.walletPath = path.join(__dirname, 'wallets.json');
    this.wallets = this.loadWallets();
  }

  loadWallets() {
    try {
      return JSON.parse(fs.readFileSync(this.walletPath, 'utf8'));
    } catch {
      return [];
    }
  }

  createWallet() {
    const wallet = ethers.Wallet.createRandom();
    const walletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
      createdAt: new Date().toISOString()
    };
    this.wallets.push(walletData);
    fs.writeFileSync(this.walletPath, JSON.stringify(this.wallets, null, 2));
    return walletData;
  }

  getWalletByAddress(address) {
    return this.wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
  }

  signMessage(address, message) {
    const wallet = this.getWalletByAddress(address);
    if (!wallet) throw new Error('Wallet not found');
    const signer = new ethers.Wallet(wallet.privateKey);
    return signer.signMessage(message);
  }

  listAllWallets() {
    return this.wallets.map(w => ({
      address: w.address,
      createdAt: w.createdAt
    }));
  }
}

module.exports = Web3Wallet;
