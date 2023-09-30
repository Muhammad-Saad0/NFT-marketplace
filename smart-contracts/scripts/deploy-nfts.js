const { ethers } = require("hardhat");

async function main() {
  const nftMarket = await ethers.getContract("NftMarket");
  const tokenURI_1 =
    "https://gateway.pinata.cloud/ipfs/Qmb4aom5xNRE5CBRHZsxCsYSdcmX8zfHXgM7ovZxLp3CqL?_gl=1*f5iodc*_ga*MTE2MzEwNTI2LjE2OTExNDc3NDM.*_ga_5RMPXG14TE*MTY5NDg3NDI5Ny43LjEuMTY5NDg3NDc0OS42MC4wLjA.";
  const tokenURI_2 =
    "https://gateway.pinata.cloud/ipfs/QmPtm27nGzETPzAtF1ZB3aDD1o2TvMfXjm1iuWYod88DYm?_gl=1*16yirv2*_ga*MTE2MzEwNTI2LjE2OTExNDc3NDM.*_ga_5RMPXG14TE*MTY5NDg3NDI5Ny43LjEuMTY5NDg3NDc0OS42MC4wLjA.";
  const accounts = await ethers.getSigners();
  const minter = accounts[0];
  const nftPrice = ethers.utils.parseEther("0.5");
  const listingPrice = ethers.utils.parseEther("0.025");

  let tx = await nftMarket
    .connect(minter)
    .mintToken(tokenURI_1, nftPrice, { value: listingPrice });
  await tx.wait(1);
  tx = await nftMarket
    .connect(minter)
    .mintToken(tokenURI_2, nftPrice, { value: listingPrice });
  await tx.wait(1);

  const listedNfts = await nftMarket.connect(minter).getAllNftsOnSale();
  console.log(listedNfts);
}

main()
  .then((res) => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
