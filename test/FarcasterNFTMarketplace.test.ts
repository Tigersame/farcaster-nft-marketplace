import { expect } from "chai";
import { ethers } from "hardhat";
import { FarcasterNFTMarketplace } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("FarcasterNFTMarketplace", function () {
  let marketplace: FarcasterNFTMarketplace;
  let owner: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();
    
    const MarketplaceFactory = await ethers.getContractFactory("FarcasterNFTMarketplace");
    marketplace = await MarketplaceFactory.deploy();
    await marketplace.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await marketplace.owner()).to.equal(owner.address);
    });

    it("Should have correct platform fee", async function () {
      expect(await marketplace.platformFee()).to.equal(250); // 2.5%
    });
  });

  describe("NFT Minting", function () {
    it("Should mint NFT with metadata", async function () {
      const metadataURI = "ipfs://QmTest/1";
      const royalty = 500; // 5%

      await expect(marketplace.connect(seller).mintNFT(metadataURI, royalty))
        .to.emit(marketplace, "NFTMinted")
        .withArgs(1, seller.address, metadataURI);

      expect(await marketplace.ownerOf(1)).to.equal(seller.address);
    });

    it("Should reject royalty above 10%", async function () {
      await expect(
        marketplace.mintNFT("ipfs://test", 1100)
      ).to.be.revertedWith("Royalty too high");
    });
  });

  describe("Listing", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).mintNFT("ipfs://test/1", 500);
    });

    it("Should list NFT for sale", async function () {
      const price = ethers.parseEther("1.0");

      await expect(marketplace.connect(seller).listNFT(1, price))
        .to.emit(marketplace, "NFTListed")
        .withArgs(1, seller.address, price);

      const listing = await marketplace.listings(1);
      expect(listing.isActive).to.be.true;
      expect(listing.price).to.equal(price);
    });

    it("Should transfer NFT to marketplace when listing", async function () {
      await marketplace.connect(seller).listNFT(1, ethers.parseEther("1.0"));
      expect(await marketplace.ownerOf(1)).to.equal(await marketplace.getAddress());
    });
  });

  describe("Buying", function () {
    const price = ethers.parseEther("1.0");

    beforeEach(async function () {
      await marketplace.connect(seller).mintNFT("ipfs://test/1", 500);
      await marketplace.connect(seller).listNFT(1, price);
    });

    it("Should allow buying listed NFT", async function () {
      await expect(
        marketplace.connect(buyer).buyNFT(1, { value: price })
      ).to.emit(marketplace, "NFTSold");

      expect(await marketplace.ownerOf(1)).to.equal(buyer.address);
    });

    it("Should distribute payments correctly", async function () {
      const initialBalance = await ethers.provider.getBalance(seller.address);
      
      await marketplace.connect(buyer).buyNFT(1, { value: price });
      
      const pending = await marketplace.pendingWithdrawals(seller.address);
      const expectedSeller = price * 9250n / 10000n; // 92.5% (minus 2.5% platform + 5% royalty)
      
      expect(pending).to.equal(expectedSeller);
    });

    it("Should reject insufficient payment", async function () {
      await expect(
        marketplace.connect(buyer).buyNFT(1, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Insufficient payment");
    });
  });

  describe("Withdrawals", function () {
    it("Should allow withdrawing pending funds", async function () {
      await marketplace.connect(seller).mintNFT("ipfs://test/1", 500);
      await marketplace.connect(seller).listNFT(1, ethers.parseEther("1.0"));
      await marketplace.connect(buyer).buyNFT(1, { value: ethers.parseEther("1.0") });

      const pending = await marketplace.pendingWithdrawals(seller.address);
      expect(pending).to.be.gt(0);

      await marketplace.connect(seller).withdraw();
      expect(await marketplace.pendingWithdrawals(seller.address)).to.equal(0);
    });
  });

  describe("Cancel Listing", function () {
    it("Should allow seller to cancel listing", async function () {
      await marketplace.connect(seller).mintNFT("ipfs://test/1", 500);
      await marketplace.connect(seller).listNFT(1, ethers.parseEther("1.0"));
      
      await expect(marketplace.connect(seller).cancelListing(1))
        .to.emit(marketplace, "ListingCancelled");

      expect(await marketplace.ownerOf(1)).to.equal(seller.address);
    });
  });
});
