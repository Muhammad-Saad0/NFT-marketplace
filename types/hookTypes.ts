import { Nullable } from "@/components/providers/web3/utils";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { providers } from "ethers";
import { SWRResponse } from "swr";
import { NftMarketType } from "./nftMarketType";

export type Web3Dependencies = {
  ethereum: MetaMaskInpageProvider;
  contract: NftMarketType;
  provider: providers.Web3Provider;
};

export type CryptoHookHandler<D = any, R = any, P = any> = {
  (params?: P): SWRResponse<D> & R;
};

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (
    deps: Nullable<Web3Dependencies> & { isLoading: boolean }
  ): CryptoHookHandler<P, R, D>;
};
