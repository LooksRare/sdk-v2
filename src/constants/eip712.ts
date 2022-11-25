import { TypedDataField } from "@ethersproject/abstract-signer";
import { SolidityType } from "../types";

export const contractName = "LooksRareProtocol";
export const version = 2;

export const MAKER_ASK_HASH = "0xc7a3b6254405d9b044a63d83e724f64f1b8c511097d23b2ec8922767c2dbcb06";
export const MAKER_BID_HASH = "0x997623e8963edba01cc5ac8ec02677d22a7ddf20f801ec6b7c03cafd3f224b07";

export const hashingMakerTypes: SolidityType[] = [
  "bytes32",
  "uint112",
  "uint112",
  "uint16",
  "uint8",
  "uint112",
  "address",
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

export const makerAskTypes: Record<string, Array<TypedDataField>> = {
  MakerAsk: [
    { name: "askNonce", type: "uint112" },
    { name: "subsetNonce", type: "uint112" },
    { name: "strategyId", type: "uint16" },
    { name: "assetType", type: "uint8" },
    { name: "orderNonce", type: "uint112" },
    { name: "collection", type: "address" },
    { name: "currency", type: "address" },
    { name: "recipient", type: "address" },
    { name: "signer", type: "address" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
    { name: "minPrice", type: "uint256" },
    { name: "itemIds", type: "uint256[]" },
    { name: "amounts", type: "uint256[]" },
    { name: "additionalParameters", type: "bytes" },
  ],
};

export const makerBidTypes: Record<string, Array<TypedDataField>> = {
  MakerBid: [
    { name: "bidNonce", type: "uint112" },
    { name: "subsetNonce", type: "uint112" },
    { name: "strategyId", type: "uint16" },
    { name: "assetType", type: "uint8" },
    { name: "orderNonce", type: "uint112" },
    { name: "collection", type: "address" },
    { name: "currency", type: "address" },
    { name: "recipient", type: "address" },
    { name: "signer", type: "address" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
    { name: "maxPrice", type: "uint256" },
    { name: "itemIds", type: "uint256[]" },
    { name: "amounts", type: "uint256[]" },
    { name: "additionalParameters", type: "bytes" },
  ],
};

export const merkleRootTypes: Record<string, Array<TypedDataField>> = {
  MerkleRoot: [{ name: "root", type: "bytes32" }],
};
