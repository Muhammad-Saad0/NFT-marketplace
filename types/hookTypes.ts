import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";

export type Web3Dependencies = {
  ethereum: MetaMaskInpageProvider;
  contract: Contract;
  provider: providers.Web3Provider;
};

export type CryptoHookHandler<D = any, P = any> = {
  (params: P): SWRResponse<D>;
};

export type CryptoHookFactory<P = any, D = any> = {
  (deps: Partial<Web3Dependencies>): CryptoHookHandler<P, D>;
};
