import { nftMeta } from "./../../types/index";
import { v4 as uuidv4 } from "uuid";
import { Session } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import {
  withSession,
  getContractAddress,
  addressCheckMiddleware,
} from "./utils";
import pinataSDK from "@pinata/sdk";
import { pinataApiKey, pinataApiSecret } from "./utils";
import { uploadImageToPinata, uploadMetadataToPinata } from "./utils";

export default withSession(
  async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse
  ) => {
    if (req.method === "GET") {
      const contractAddress = getContractAddress();
      try {
        const message = {
          contractAddress: contractAddress,
          id: uuidv4(),
        };
        req.session.set("message-session", message);
        await req.session.save();
        return res.json(message);
      } catch (error) {
        return res
          .status(422)
          .json({ message: "cannot generate message" });
      }
    } else if (req.method === "POST") {
      try {
        const { body } = req;
        const nft = body.nft as nftMeta;

        if (
          !nft.image ||
          !nft.attributes ||
          !nft.description ||
          !nft.name
        ) {
          console.log("error");
          return res.status(422).send({ message: "Incomplete form data" });
        }
        await addressCheckMiddleware(req, res);

        const imageURI = await uploadImageToPinata(nft.image);
        nft.image = imageURI;
        const metaURI = await uploadMetadataToPinata(nft);

        return res.status(200).send({ metaURI });
      } catch (error: any) {
        console.error(error.message);
        res.status(422).send({ message: "cannot create nft" });
      }
    } else {
      res.status(400).json({ message: "bad request" });
    }
  }
);
