import { TypedDataSigner, TypedDataDomain } from "@ethersproject/abstract-signer";
import { Maker } from "../types";
import { makerTypes } from "../constants/eip712";

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
