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
