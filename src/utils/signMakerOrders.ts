import { TypedDataSigner, TypedDataDomain } from "@ethersproject/abstract-signer";
import { MakerAsk, MakerBid } from "../types";
import { makerAskTypes, makerBidTypes } from "../constants/eip712";

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
