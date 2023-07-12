import { Contract, ZeroAddress } from "ethers";
import { LooksRareProtocol } from "../../typechain/@looksrare/contracts-exchange-v2/contracts/LooksRareProtocol";
import abiLooksRareProtocol from "../../abis/LooksRareProtocol.json";
import { Maker, MerkleTree, Taker, Signer, ContractMethods } from "../../types";
import { PayableOverrides } from "../../typechain/common";

export const executeTakerBid = (
  signer: Signer,
  address: string,
  taker: Taker,
  maker: Maker,
  makerSignature: string,
  merkleTree: MerkleTree,
  affiliate: string,
  overrides?: PayableOverrides
): ContractMethods => {
  const overridesWithValue: PayableOverrides = {
    ...overrides,
    ...(maker.currency === ZeroAddress && { value: maker.price }),
  };
  const contract = new Contract(address, abiLooksRareProtocol).connect(signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerBid(taker, maker, makerSignature, merkleTree, affiliate, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerBid.estimateGas(taker, maker, makerSignature, merkleTree, affiliate, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerBid.staticCall(taker, maker, makerSignature, merkleTree, affiliate, {
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
  affiliate: string,
  overrides?: PayableOverrides
): ContractMethods => {
  const contract = new Contract(address, abiLooksRareProtocol).connect(signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerAsk(taker, maker, makerSignature, merkleTree, affiliate, {
        ...overrides,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerAsk.estimateGas(taker, maker, makerSignature, merkleTree, affiliate, {
        ...overrides,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerAsk.staticCall(taker, maker, makerSignature, merkleTree, affiliate, {
        ...overrides,
        ...additionalOverrides,
      }),
  };
};

export const executeMultipleTakerBids = (
  signer: Signer,
  address: string,
  taker: Taker[],
  maker: Maker[],
  makerSignature: string[],
  isAtomic: boolean,
  merkleTree: MerkleTree[],
  affiliate: string,
  overrides?: PayableOverrides
) => {
  const value = maker.reduce((acc, order) => (order.currency === ZeroAddress ? acc + BigInt(order.price) : acc), 0n);
  const overridesWithValue: PayableOverrides = {
    ...overrides,
    ...(value > 0 && { value }),
  };
  const contract = new Contract(address, abiLooksRareProtocol).connect(signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeMultipleTakerBids(taker, maker, makerSignature, merkleTree, affiliate, isAtomic, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.executeMultipleTakerBids.estimateGas(taker, maker, makerSignature, merkleTree, affiliate, isAtomic, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.executeMultipleTakerBids.staticCall(taker, maker, makerSignature, merkleTree, affiliate, isAtomic, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
  };
};
