// const { deployments, ethers, getNamedAccounts } = require("hardhat");
// const { expect } = require("chai");

// const NftPrice = ethers.utils.parseEther("1");
// const ListingPrice = ethers.utils.parseEther("0.025");

// function mintNft(minter, contract, tokenURI) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const tx = await contract
//         .connect(minter)
//         .mintNft(tokenURI, NftPrice, { value: ListingPrice });
//       await tx.wait(1);
//       resolve();
//     } catch (error) {
//       reject(error.message);
//     }
//   });
// }

// describe("testing nftMarket", () => {
//   let nftMarketContract, deployer, minter, buyer;
//   before(async () => {
//     const accounts = await ethers.getSigners();
//     minter = accounts[0];
//     buyer = accounts[1];
//     deployer = (await getNamedAccounts()).deployer;
//     await deployments.fixture(["all"]);
//     nftMarketContract = await ethers.getContract("NftMarket", deployer);
//   });

//   describe("Mint NFT", () => {
//     let tokenURI = "some string for testing purposes";
//     let otherTokenURI = "other token URI";
//     before(async () => {
//       await mintNft(minter, nftMarketContract, tokenURI);
//     });

//     it("checks the owner of NFT", async () => {
//       const owner = await nftMarketContract.ownerOf(1);
//       expect(owner).to.equal(minter.address);
//     });

//     it("checks the tokenURI", async () => {
//       const tokenURIFromContract = await nftMarketContract.tokenURI(1);
//       expect(tokenURI).to.equal(tokenURIFromContract);
//     });

//     it("reverts if tokenURI is Duplicated", async () => {
//       await expect(
//         nftMarketContract
//           .connect(minter)
//           .mintNft(tokenURI, NftPrice, { value: ListingPrice })
//       ).to.be.revertedWith("NftMarket__TokenURIDuplicated()");
//     });

//     it("listed items count should be 1", async () => {
//       expect(await nftMarketContract.getListedItemsCount()).to.be.equal(1);
//     });

//     it("succesfully creates NftItem", async () => {
//       const NftItem = await nftMarketContract.getNftItem(1);
//       expect(NftItem.creator).to.be.equal(minter.address);
//       expect(NftItem.price).to.be.equal(NftPrice);
//     });

//     it("reverts if listing price is not matched", async () => {
//       await expect(
//         nftMarketContract
//           .connect(minter)
//           .mintNft(otherTokenURI, NftPrice, { value: 0 })
//       ).to.be.revertedWith("NftMarket__ListingPriceNotMatched()");
//     });
//   });

//   describe("testing buy NFT", () => {
//     it("reverts if price is not correct", async () => {
//       await expect(
//         nftMarketContract.connect(buyer).buyNFT(1, { value: 0 })
//       ).to.be.revertedWith(
//         "price not matched, please send correct amount of eth"
//       );
//     });

//     it("reverts if sender is alredy the owner", async () => {
//       await expect(
//         nftMarketContract.connect(minter).buyNFT(1, { value: NftPrice })
//       ).to.be.revertedWith("you are already the owner of NFT");
//     });

//     it("checks isListed should be false", async () => {
//       const tx = await nftMarketContract
//         .connect(buyer)
//         .buyNFT(1, { value: NftPrice });
//       await tx.wait(1);
//       const nftItem = await nftMarketContract.getNftItem(1);
//       expect(nftItem.isListed).to.equal(false);
//     });

//     it("checks if ownership of NFT was transferred", async () => {
//       const owner = await nftMarketContract.ownerOf(1);
//       expect(owner).to.equal(buyer.address);
//     });
//   });
// });
const { ethers } = require("hardhat");

