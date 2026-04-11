class TokenStakingContract {
  constructor() {
    this.stakers = new Map();
    this.rewardRate = 5;
    this.stakeDuration = 30 * 24 * 60 * 60;
    this.totalStaked = 0;
  }

  stake(address, amount) {
    if (amount <= 0) throw new Error('Invalid stake amount');
    const current = this.stakers.get(address) || { amount: 0, startTime: 0, rewards: 0 };
    if (current.amount === 0) {
      current.startTime = Math.floor(Date.now() / 1000);
    }
    current.amount += amount;
    this.stakers.set(address, current);
    this.totalStaked += amount;
    return { success: true, stakedAmount: current.amount };
  }

  calculateRewards(address) {
    const staker = this.stakers.get(address);
    if (!staker) return 0;
    const now = Math.floor(Date.now() / 1000);
    const duration = now - staker.startTime;
    if (duration < this.stakeDuration) return 0;
    const reward = (staker.amount * this.rewardRate * duration) / (365 * 24 * 60 * 60 * 100);
    return parseFloat(reward.toFixed(4));
  }

  claimRewards(address) {
    const reward = this.calculateRewards(address);
    if (reward <= 0) throw new Error('No rewards available');
    const staker = this.stakers.get(address);
    staker.rewards += reward;
    staker.startTime = Math.floor(Date.now() / 1000);
    this.stakers.set(address, staker);
    return { claimed: reward, totalRewards: staker.rewards };
  }

  unstake(address, amount) {
    const staker = this.stakers.get(address);
    if (!staker || staker.amount < amount) throw new Error('Insufficient staked balance');
    staker.amount -= amount;
    this.totalStaked -= amount;
    if (staker.amount === 0) staker.startTime = 0;
    this.stakers.set(address, staker);
    return { success: true, remaining: staker.amount };
  }
}

module.exports = TokenStakingContract;
