class DeFiLiquidityPool {
  constructor(tokenA, tokenB, feeRate = 0.003) {
    this.tokenA = tokenA;
    this.tokenB = tokenB;
    this.reserveA = 0;
    this.reserveB = 0;
    this.liquidityProviders = new Map();
    this.feeRate = feeRate;
    this.totalLP = 0;
  }

  addLiquidity(user, amountA, amountB) {
    if (this.reserveA === 0 && this.reserveB === 0) {
      this.reserveA = amountA;
      this.reserveB = amountB;
    } else {
      const ratio = this.reserveA / this.reserveB;
      if (amountA / amountB !== ratio) throw new Error('Invalid liquidity ratio');
      this.reserveA += amountA;
      this.reserveB += amountB;
    }

    const lpAmount = Math.sqrt(amountA * amountB);
    this.liquidityProviders.set(user, (this.liquidityProviders.get(user) || 0) + lpAmount);
    this.totalLP += lpAmount;
    return { lpAmount, totalLP: this.totalLP };
  }

  removeLiquidity(user, lpAmount) {
    const currentLP = this.liquidityProviders.get(user) || 0;
    if (lpAmount > currentLP) throw new Error('Insufficient LP tokens');

    const ratio = lpAmount / this.totalLP;
    const withdrawA = this.reserveA * ratio;
    const withdrawB = this.reserveB * ratio;

    this.reserveA -= withdrawA;
    this.reserveB -= withdrawB;
    this.liquidityProviders.set(user, currentLP - lpAmount);
    this.totalLP -= lpAmount;

    return { withdrawA, withdrawB };
  }

  swapAtoB(amountA) {
    const fee = amountA * this.feeRate;
    const inputAfterFee = amountA - fee;
    const newReserveA = this.reserveA + inputAfterFee;
    const newReserveB = (this.reserveA * this.reserveB) / newReserveA;
    const outputB = this.reserveB - newReserveB;

    this.reserveA = newReserveA;
    this.reserveB = newReserveB;
    return outputB;
  }
}

module.exports = DeFiLiquidityPool;
