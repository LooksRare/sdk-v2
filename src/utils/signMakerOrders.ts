import { TypedDataSigner, TypedDataDomain } from "@ethersproject/abstract-signer";
import { Maker, MerkleTree } from "../types";
import { makerTypes, merkleTreeTypes } from "../constants/eip712";

/**
 * Sign a maker order
 * @param signer Ethers typed data signer
 * @param domain Typed data domain
 * @param makerOrder Maker order
 * @returns Signature
 */
export const signMakerOrder = async (
  signer: TypedDataSigner,
  domain: TypedDataDomain,
  makerOrder: Maker
): Promise<string> => {
  return signer._signTypedData(domain, makerTypes, makerOrder);
};

/**
 *
 * @param signer Ethers typed data signer
 * @param domain Typed data domain
 * @param merkleRoot string
 * @returns Signature
 */
export const signMerkleRoot = async (
  signer: TypedDataSigner,
  domain: TypedDataDomain,
  merkleRoot: MerkleTree["root"]
): Promise<string> => {
  const root: Omit<MerkleTree, "proof"> = { root: merkleRoot };
  return signer._signTypedData(domain, merkleTreeTypes, root);
};
