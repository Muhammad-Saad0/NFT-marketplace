const { ethers } = require("hardhat");

async function main() {
  const NftMarket = await ethers.getContract("NftMarket");
  const name = await NftMarket.name();

  const symbol = await NftMarket.symbol();
  console.log(name, symbol);
}

main()
  .then((response) => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
