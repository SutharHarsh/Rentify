const { expect } = require("chai");
const hre = require("hardhat");

describe("NFT Rental Marketplace", function () {
  let marketplace, nft;
  let owner, lister, renter;
  let tokenId = 1;
  let rentalPricePerDay;
  let maxRentDurationDays = 5;

  beforeEach(async () => {
    const { ethers } = hre;
    [owner, lister, renter] = await ethers.getSigners();
    rentalPricePerDay = ethers.parseEther("0.1");

    const NFT = await ethers.getContractFactory("ERC721Mock");
    nft = await NFT.deploy("NFT Test", "NFTT");

    await nft.mint(lister.address, tokenId);

    const NFTMarketplace = await ethers.getContractFactory("NFTRentalMarketplace");
    marketplace = await NFTMarketplace.deploy();

    await nft.connect(lister).approve(marketplace.target, tokenId);

    await marketplace.connect(lister).listNFTForRent(
      nft.target,
      tokenId,
      rentalPricePerDay,
      maxRentDurationDays
    );
  });

  it("should allow a user to list an NFT for rent", async () => {
    const listing = await marketplace.getListingDetails(1);
    expect(listing.owner).to.equal(lister.address);
    expect(listing.tokenId).to.equal(tokenId);
    expect(listing.rentalPricePerDay).to.equal(rentalPricePerDay);
    expect(listing.maxRentDurationDays).to.equal(maxRentDurationDays);
    expect(listing.status).to.equal(0);
  });

  it("should allow a user to rent an NFT", async () => {
    const fee = rentalPricePerDay * 3n;
    await marketplace.connect(renter).rentNFT(1, 3, { value: fee });

    const listing = await marketplace.getListingDetails(1);
    expect(listing.status).to.equal(1);

    const status = await marketplace.getRentalStatus(1);
    expect(status).to.equal("Rented");
  });

  it("should allow lister to reclaim NFT after rental", async () => {
    const fee = rentalPricePerDay * 3n;
    await marketplace.connect(renter).rentNFT(1, 3, { value: fee });

    await hre.network.provider.send("evm_increaseTime", [3600 * 24 * 3]);
    await hre.network.provider.send("evm_mine");

    await marketplace.connect(lister).endRentalAndReclaimNFT(1);

    const listing = await marketplace.getListingDetails(1);
    expect(listing.status).to.equal(0);
  });

  it("should allow lister to delist an available NFT", async () => {
    await marketplace.connect(lister).delistNFT(1);
    const listing = await marketplace.getListingDetails(1);
    expect(listing.status).to.equal(0);
  });

  it("should return correct rental status", async () => {
    expect(await marketplace.getRentalStatus(1)).to.equal("Available");

    await marketplace.connect(renter).rentNFT(1, 2, {
      value: rentalPricePerDay * 2n,
    });

    expect(await marketplace.getRentalStatus(1)).to.equal("Rented");
  });

  it("should mint and approve NFT", async () => {
    const [owner] = await ethers.getSigners();
    const nft = await ethers.getContractFactory("ERC721Mock");
    const nftInstance = await nft.deploy();
    await nftInstance.waitForDeployment();

    await nftInstance.mint(); // this mints token ID 1 for the owner

    // Approve marketplace to handle it
    await nftInstance.approve("0xYourMarketplaceAddress", 1);
  });

});


