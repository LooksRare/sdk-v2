import { TypedDataField } from "@ethersproject/abstract-signer";
import { SolidityType } from "../types";

export const contractName = "LooksRareProtocol";
export const version = 2;

export const MAKER_ASK_HASH = "0x53f94ec71943e0d4668607b00d3be3b36a84a2d7cbe7c56ece7bb71013b788cf";
export const MAKER_BID_HASH = "0x0bc6f8c7cbcae50dce9a802ad4a3ee8dc62c394cf460eafaffefce4f43d114e2";

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
