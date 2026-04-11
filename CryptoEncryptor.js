const crypto = require('crypto');

class CryptoEncryptor {
  constructor(secretKey) {
    this.secretKey = crypto.scryptSync(secretKey, 'salt', 32);
    this.algorithm = 'aes-256-cbc';
  }

  encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
  }

  decrypt(encryptedObj) {
    const iv = Buffer.from(encryptedObj.iv, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
    let decrypted = decipher.update(encryptedObj.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  hashSHA256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  generateSignature(data, privateKey) {
    const sign = crypto.createSign('SHA256');
    sign.write(data);
    sign.end();
    return sign.sign(privateKey, 'hex');
  }

  verifySignature(data, signature, publicKey) {
    const verify = crypto.createVerify('SHA256');
    verify.write(data);
    verify.end();
    return verify.verify(publicKey, signature, 'hex');
  }
}

module.exports = CryptoEncryptor;
