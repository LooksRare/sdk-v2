import { TypedDataSigner, TypedDataDomain } from "@ethersproject/abstract-signer";
import { MakerAsk, MakerBid, MerkleTree } from "../types";
import { makerAskTypes, makerBidTypes, merkleTreeTypes } from "../constants/eip712";

/**
 * Sign a maker ask
 * @param signer Ethers typed data signer
 * @param domain Typed data domain
 * @param makerOrder Maker ask
 * @returns Signature
 */
export const signMakerAsk = async (
  signer: TypedDataSigner,
  domain: TypedDataDomain,
  makerOrder: MakerAsk
): Promise<string> => {
  return signer._signTypedData(domain, makerAskTypes, makerOrder);
};
/**
 *
 * @param signer Ethers typed data signer
 * @param domain Typed data domain
 * @param makerOrder Maker bid
 * @returns Signature
 */
export const signMakerBid = async (
  signer: TypedDataSigner,
  domain: TypedDataDomain,
  makerOrder: MakerBid
): Promise<string> => {
  return signer._signTypedData(domain, makerBidTypes, makerOrder);
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
