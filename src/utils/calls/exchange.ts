import { Contract, PayableOverrides, BigNumber, ZeroAddress } from "ethers";
import { LooksRareProtocol } from "../../typechain/@looksrare/contracts-exchange-v2/contracts/LooksRareProtocol";
import abiLooksRareProtocol from "../../abis/LooksRareProtocol.json";
import { Maker, MerkleTree, Taker, Signer, ContractMethods } from "../../types";

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
  const contract = new Contract(address, abiLooksRareProtocol, signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerBid(taker, maker, makerSignature, merkleTree, affiliate, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.estimateGas.executeTakerBid(taker, maker, makerSignature, merkleTree, affiliate, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.callStatic.executeTakerBid(taker, maker, makerSignature, merkleTree, affiliate, {
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
  const contract = new Contract(address, abiLooksRareProtocol, signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerAsk(taker, maker, makerSignature, merkleTree, affiliate, {
        ...overrides,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.estimateGas.executeTakerAsk(taker, maker, makerSignature, merkleTree, affiliate, {
        ...overrides,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.callStatic.executeTakerAsk(taker, maker, makerSignature, merkleTree, affiliate, {
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
  const value = maker.reduce(
    (acc, order) => (order.currency === ZeroAddress ? acc.add(order.price) : acc),
    BigNumber.from(0)
  );
  const overridesWithValue: PayableOverrides = {
    ...overrides,
    ...(value.gt(0) && { value }),
  };
  const contract = new Contract(address, abiLooksRareProtocol, signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeMultipleTakerBids(taker, maker, makerSignature, merkleTree, affiliate, isAtomic, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.estimateGas.executeMultipleTakerBids(taker, maker, makerSignature, merkleTree, affiliate, isAtomic, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.callStatic.executeMultipleTakerBids(taker, maker, makerSignature, merkleTree, affiliate, isAtomic, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
  };
};
