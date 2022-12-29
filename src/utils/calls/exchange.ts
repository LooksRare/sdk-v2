import { Contract, PayableOverrides, constants } from "ethers";
import { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import abiLooksRareProtocol from "../../abis/LooksRareProtocol.json";
import { MakerAsk, MakerBid, MerkleTree, TakerAsk, TakerBid, Signer, ContractMethods } from "../../types";

export const executeTakerBid = (
  signer: Signer,
  address: string,
  takerBid: TakerBid,
  makerAsk: MakerAsk,
  makerSignature: string,
  merkleTree: MerkleTree,
  referrer: string,
  overrides?: PayableOverrides
): ContractMethods => {
  const overridesWithValue: PayableOverrides = {
    ...overrides,
    ...(makerAsk.currency === constants.AddressZero && { value: takerBid.maxPrice }),
  };
  const contract = new Contract(address, abiLooksRareProtocol, signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerBid(takerBid, makerAsk, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.estimateGas.executeTakerBid(takerBid, makerAsk, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
  };
};

export const executeTakerAsk = (
  signer: Signer,
  address: string,
  takerAsk: TakerAsk,
  makerBid: MakerBid,
  makerSignature: string,
  merkleTree: MerkleTree,
  referrer: string,
  overrides?: PayableOverrides
): ContractMethods => {
  const overridesWithValue: PayableOverrides = {
    ...overrides,
    ...(makerBid.currency === constants.AddressZero && { value: takerAsk.minPrice }),
  };
  const contract = new Contract(address, abiLooksRareProtocol, signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerAsk(takerAsk, makerBid, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.estimateGas.executeTakerAsk(takerAsk, makerBid, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
  };
};
