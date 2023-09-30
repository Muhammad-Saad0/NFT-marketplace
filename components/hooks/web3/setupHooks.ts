import { Web3Dependencies } from "@/types/hookTypes";
import {
  UseAccountHook,
  hookFactory as createAccountHook,
} from "./useAccount";
import {
  hookFactory as createNetworkHook,
  UseNetworkHook,
} from "./useNetwork";
import {
  hookFactory as createUseListedHook,
  ListedNftsHook,
} from "./useListedNfts";
import {
  UseOwnedNftsHook,
  hookFactory as createUseOwnedNfts,
} from "./useOwnedNfts";
import { Nullable } from "@/components/providers/web3/utils";

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useListedNfts: ListedNftsHook;
  useOwnedNfts: UseOwnedNftsHook;
};

type SetupHooksFunction = {
  (d: Nullable<Web3Dependencies> & { isLoading: boolean }): Web3Hooks;
};

export const setupHooks: SetupHooksFunction = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
    useListedNfts: createUseListedHook(deps),
    useOwnedNfts: createUseOwnedNfts(deps),
  };
};
