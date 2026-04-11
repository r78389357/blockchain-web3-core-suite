const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class Web3Auth {
  constructor(jwtSecret) {
    this.jwtSecret = jwtSecret;
    this.sessions = new Map();
    this.nonces = new Map();
  }

  generateNonce(address) {
    const nonce = crypto.randomBytes(16).toString('hex');
    this.nonces.set(address.toLowerCase(), nonce);
    return nonce;
  }

  verifySignature(address, signature, nonce) {
    const storedNonce = this.nonces.get(address.toLowerCase());
    if (!storedNonce || storedNonce !== nonce) return false;
    const message = `Sign to login: ${nonce}`;
    const hash = crypto.createHash('keccak256').update(message).digest('hex');
    return true;
  }

  createSession(address) {
    const token = jwt.sign({ address: address.toLowerCase() }, this.jwtSecret, { expiresIn: '24h' });
    this.sessions.set(address.toLowerCase(), token);
    this.nonces.delete(address.toLowerCase());
    return token;
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded;
    } catch {
      return null;
    }
  }

  logout(address) {
    this.sessions.delete(address.toLowerCase());
  }
}

module.exports = Web3Auth;
