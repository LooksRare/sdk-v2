import { TypedDataField } from "@ethersproject/abstract-signer";
import { SolidityType } from "../types";

export const contractName = "LooksRareProtocol";
export const version = 2;

export const MAKER_ASK_HASH = "0x85fa30b2b848c94bd5f5b88383658126eb3a69201d0b539f4bf956996bdb6af1";
export const MAKER_BID_HASH = "0xaac47bd6046bbe5acd60a92f52dde1bb26209688be10f8a6e723fb405c70721b";

export const hashingMakerTypes: SolidityType[] = [
  "bytes32",
  "uint112",
  "uint112",
  "uint16",
  "uint8",
  "uint112",
  "uint16",
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
    { name: "minNetRatio", type: "uint16" },
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
    { name: "minNetRatio", type: "uint16" },
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
