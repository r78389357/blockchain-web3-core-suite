class NFTMarketplace {
  constructor() {
    this.listings = new Map();
    this.salesHistory = [];
    this.platformFee = 2.5;
  }

  listNFT(seller, nftId, price, tokenAddress) {
    if (price <= 0) throw new Error('Invalid price');
    if (this.listings.has(nftId)) throw new Error('NFT already listed');
    const listing = {
      seller,
      nftId,
      price,
      tokenAddress,
      listedAt: Date.now(),
      status: 'ACTIVE'
    };
    this.listings.set(nftId, listing);
    return listing;
  }

  buyNFT(buyer, nftId) {
    const listing = this.listings.get(nftId);
    if (!listing || listing.status !== 'ACTIVE') throw new Error('NFT not available');
    const fee = (listing.price * this.platformFee) / 100;
    const sellerReceive = listing.price - fee;

    listing.status = 'SOLD';
    listing.buyer = buyer;
    listing.soldAt = Date.now();
    this.listings.set(nftId, listing);

    const sale = {
      nftId,
      seller: listing.seller,
      buyer,
      price: listing.price,
      fee,
      sellerReceive,
      timestamp: Date.now()
    };
    this.salesHistory.push(sale);
    return sale;
  }

  cancelListing(nftId) {
    const listing = this.listings.get(nftId);
    if (!listing || listing.status !== 'ACTIVE') throw new Error('Cannot cancel');
    listing.status = 'CANCELLED';
    this.listings.set(nftId, listing);
    return true;
  }

  getActiveListings() {
    return Array.from(this.listings.values()).filter(l => l.status === 'ACTIVE');
  }
}

module.exports = NFTMarketplace;