describe("NftMarket", () => {
  let accounts, _contract;
  before(async () => {
    accounts = await ethers.getSigners();
    _contract = await ethers.getContract("NftMarket");
  });

  describe("Mint token", () => {
    const tokenURI = "https://test.com";
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });

    it("owner of the first token should be address[0]", async () => {
      const owner = await _contract.ownerOf(1);
      assert.equal(
        owner,
        accounts[0],
        "Owner of token is not matching address[0]"
      );
    });

    it("first token should point to the correct tokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);

      assert.equal(
        actualTokenURI,
        tokenURI,
        "tokenURI is not correctly set"
      );
    });

    it("should not be possible to create a NFT with used tokenURI", async () => {
      try {
        await _contract.mintToken(tokenURI, _nftPrice, {
          from: accounts[0],
        });
      } catch (error) {
        assert(error, "NFT was minted with previously used tokenURI");
      }
    });

    it("should have one listed item", async () => {
      const listedItemCount = await _contract.listedItemsCount();
      assert.equal(
        listedItemCount.toNumber(),
        1,
        "Listed items count is not 1"
      );
    });

    it("should have create NFT item", async () => {
      const nftItem = await _contract.getNftItem(1);

      assert.equal(nftItem.tokenId, 1, "Token id is not 1");
      assert.equal(nftItem.price, _nftPrice, "Nft price is not correct");
      assert.equal(
        nftItem.creator,
        accounts[0],
        "Creator is not account[0]"
      );
      assert.equal(nftItem.isListed, true, "Token is not listed");
    });
  });

  describe("Buy NFT", () => {
    before(async () => {
      await _contract.buyNft(1, {
        from: accounts[1],
        value: _nftPrice,
      });
    });

    it("should unlist the item", async () => {
      const listedItem = await _contract.getNftItem(1);
      assert.equal(listedItem.isListed, false, "Item is still listed");
    });

    it("should decrease listed items count", async () => {
      const listedItemsCount = await _contract.listedItemsCount();
      assert.equal(
        listedItemsCount.toNumber(),
        0,
        "Count has not been decrement"
      );
    });

    it("should change the owner", async () => {
      const currentOwner = await _contract.ownerOf(1);
      assert.equal(currentOwner, accounts[1], "Item is still listed");
    });
  });

  describe("Token transfers", () => {
    const tokenURI = "https://test-json-2.com";
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });

    it("should have two NFTs created", async () => {
      const totalSupply = await _contract.totalSupply();
      assert.equal(
        totalSupply.toNumber(),
        2,
        "Total supply of token is not correct"
      );
    });

    it("should be able to retreive nft by index", async () => {
      const nftId1 = await _contract.tokenByIndex(0);
      const nftId2 = await _contract.tokenByIndex(1);

      assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
      assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
    });

    it("should have one listed NFT", async () => {
      const allNfts = await _contract.getAllNftsOnSale();
      assert.equal(allNfts[0].tokenId, 2, "Nft has a wrong id");
    });

    it("account[1] should have one owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({
        from: accounts[1],
      });
      assert.equal(ownedNfts[0].tokenId, 1, "Nft has a wrong id");
    });

    it("account[0] should have one owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({
        from: accounts[0],
      });
      assert.equal(ownedNfts[0].tokenId, 2, "Nft has a wrong id");
    });
  });

  describe("Token transfer to new owner", () => {
    before(async () => {
      await _contract.transferFrom(accounts[0], accounts[1], 2);
    });

    it("accounts[0] should own 0 tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({
        from: accounts[0],
      });
      assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
    });

    it("accounts[1] should own 2 tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({
        from: accounts[1],
      });
      assert.equal(ownedNfts.length, 2, "Invalid length of tokens");
    });
  });

  describe("List an Nft", () => {
    before(async () => {
      await _contract.placeNftOnSale(1, _nftPrice, {
        from: accounts[1],
        value: _listingPrice,
      });
    });

    it("should have two listed items", async () => {
      const listedNfts = await _contract.getAllNftsOnSale();

      assert.equal(listedNfts.length, 2, "Invalid length of Nfts");
    });

    it("should set new listing price", async () => {
      await _contract.setListingPrice(_listingPrice, {
        from: accounts[0],
      });
      const listingPrice = await _contract.listingPrice();

      assert.equal(
        listingPrice.toString(),
        _listingPrice,
        "Invalid Price"
      );
    });
  });
});
