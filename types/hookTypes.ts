import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";

export type web3Dependencies = {
  ethereum: MetaMaskInpageProvider;
  contract: Contract;
  provider: providers.Web3Provider;
};

export type CryptoHookHandler<P = any, D = any> = {
  (params: P): SWRResponse<D>;
};

export type CryptoHookFactory<P = any, D = any> = {
  (deps: Partial<web3Dependencies>): CryptoHookHandler<P, D>;
};
