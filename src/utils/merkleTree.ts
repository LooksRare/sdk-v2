import { MerkleTree as MerkleTreeJS } from "merkletreejs";
import { keccak256 } from "js-sha3";
import { getMakerHash } from "./hashOrder";
import { Maker } from "../types";
/**
 * Generate aa merkle tree for a given list of maker orders
 * @param makerOrders Maker orders
 * @returns merkletreejs object
 */
export const createMakerMerkleTree = (makerOrders: Maker[]): MerkleTreeJS => {
  const leaves = makerOrders.map((order) => {
    const hash = getMakerHash(order);
    return Buffer.from(hash.slice(2), "hex");
  });
  const tree = new MerkleTreeJS(leaves, keccak256, { sortPairs: true });
  return tree;
};
