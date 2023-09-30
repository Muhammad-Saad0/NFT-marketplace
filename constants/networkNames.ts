type NetworkNames = {
  [chainId: string]: String;
};

export const networkNames: NetworkNames = {
  1: "Ethereum Mainnet",
  3: "Ropsten Testnet",
  4: "Rinkeby Testnet",
  5: "Goerli Testnet",
  42: "Kovan Testnet",
  1337: "Hardhat",
  // Add more networks as needed
};

export default networkNames;
