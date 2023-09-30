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

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type ContractAddresses = {
  [chainId: string]: { [name: string]: string[] };
};

const contractAddressesData: ContractAddresses = contractAddresses;
const nftMarketAbiData: any = nftMarketAbi;

export type Web3State = Nullable<Web3Dependencies> & {
  hooks: Web3Hooks;
  isLoading: boolean;
};

export const getContract = async (
  name: string,
  provider: providers.Web3Provider
): Promise<Contract | null> => {
  const { chainId } = await provider.getNetwork();
  if (!chainId) {
    return Promise.reject("chain Id not defined");
  }

  if (contractAddressesData[chainId]) {
    const addressesArray = contractAddressesData[chainId][name];
    const contractAddress = addressesArray[0];
    const contract = new ethers.Contract(
      contractAddress,
      nftMarketAbiData,
      provider
    );
    return Promise.resolve(contract);
  }
  return Promise.resolve(null);
};

export function createDefaultWeb3State() {
  return {
    ethereum: null,
    contract: null,
    provider: null,
    isLoading: true,
    hooks: setupHooks({
      ethereum: null,
      provider: null,
      contract: null,
      isLoading: true,
    }),
  };
}

export function createWeb3State({
  ethereum,
  provider,
  contract,
  isLoading,
}: Nullable<Web3Dependencies> & { isLoading: boolean }): Web3State {
  return {
    ethereum,
    provider,
    contract,
    isLoading,
    hooks: setupHooks({ ethereum, provider, contract, isLoading }),
  };
}
