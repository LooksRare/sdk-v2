import { constants } from "ethers";
import { Eip712MerkleTree } from "./Eip712MerkleTree";
import { getBatchOrderTypes } from "../constants/eip712";
import { Maker } from "../types";

const defaultMaker: Maker = {
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

/**
 * Specific implementation of Eip712MerkleTree for Maker type
 */
export class Eip712MakerMerkleTree extends Eip712MerkleTree<Maker> {
  constructor(public makerOrders: Maker[]) {
    const height = Math.max(Math.ceil(Math.log2(makerOrders.length)), 1);
    const types = getBatchOrderTypes(height);

    super(types, "Maker", defaultMaker, makerOrders, height);
  }
}
