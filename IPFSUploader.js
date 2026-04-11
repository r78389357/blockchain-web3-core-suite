const { create } = require('ipfs-http-client');
const fs = require('fs');

class IPFSUploader {
  constructor() {
    this.ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
    });
  }

  async uploadText(text) {
    const result = await this.ipfs.add(text);
    return {
      cid: result.path,
      url: `https://ipfs.io/ipfs/${result.path}`
    };
  }

  async uploadFile(filePath) {
    const file = fs.readFileSync(filePath);
    const result = await this.ipfs.add(file);
    return {
      cid: result.path,
      fileName: filePath.split('/').pop(),
      url: `https://ipfs.io/ipfs/${result.path}`
    };
  }

  async uploadJSON(data) {
    return this.uploadText(JSON.stringify(data, null, 2));
  }

  async getFile(cid) {
    const stream = this.ipfs.cat(cid);
    let data = '';
    for await (const chunk of stream) {
      data += chunk.toString();
    }
    return data;
  }
}

module.exports = IPFSUploader;
