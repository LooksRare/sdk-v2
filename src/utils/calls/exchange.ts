import { Contract, PayableOverrides, constants } from "ethers";
import { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import abiLooksRareProtocol from "../../abis/LooksRareProtocol.json";
import { Maker, MerkleTree, Taker, Signer, ContractMethods } from "../../types";

export const executeTakerBid = (
  signer: Signer,
  address: string,
  taker: Taker,
  maker: Maker,
  makerSignature: string,
  merkleTree: MerkleTree,
  referrer: string,
  overrides?: PayableOverrides
): ContractMethods => {
  const overridesWithValue: PayableOverrides = {
    ...overrides,
    ...(maker.currency === constants.AddressZero && { value: maker.price }),
  };
  const contract = new Contract(address, abiLooksRareProtocol, signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerBid(taker, maker, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.estimateGas.executeTakerBid(taker, maker, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.callStatic.executeTakerBid(taker, maker, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
  };
};

export const executeTakerAsk = (
  signer: Signer,
  address: string,
  taker: Taker,
  maker: Maker,
  makerSignature: string,
  merkleTree: MerkleTree,
  referrer: string,
  overrides?: PayableOverrides
): ContractMethods => {
  const overridesWithValue: PayableOverrides = {
    ...overrides,
    ...(maker.currency === constants.AddressZero && { value: maker.price }),
  };
  const contract = new Contract(address, abiLooksRareProtocol, signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerAsk(taker, maker, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.estimateGas.executeTakerAsk(taker, maker, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.callStatic.executeTakerAsk(taker, maker, makerSignature, merkleTree, referrer, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
  };
};
