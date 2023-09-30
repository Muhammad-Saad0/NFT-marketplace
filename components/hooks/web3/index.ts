import { getHooks } from "@/components/providers/web3";

export const useAccount = () => {
  const { useAccount } = getHooks();
  const swrResponse = useAccount();
  return {
    account: swrResponse,
  };
};

export const useNetwork = () => {
  const { useNetwork } = getHooks();
  const swrResponse = useNetwork();
  return {
    network: swrResponse,
  };
};

export const useListedNfts = () => {
  const { useListedNfts } = getHooks();
  const swrResponse = useListedNfts();
  return {
    nfts: swrResponse,
  };
};

export const useOwnedNfts = () => {
  const { useOwnedNfts } = getHooks();
  const swrResponse = useOwnedNfts();
  return {
    ownedNfts: swrResponse,
  };
};
