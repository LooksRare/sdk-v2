import { TypedDataField } from "@ethersproject/abstract-signer";
import { SolidityType } from "../types";

export const contractName = "LooksRareProtocol";
export const version = 2;

export const MAKER_ASK_HASH = "0xd68183dbe86d11ceada61f851ee998c9608c049d79f6c9d65bfba7d4b5db5e3e";
export const MAKER_BID_HASH = "0x0408e64fdd103ecf799bbabbd0370ad7c35a5711332d9d966e79c70ff3cb2aa3";
export const MERKLE_TREE_HASH = "0x4339702fd09d392db18a2a980b04a717d48085f206207a9fe4472d7ba0ccbf0b";

export const hashingMakerTypes: SolidityType[] = [
  "bytes32",
  "uint112",
  "uint112",
  "uint16",
  "uint8",
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
    { name: "askNonce", type: "uint112" },
    { name: "subsetNonce", type: "uint112" },
    { name: "strategyId", type: "uint16" },
    { name: "assetType", type: "uint8" },
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
    { name: "bidNonce", type: "uint112" },
    { name: "subsetNonce", type: "uint112" },
    { name: "strategyId", type: "uint16" },
    { name: "assetType", type: "uint8" },
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
