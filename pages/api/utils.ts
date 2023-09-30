import { Session, withIronSession } from "next-iron-session";
import contractAddresses from "@/constants/contractAddresses.json";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import * as util from "ethereumjs-util";
import { Readable } from "stream";
import pinataSDK from "@pinata/sdk";
import { nftMeta } from "@/types";

type ContractAddresses = {
  [chainId: string]: { [name: string]: string[] };
};
const contractAddressesData: ContractAddresses = contractAddresses;

export const pinataApiKey = process.env.PINATA_API_KEY as string;
export const pinataApiSecret = process.env.PINATA_API_SECRET as string;

const pinataURIPrefix = "https://gateway.pinata.cloud/ipfs/";
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);

export const getContractAddress = () => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID as string | "1337";
  if (contractAddressesData[chainId]) {
    const addressesArray =
      contractAddressesData[chainId]["NftMarketAddresses"];
    const contractAddress = addressesArray[0];
    return contractAddress;
  }
  return null;
};

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SESSION_PASSWORD as any,
    cookieName: "nft-auth-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  });
}

export function addressCheckMiddleware(
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) {
  return new Promise<string>((resolve, reject) => {
    const message = req.session.get("message-session");

    let nonce: string | Buffer = `\x19Ethereum Signed Message:\n${
      JSON.stringify(message).length + JSON.stringify(message)
    }`;

    nonce = util.keccak(Buffer.from(nonce, "utf-8"));
    const { v, r, s } = util.fromRpcSig(req.body.signature);
    const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s);
    const bufferAddress = util.pubToAddress(pubKey);
    const address = util.bufferToHex(bufferAddress);

    if (address === req.body.account) {
      resolve("correct address");
    } else {
      reject("wrong address");
    }
  });
}

export async function uploadImageToPinata(
  base64ImageString: string
): Promise<string> {
  try {
    const buffer = Buffer.from(base64ImageString, "base64");
    const options = {
      pinataMetadata: {
        name: `NFT - ${Date.now()}`,
      },
    };

    const readableStream = new Readable({
      read(size) {
        this.push(buffer);
        this.push(null);
      },
    });

    const response = await pinata.pinFileToIPFS(readableStream, options);
    return Promise.resolve(pinataURIPrefix + response.IpfsHash);
  } catch (error: any) {
    return Promise.reject(error.message);
  }
}

export async function uploadMetadataToPinata(
  nft: nftMeta
): Promise<string> {
  try {
    const options = {
      pinataMetadata: {
        name: `NFTMeta - ${uuidv4()}`,
      },
    };

    const response = await pinata.pinJSONToIPFS(nft, options);
    return Promise.resolve(pinataURIPrefix + response.IpfsHash);
  } catch (error: any) {
    return Promise.reject(error.message);
  }
}
