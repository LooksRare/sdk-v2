import { TypedDataSigner, TypedDataDomain } from "@ethersproject/abstract-signer";
import { MakerAsk, MakerBid, MerkleTree } from "../types";
import { makerAskTypes, makerBidTypes, merkleTreeTypes } from "../constants/eip712";

export const signMakerAsk = async (
  signer: TypedDataSigner,
  domain: TypedDataDomain,
  makerOrder: MakerAsk
): Promise<string> => {
  return signer._signTypedData(domain, makerAskTypes, makerOrder);
};

export const signMakerBid = async (
  signer: TypedDataSigner,
  domain: TypedDataDomain,
  makerOrder: MakerBid
): Promise<string> => {
  return signer._signTypedData(domain, makerBidTypes, makerOrder);
};

export const signMerkleRoot = async (
  signer: TypedDataSigner,
  domain: TypedDataDomain,
  merkleRoot: MerkleTree["root"]
): Promise<string> => {
  const root: Omit<MerkleTree, "proof"> = { root: merkleRoot };
  return signer._signTypedData(domain, merkleTreeTypes, root);
};
