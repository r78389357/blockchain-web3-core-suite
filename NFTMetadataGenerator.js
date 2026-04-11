const fs = require('fs');
const path = require('path');

class NFTMetadataGenerator {
  constructor() {
    this.outputDir = path.join(__dirname, 'nft-metadata');
    this.ensureDir();
  }

  ensureDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  generateRandomTrait() {
    const traits = {
      background: ['Blue', 'Purple', 'Gold', 'Black', 'Gradient'],
      body: ['Robot', 'Alien', 'Human', 'Dragon', 'Angel'],
      rarity: ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic']
    };
    return {
      background: traits.background[Math.floor(Math.random() * traits.background.length)],
      body: traits.body[Math.floor(Math.random() * traits.body.length)],
      rarity: traits.rarity[Math.floor(Math.random() * traits.rarity.length)]
    };
  }

  generateMetadata(tokenId) {
    const traits = this.generateRandomTrait();
    const metadata = {
      name: `Genesis NFT #${tokenId}`,
      description: 'Exclusive blockchain genesis collection with unique on-chain traits',
      image: `ipfs://QmXYZ${tokenId}abcdef`,
      tokenId,
      attributes: [
        { trait_type: 'Background', value: traits.background },
        { trait_type: 'Body', value: traits.body },
        { trait_type: 'Rarity', value: traits.rarity }
      ],
      createdAt: new Date().toISOString()
    };
    const filePath = path.join(this.outputDir, `nft-${tokenId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
    return metadata;
  }

  batchGenerate(count) {
    const results = [];
    for (let i = 1; i <= count; i++) {
      results.push(this.generateMetadata(i));
    }
    return results;
  }
}

module.exports = NFTMetadataGenerator;
