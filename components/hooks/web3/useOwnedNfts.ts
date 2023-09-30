import { ethers } from "ethers";
import useSWR from "swr";
import { CryptoHookFactory } from "@/types/hookTypes";
import { Nft } from "@/types";
import { useCallback } from "react";
import { toast } from "react-toastify";

type UseOwnedNftHookRes = {
  listNft: (tokenId: number, price: number) => Promise<void>;
};
type UseOwnedNftHookFactory = CryptoHookFactory<Nft[], UseOwnedNftHookRes>;
export type UseOwnedNftsHook = ReturnType<UseOwnedNftHookFactory>;

export const hookFactory: UseOwnedNftHookFactory =
  ({ contract }) =>
  () => {
    const { ...swr } = useSWR(
      contract ? "web3/useOwnedNfts" : null,
      async () => {
        const nfts: Nft[] = [];
        const coreNfts = await contract!.getOwnedNfts();
        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.tokenURI(item.tokenId);
          const metaRes = await fetch(tokenURI);
          const meta = await metaRes.json();

          const nft: Nft = {
            isListed: item.isListed,
            price: parseFloat(ethers.utils.formatEther(item.price)),
            tokenId: item.tokenId.toNumber(),
            creator: item.creator,
            meta,
          };

          nfts.push(nft);
        }
        return nfts;
      }
    );

    //this function always recreates when the hooks re-evaluates we dont want that
    //so we will use useCallback
    const listNft = useCallback(
      async (tokenId: number, price: number) => {
        const listingPrice = ethers.utils.parseEther("0.025");
        try {
          const result = await contract?.placeNftOnSale(
            tokenId,
            ethers.utils.parseEther(price.toString()),
            {
              value: listingPrice,
            }
          );

          await result?.wait();
          await toast.promise(result!.wait(), {
            pending: "processing request",
            success: "NFT listed",
            error: "processing error",
          });
        } catch (error: any) {
          console.error(error.message);
        }
      },
      [contract]
    );

    return {
      ...swr,
      listNft,
    };
  };
