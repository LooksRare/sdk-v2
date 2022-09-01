import { TypedDataSigner, TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { MakerAsk, MakerBid } from "../types";

export const signMakerOrders = async (
  signer: TypedDataSigner,
  domain: TypedDataDomain,
  types: Record<string, Array<TypedDataField>>,
  makerOrders: MakerAsk | MakerBid
): Promise<string> => {
  return signer._signTypedData(domain, types, makerOrders);
};
