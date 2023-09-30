import { Nft } from "./../../../types/index";
import useSWR from "swr";
import { CryptoHookFactory } from "@/types/hookTypes";
import { ethers } from "ethers";
import { useCallback } from "react";
import { toast } from "react-toastify";

type ListedNftsHookRes = {
  buyNft: (tokenId: number, value: number) => Promise<void>;
};
type ListedNftsHookFactory = CryptoHookFactory<Nft, ListedNftsHookRes>;
export type ListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useListedNfts" : null,
      async () => {
        let nfts = [] as Nft[];
        const coreNfts = await contract!.getAllNftsOnSale();
        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.tokenURI(item.tokenId);
          const meta = await fetch(tokenURI.toString(), {
            method: "GET",
          });
          const metaRes = await meta.json();
          const nft: Nft = {
            isListed: item.isListed,
            price: parseFloat(ethers.utils.formatEther(item.price)),
            tokenId: item.tokenId.toNumber(),
            creator: item.creator,
            meta: metaRes,
          };

          nfts.push(nft);
        }
        return nfts;
      }
    );

    const buyNft = useCallback(
      async (tokenId: number, value: number): Promise<void> => {
        try {
          const result = await contract?.buyNft(tokenId, {
            value: ethers.utils.parseEther(value.toString()),
          });

          await result?.wait();
          await toast.promise(result!.wait(), {
            pending: "processing purchase",
            success: "NFT bought",
            error: "processing error",
          });
        } catch (error: any) {
          console.error(error.message);
        }
      },
      [contract]
    );

    return { data, buyNft, ...swr };
  };
