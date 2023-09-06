import { SWRResponse } from "swr";
import { getHooks } from "@/components/providers/web3";

export const useAccount = () => {
  const { useAccount } = getHooks();
  const swrResponse = useAccount();
  return {
    account: swrResponse,
  };
};
