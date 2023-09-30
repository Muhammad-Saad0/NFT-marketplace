type nftAttribute = {
  trait_type: "attack" | "health" | "speed";
  value: string;
};

export type nftMeta = {
  description: string;
  name: string;
  image: string;
  attributes: nftAttribute[];
};

export type NftCore = {
  tokenId: number;
  price: number;
  creator: string;
  isListed: boolean;
};

export type Nft = {
  meta: nftMeta;
} & NftCore;
