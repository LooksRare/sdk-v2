import { TypedDataField } from "@ethersproject/abstract-signer";
import { SolidityType } from "../types";

// EIP 712 (Typed structured data hashing and signing) related data
// https://eips.ethereum.org/EIPS/eip-712

export const contractName = "LooksRareProtocol";
export const version = 2;

export const MERKLE_TREE_HASH = "0x4339702fd09d392db18a2a980b04a717d48085f206207a9fe4472d7ba0ccbf0b";

export const MAKER_HASH = "0xa2d1934c802d9cad310647bc0f9df2699b7cccc54bdff789fc494342a5695c73";

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

export const hashingMerkleTreeTypes: SolidityType[] = ["bytes32", "bytes32"];

export const makerTypes: Record<string, Array<TypedDataField>> = {
  Maker: [
    { name: "quoteType", type: "uint8" },
    { name: "globalNonce", type: "uint256" },
    { name: "subsetNonce", type: "uint256" },
    { name: "orderNonce", type: "uint256" },
    { name: "strategyId", type: "uint256" },
    { name: "assetType", type: "uint8" },
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

export const merkleTreeTypes: Record<string, Array<TypedDataField>> = {
  MerkleTree: [{ name: "root", type: "bytes32" }],
};

export const EIP_712_BULK_ORDER_TYPE = {
  BatchOrder: [{ name: "tree", type: "Maker[2][2][2][2][2][2][2]" }],
  Maker: [
    { name: "quoteType", type: "uint8" },
    { name: "globalNonce", type: "uint256" },
    { name: "subsetNonce", type: "uint256" },
    { name: "orderNonce", type: "uint256" },
    { name: "strategyId", type: "uint256" },
    { name: "assetType", type: "uint8" },
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
