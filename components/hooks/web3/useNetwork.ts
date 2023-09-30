import useSwr from "swr";
import { CryptoHookFactory } from "@/types/hookTypes";
import networkNames from "@/constants/networkNames";
import { useEffect, useState } from "react";
import { useWeb3 } from "@/components/providers/web3";

type UseNetworkResponse = {
  isLoading: boolean;
  isSupported: boolean;
};

type UseNetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>;
export type UseNetworkHook = ReturnType<UseNetworkHookFactory>;

export const hookFactory: UseNetworkHookFactory =
  ({ provider, isLoading }) =>
  () => {
    const [isSupported, setIsSupported] = useState(false);
    const { isValidating, ...swr } = useSwr(
      provider ? "web3/useNetwork" : null,
      async () => {
        const { chainId } = await provider!.getNetwork();

        if (!chainId) {
          throw new Error(
            "cannot get chainId. Please try reloading or connect to other network"
          );
        }
        return networkNames[chainId];
      }
    );

    const { contract } = useWeb3();
    useEffect(() => {
      if (contract) {
        setIsSupported(true);
      }
    }, [contract]);

    return {
      ...swr,
      isLoading: isLoading,
      isValidating,
      isSupported,
    };
  };
