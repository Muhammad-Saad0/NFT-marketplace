import { CryptoHookFactory } from "@/types/hookTypes";
import { useEffect } from "react";
import useSWR from "swr";

type UseAccountResponse = {
  connect: () => void;
  isLoading: boolean;
  isInstalled: boolean;
};

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>;
export type UseAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory =
  ({ provider, ethereum, isLoading }) =>
  () => {
    const { data, mutate, isValidating, ...swr } = useSWR(
      provider ? "web3/useAccount" : null,
      async () => {
        const accounts = await provider!.listAccounts();
        const currentAccount = accounts[0];

        if (!currentAccount) {
          throw new Error("Please connect to your account");
        }
        return currentAccount;
      },
      {
        revalidateOnFocus: false,
      }
    );

    useEffect(() => {
      ethereum?.on("accountsChanged", handleAccountsChanged);

      return () => {
        ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      };
    });

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        console.error("Please Connect Metamask account");
      } else if (accounts[0] !== data) {
        //The whole hook will be re-evaluated due to this
        mutate(accounts[0]);
      }
    };

    const connect = async () => {
      try {
        ethereum?.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log(error);
      }
    };

    return {
      ...swr,
      isLoading: isLoading || isValidating,
      isInstalled: ethereum?.isMetaMask || false,
      isValidating,
      data,
      mutate,
      connect,
    };
  };
