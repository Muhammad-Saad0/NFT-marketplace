import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers, ethers } from "ethers";
import nftMarketAbi from "@/constants/abi.json";
import contractAddresses from "@/constants/contractAddresses.json";
import { Web3Hooks, setupHooks } from "@/components/hooks/web3/setupHooks";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type ContractAddresses = {
  [chainId: string]: { [name: string]: string[] };
};

const contractAddressesData: ContractAddresses = contractAddresses;
const nftMarketAbiData: any = nftMarketAbi;

type web3Params = {
  ethereum: MetaMaskInpageProvider | null;
  contract: Contract | null;
  provider: providers.Web3Provider | null;
};

export type web3State = {
  isloading: boolean;
  hooks: Web3Hooks;
} & web3Params;

export const getContract = (
  name: string,
  provider: providers.Web3Provider
): Promise<Contract> => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  console.log(chainId);
  if (!chainId) {
    return Promise.reject("chain Id not defined");
  }

  const addressesArray = contractAddressesData[chainId][name];
  const contractAddress = addressesArray[0];

  const contract = new ethers.Contract(
    contractAddress,
    nftMarketAbiData,
    provider
  );

  return Promise.resolve(contract);
};

export function createWeb3State() {
  return {
    ethereum: null,
    contract: null,
    provider: null,
    isloading: true,
    hooks: setupHooks({}),
  };
}
