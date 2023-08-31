import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type web3Params = {
  ethereum: MetaMaskInpageProvider | null;
  contract: Contract | null;
  provider: providers.Web3Provider | null;
};

export type web3State = { isloading: boolean } & web3Params;

export function createWeb3State() {
  return {
    ethereum: null,
    contract: null,
    provider: null,
    isloading: true,
  };
}
