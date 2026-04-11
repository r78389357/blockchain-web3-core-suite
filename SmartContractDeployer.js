const ethers = require('ethers');

class SmartContractDeployer {
  constructor(privateKey, rpcUrl) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async deployContract(abi, bytecode, constructorArgs = []) {
    const factory = new ethers.ContractFactory(abi, bytecode, this.wallet);
    const contract = await factory.deploy(...constructorArgs);
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    return {
      address,
      deployTransaction: contract.deploymentTransaction().hash,
      contract
    };
  }

  async getContract(abi, address) {
    return new ethers.Contract(address, abi, this.wallet);
  }

  async estimateGas(contract, method, args = []) {
    return contract.estimateGas[method](...args);
  }

  async sendTransaction(txData) {
    const tx = await this.wallet.sendTransaction(txData);
    await tx.wait();
    return tx;
  }
}

module.exports = SmartContractDeployer;
