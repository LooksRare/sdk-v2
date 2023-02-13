import { _TypedDataEncoder, keccak256, toUtf8Bytes } from "ethers/lib/utils";

import { Eip712MerkleTree } from "./Eip712MerkleTree";
import { fillArray } from "./utils";

import type { Maker, EIP712TypedData } from "../../types";

import { EIP_712_BULK_ORDER_TYPE } from "../../constants/eip712";

import { defaultMaker } from "./defaultMaker";

function getBulkOrderTypes(height: number): EIP712TypedData {
  const types = { ...EIP_712_BULK_ORDER_TYPE };
  types.BatchOrder = [{ name: "tree", type: `Maker${`[2]`.repeat(height)}` }];
  return types;
}

export function getBulkOrderTreeHeight(length: number): number {
  return Math.max(Math.ceil(Math.log2(length)), 1);
}

export function getBulkOrderTree(
  makerOrders: Maker[],
  startIndex = 0,
  height = getBulkOrderTreeHeight(makerOrders.length + startIndex)
) {
  const types = getBulkOrderTypes(height);
  const defaultNode = defaultMaker;
  let elements = [...makerOrders];

  if (startIndex > 0) {
    elements = [...fillArray([] as Maker[], startIndex, defaultNode), ...makerOrders];
  }
  const tree = new Eip712MerkleTree(types, "BatchOrder", "Maker", elements, height);
  return tree;
}

export function getBulkOrderTypeHash(height: number): string {
  const types = getBulkOrderTypes(height);
  const encoder = _TypedDataEncoder.from(types);
  const typeString = toUtf8Bytes(encoder._types.BatchOrder);
  return keccak256(typeString);
}

export function getBulkOrderTypeHashes(maxHeight: number): string[] {
  const typeHashes: string[] = [];
  for (let i = 0; i < maxHeight; i++) {
    typeHashes.push(getBulkOrderTypeHash(i + 1));
  }
  return typeHashes;
}
