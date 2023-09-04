const { ethers, network } = require("hardhat");
const fs = require("fs");
const {
  ABI_FILE_PATH,
  CONTRACTADDRESSES_FILE_PATH,
} = require("../helper-hardhat-config");

const chainId = network.config.chainId;

module.exports = async ({}) => {
  const NftMarket = await ethers.getContract("NftMarket");
  const abi = NftMarket.interface.format(ethers.utils.FormatTypes.json);

  const contractAddressesDataFromFile = fs.readFileSync(
    CONTRACTADDRESSES_FILE_PATH,
    "utf-8"
  );

  const contractAddressesData = JSON.parse(contractAddressesDataFromFile);
  let newArray;

  if (contractAddressesData[chainId]) {
    console.log("inside if");
    const contractAddressesArray =
      contractAddressesData[chainId].NftMarketAddresses;
    console.log(contractAddressesArray);
    newArray = [NftMarket.address, ...contractAddressesArray];
  } else {
    console.log("inside else");
    newArray = [NftMarket.address];
  }

  const dataToWrite = {
    NftMarketAddresses: newArray,
  };
  console.log(dataToWrite);
  console.log(chainId);

  contractAddressesData[chainId] = dataToWrite;
  const jsonData = JSON.stringify(contractAddressesData);

  try {
    fs.writeFileSync(CONTRACTADDRESSES_FILE_PATH, jsonData);
    console.log("File write successful.");
  } catch (error) {
    console.error("Error writing to the file:", error);
  }
  fs.writeFileSync(ABI_FILE_PATH, abi);
};
