import { Contract, PayableOverrides, constants } from "ethers";
import { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import abiLooksRareProtocol from "../../abis/LooksRareProtocol.json";
import { MakerAsk, MakerBid, MerkleTree, Taker, Signer, ContractMethods } from "../../types";

export const executeTakerBid = (
  signer: Signer,
  address: string,
  taker: Taker,
  makerAsk: MakerAsk,
  makerSignature: string,
  merkleTree: MerkleTree,
  referrer: string,
  overrides?: PayableOverrides
): ContractMethods => {
  const overridesWithValue: PayableOverrides = {
    ...overrides,
    ...(makerAsk.currency === constants.AddressZero && { value: makerAsk.minPrice }),
  };
  const contract = new Contract(address, abiLooksRareProtocol, signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerBid(taker, makerAsk, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.estimateGas.executeTakerBid(taker, makerAsk, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.callStatic.executeTakerBid(taker, makerAsk, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
  };
};

export const executeTakerAsk = (
  signer: Signer,
  address: string,
  taker: Taker,
  makerBid: MakerBid,
  makerSignature: string,
  merkleTree: MerkleTree,
  referrer: string,
  overrides?: PayableOverrides
): ContractMethods => {
  const overridesWithValue: PayableOverrides = {
    ...overrides,
    ...(makerBid.currency === constants.AddressZero && { value: makerBid.maxPrice }),
  };
  const contract = new Contract(address, abiLooksRareProtocol, signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerAsk(taker, makerBid, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.estimateGas.executeTakerAsk(taker, makerBid, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.callStatic.executeTakerAsk(taker, makerBid, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
  };
};
