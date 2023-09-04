import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers, ethers } from "ethers";
import nftMarketAbi from "@/constants/abi.json";
import contractAddresses from "@/constants/contractAddresses.json";
import { Web3Hooks, setupHooks } from "@/components/hooks/web3/setupHooks";
import { Web3Dependencies } from "@/types/hookTypes";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type ContractAddresses = {
  [chainId: string]: { [name: string]: string[] };
};

const contractAddressesData: ContractAddresses = contractAddresses;
const nftMarketAbiData: any = nftMarketAbi;

export type web3State = {
  isloading: boolean;
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>;

export const getContract = (
  name: string,
  provider: providers.Web3Provider
): Promise<Contract> => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
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

export function createDefaultWeb3State() {
  return {
    ethereum: null,
    contract: null,
    provider: null,
    isloading: true,
    hooks: setupHooks({}),
  };
}

export function createWeb3State({
  ethereum,
  provider,
  contract,
  isloading,
}: Web3Dependencies & { isloading: boolean }): web3State {
  return {
    ethereum,
    provider,
    contract,
    isloading: isloading,
    hooks: setupHooks({ ethereum, provider, contract }),
  };
}
