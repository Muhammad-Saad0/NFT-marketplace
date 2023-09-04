import { CryptoHookFactory } from "@/types/hookTypes";
import useSWR from "swr";

type AccountHookFactory = CryptoHookFactory<string, string>;
export type UseAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory = (deps) => (params) => {
  const swrRes = useSWR("web3/useAccount", () => {
    return "Test User";
  });

  return swrRes;
};
