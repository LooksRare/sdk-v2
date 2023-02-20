import { constants } from "ethers";
import { Maker } from "../types";

/** Default maker value used for merkle tree creation */
export const defaultMaker: Maker = {
  quoteType: 0,
  globalNonce: 0,
  subsetNonce: 0,
  orderNonce: 0,
  strategyId: 0,
  collectionType: 0,
  collection: constants.AddressZero,
  currency: constants.AddressZero,
  signer: constants.AddressZero,
  startTime: 0,
  endTime: 0,
  price: 0,
  itemIds: [0],
  amounts: [0],
  additionalParameters: "0x",
};
