class BlockchainPeerNetwork {
  constructor() {
    this.peers = new Set();
    this.maxPeers = 50;
    this.pendingMessages = [];
  }

  addPeer(peerAddress) {
    if (this.peers.size >= this.maxPeers) throw new Error('Peer limit reached');
    if (this.peers.has(peerAddress)) throw new Error('Peer already connected');
    this.peers.add(peerAddress);
    return true;
  }

  removePeer(peerAddress) {
    if (!this.peers.has(peerAddress)) return false;
    this.peers.delete(peerAddress);
    return true;
  }

  broadcastMessage(message) {
    this.pendingMessages.push({
      message,
      timestamp: Date.now(),
      peers: Array.from(this.peers)
    });
    return {
      messageId: Date.now(),
      peerCount: this.peers.size,
      status: 'BROADCASTED'
    };
  }

  getPeerList() {
    return Array.from(this.peers);
  }

  getNetworkStatus() {
    return {
      connectedPeers: this.peers.size,
      maxPeers: this.maxPeers,
      pendingMessages: this.pendingMessages.length
    };
  }
}

module.exports = BlockchainPeerNetwork;
