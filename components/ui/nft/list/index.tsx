import React from "react";
import NftItem from "../item";
import { Nft } from "@/types";
import { useListedNfts } from "@/components/hooks/web3";

const NftList: React.FC = () => {
  const { nfts } = useListedNfts();
  const Nfts: Nft[] = nfts.data;

  console.log(nfts.data);
  return (
    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
      {Nfts?.map((nft) => {
        return (
          <div
            key={nft.meta.image}
            className="flex flex-col rounded-lg shadow-lg overflow-hidden"
          >
            <NftItem item={nft} buyNft={nfts.buyNft} />
          </div>
        );
      })}
    </div>
  );
};

export default NftList;
