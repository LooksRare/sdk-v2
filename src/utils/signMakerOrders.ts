import { TypedDataSigner, TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { MultipleMakerBidOrders, MultipleMakerAskOrders } from "../types";

export const signMakerOrders = async (
  signer: TypedDataSigner,
  domain: TypedDataDomain,
  types: Record<string, Array<TypedDataField>>,
  makerOrders: MultipleMakerBidOrders | MultipleMakerAskOrders
): Promise<string> => {
  return signer._signTypedData(domain, types, makerOrders);
};
