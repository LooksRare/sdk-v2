import { TypedDataField } from "@ethersproject/abstract-signer";
import { SolidityType } from "../types";

// EIP 712 (Typed structured data hashing and signing) related data
// https://eips.ethereum.org/EIPS/eip-712

export const contractName = "LooksRareProtocol";
export const version = 2;

export const MAKER_ASK_HASH = "0x88210d05352c99907588dddb658b9abce78f141d1415d7be787f6120b718fe02";
export const MAKER_BID_HASH = "0xc69763700afbfcdc70a0b138ea120a08fc78dfc5532f1e7232fa8d8cfb26f96a";
export const MERKLE_TREE_HASH = "0x4339702fd09d392db18a2a980b04a717d48085f206207a9fe4472d7ba0ccbf0b";

export const hashingMakerTypes: SolidityType[] = [
  "bytes32",
  "uint256",
  "uint256",
  "uint256",
  "uint256",
  "uint256",
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

export const hashingMerkleTreeTypes: SolidityType[] = ["bytes32", "bytes32"];

export const makerAskTypes: Record<string, Array<TypedDataField>> = {
  MakerAsk: [
    { name: "askNonce", type: "uint256" },
    { name: "subsetNonce", type: "uint256" },
    { name: "strategyId", type: "uint256" },
    { name: "assetType", type: "uint256" },
    { name: "orderNonce", type: "uint256" },
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
    { name: "bidNonce", type: "uint256" },
    { name: "subsetNonce", type: "uint256" },
    { name: "strategyId", type: "uint256" },
    { name: "assetType", type: "uint256" },
    { name: "orderNonce", type: "uint256" },
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

export const merkleTreeTypes: Record<string, Array<TypedDataField>> = {
  MerkleTree: [{ name: "root", type: "bytes32" }],
};
