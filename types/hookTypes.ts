import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";

export type Web3Dependencies = {
  ethereum: MetaMaskInpageProvider;
  contract: Contract;
  provider: providers.Web3Provider;
  isLoading: boolean;
};

export type CryptoHookHandler<D = any, R = any, P = any> = {
  (params?: P): SWRResponse<D> & R;
};

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (deps: Partial<Web3Dependencies>): CryptoHookHandler<P, R, D>;
};
