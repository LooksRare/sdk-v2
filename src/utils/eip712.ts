import { utils } from "ethers";
import { EIP712TypedData, Maker } from "../types";

// EIP 712 (Typed structured data hashing and signing) related data
// https://eips.ethereum.org/EIPS/eip-712

export const MAKER_HASH = "0x003c1bce41a2de73dfe64d6eeb2b3d7f15f1c0c382d9d963c2c6daeb75f0e539";

export const hashingMakerTypes: string[] = [
  "bytes32",
  "uint8",
  "uint256",
  "uint256",
  "uint256",
  "uint256",
  "uint8",
  "address",
  "address",
  "address",
  "uint256",
  "uint256",
  "uint256",
  "bytes32",
  "bytes32",
  "bytes32",
];

export const makerTypes: EIP712TypedData = {
  Maker: [
    { name: "quoteType", type: "uint8" },
    { name: "globalNonce", type: "uint256" },
    { name: "subsetNonce", type: "uint256" },
    { name: "orderNonce", type: "uint256" },
    { name: "strategyId", type: "uint256" },
    { name: "collectionType", type: "uint8" },
    { name: "collection", type: "address" },
    { name: "currency", type: "address" },
    { name: "signer", type: "address" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
    { name: "price", type: "uint256" },
    { name: "itemIds", type: "uint256[]" },
    { name: "amounts", type: "uint256[]" },
    { name: "additionalParameters", type: "bytes" },
  ],
};

export const getBatchOrderTypes = (height: number): EIP712TypedData => {
  return {
    BatchOrder: [{ name: "tree", type: `Maker${`[2]`.repeat(height)}` }],
    Maker: [
      { name: "quoteType", type: "uint8" },
      { name: "globalNonce", type: "uint256" },
      { name: "subsetNonce", type: "uint256" },
      { name: "orderNonce", type: "uint256" },
      { name: "strategyId", type: "uint256" },
      { name: "collectionType", type: "uint8" },
      { name: "collection", type: "address" },
      { name: "currency", type: "address" },
      { name: "signer", type: "address" },
      { name: "startTime", type: "uint256" },
      { name: "endTime", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "itemIds", type: "uint256[]" },
      { name: "amounts", type: "uint256[]" },
      { name: "additionalParameters", type: "bytes" },
    ],
  };
};

/**
 * Hash maker ask order.
 * This function is used for testing purpose in the SDK, but is exposed because it's used by the BE.
 * @param maker Maker
 * @returns string (bytes32)
 */
export const getMakerHash = (maker: Maker): string => {
  const values = [
    MAKER_HASH,
    maker.quoteType,
    maker.globalNonce,
    maker.subsetNonce,
    maker.orderNonce,
    maker.strategyId,
    maker.collectionType,
    maker.collection,
    maker.currency,
    maker.signer,
    maker.startTime,
    maker.endTime,
    maker.price,
    utils.keccak256(utils.solidityPack(["uint256[]"], [maker.itemIds])),
    utils.keccak256(utils.solidityPack(["uint256[]"], [maker.amounts])),
    utils.keccak256(maker.additionalParameters),
  ];
  return utils.keccak256(utils.defaultAbiCoder.encode(hashingMakerTypes, values));
};
