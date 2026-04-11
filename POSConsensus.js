class POSConsensus {
  constructor() {
    this.validators = new Map();
    this.stakedAmount = new Map();
    this.currentValidator = null;
    this.minStake = 1000;
  }

  stakeValidator(address, amount) {
    if (amount < this.minStake) throw new Error('Minimum stake not met');
    this.validators.set(address, true);
    this.stakedAmount.set(address, (this.stakedAmount.get(address) || 0) + amount);
  }

  unstakeValidator(address, amount) {
    const current = this.stakedAmount.get(address) || 0;
    if (amount > current) throw new Error('Insufficient stake');
    const newStake = current - amount;
    this.stakedAmount.set(address, newStake);
    if (newStake < this.minStake) this.validators.delete(address);
  }

  selectValidator() {
    const active = Array.from(this.validators.keys());
    if (active.length === 0) throw new Error('No active validators');

    const totalStake = Array.from(this.stakedAmount.values()).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalStake;

    for (const addr of active) {
      random -= this.stakedAmount.get(addr);
      if (random <= 0) {
        this.currentValidator = addr;
        return addr;
      }
    }
    return active[0];
  }

  validateBlock(block) {
    if (!this.validators.has(block.validator)) return false;
    if (block.hash.substring(0, 2) !== '00') return false;
    return true;
  }

  rewardValidator(address, reward) {
    this.stakedAmount.set(address, (this.stakedAmount.get(address) || 0) + reward);
  }
}

module.exports = POSConsensus;
