// import {
//   defaultAbiCoder,
//   hexConcat,
//   toUtf8Bytes,
// } from "ethers/lib/utils";
import { utils } from "ethers";
import type { BytesLike } from "ethers";
import { MerkleTree } from "merkletreejs";
import { TypedDataField } from "@ethersproject/abstract-signer";
import { MakerAsk } from "../types";
import { merkleOrderTypes } from "../constants/eip712";

// import { DefaultGetter } from "./defaults";
// import {
//   bufferKeccak,
//   bufferToHex,
//   chunk,
//   fillArray,
//   getRoot,
//   hexToBuffer,
// } from "./utils";

type MerkleOrderElements =
  | [MakerAsk, MakerAsk]
  | [MerkleOrderElements, MerkleOrderElements];

const hexToBuffer = (value: string) => Buffer.from(value.slice(2), "hex");

const bufferKeccak = (value: BytesLike) => hexToBuffer(utils.keccak256(value));

const fillArray = <T>(arr: T[], length: number, value: T) => {
  if (length > arr.length) arr.push(...Array(length - arr.length).fill(value));
  return arr;
};

type EIP712TypeDefinitions = Record<string, TypedDataField[]>;

type DefaultMap<T extends EIP712TypeDefinitions> = {
  [K in keyof T]: any;
};

const baseDefaults: Record<string, any> = {
  integer: 0,
  address: utils.hexZeroPad("0x", 20),
  bool: false,
  bytes: "0x",
  string: "",
};

const makeArray = <T>(len: number, getValue: (i: number) => T) =>
  Array(len).fill(0).map((_, i) => getValue(i));

const chunk = <T>(array: T[], size: number) => {
  return makeArray(Math.ceil(array.length / size), (i) =>
    array.slice(i * size, (i + 1) * size)
  );
};

function getDefaultForBaseType(type: string): any {
  // bytesXX
  const [, width] = type.match(/^bytes(\d+)$/) ?? [];
  if (width) return utils.hexZeroPad("0x", parseInt(width));

  if (type.match(/^(u?)int(\d*)$/)) type = "integer";

  return baseDefaults[type];
}

const hashConcat = (arr: BytesLike[]) => bufferKeccak(utils.hexConcat(arr));

const getNextLayer = (elements: Buffer[]) => {
  return chunk(elements, 2).map(hashConcat);
};

const getRoot = (elements: (Buffer | string)[], hashLeaves = true) => {
  if (elements.length === 0) throw new Error("empty tree");

  const leaves = elements.map((e) => {
    const leaf = Buffer.isBuffer(e) ? e : hexToBuffer(e);
    return hashLeaves ? bufferKeccak(leaf) : leaf;
  });

  const layers: Buffer[][] = [leaves];

  // Get next layer until we reach the root
  while (layers[layers.length - 1].length > 1) {
    layers.push(getNextLayer(layers[layers.length - 1]));
  }

  return layers[layers.length - 1][0];
};

class DefaultGetter<Types extends EIP712TypeDefinitions> {
  defaultValues: DefaultMap<Types> = {} as DefaultMap<Types>;

  constructor(protected types: Types) {
    for (const name in types) {
      const defaultValue = this.getDefaultValue(name);
      this.defaultValues[name] = defaultValue;
      // if (!isNullish(defaultValue)) {
      //   logger.throwError(
      //     `Got non-empty value for type ${name} in default generator: ${defaultValue}`
      //   );
      // }
    }
  }

  /* eslint-disable no-dupe-class-members */
  static from<Types extends EIP712TypeDefinitions>(
    types: Types
  ): DefaultMap<Types>;

  static from<Types extends EIP712TypeDefinitions>(
    types: Types,
    type: keyof Types
  ): any;

  static from<Types extends EIP712TypeDefinitions>(
    types: Types,
    type?: keyof Types
  ): DefaultMap<Types> {
    const { defaultValues } = new DefaultGetter(types);
    if (type) return defaultValues[type];
    return defaultValues;
  }
  /* eslint-enable no-dupe-class-members */

  getDefaultValue(type: string): any {
    if (this.defaultValues[type]) return this.defaultValues[type];
    // Basic type (address, bool, uint256, etc)
    const basic = getDefaultForBaseType(type);
    if (basic !== undefined) return basic;

    // Array
    const match = type.match(/^(.*)(\x5b(\d*)\x5d)$/);
    if (match) {
      const subtype = match[1];
      const length = parseInt(match[3]);
      if (length > 0) {
        const baseValue = this.getDefaultValue(subtype);
        return Array(length).fill(baseValue);
      }
      return [];
    }

    // Struct
    const fields = this.types[type];
    if (fields) {
      return fields.reduce(
        (obj, { name, type }) => ({
          ...obj,
          [name]: this.getDefaultValue(type),
        }),
        {}
      );
    }

    // return logger.throwArgumentError(`unknown type: ${type}`, "type", type);
  }
}

const toHex = (value: string): string => utils.hexlify(value);

const getTree = (leaves: string[], defaultLeafHash: string) =>
  new MerkleTree(leaves.map(toHex), bufferKeccak, {
    sort: false,
    hashLeaves: false,
    fillDefaultHash: hexToBuffer(defaultLeafHash),
  });

// const encodeProof = (
//   key: number,
//   proof: string[],
//   signature = `0x${"ff".repeat(64)}`
// ) => {
//   return hexConcat([
//     signature,
//     `0x${key.toString(16).padStart(6, "0")}`,
//     defaultAbiCoder.encode([`uint256[${proof.length}]`], [proof]),
//   ]);
// };

export class Eip712MerkleTree<BaseType extends Record<string, any> = any> {
  tree: MerkleTree;
  private leafHasher: (value: any) => string;
  defaultNode: BaseType;
  defaultLeaf: string;
  encoder: utils._TypedDataEncoder;

  get completedSize() {
    return Math.pow(2, this.depth);
  }

  /** Returns the array of elements in the tree, padded to the complete size with empty items. */
  getCompleteElements() {
    const elements = this.elements;
    return fillArray([...elements], this.completedSize, this.defaultNode);
  }

  /** Returns the array of leaf nodes in the tree, padded to the complete size with default hashes. */
  getCompleteLeaves() {
    const leaves = this.elements.map(this.leafHasher);
    return fillArray([...leaves], this.completedSize, this.defaultLeaf);
  }

  get root() {
    return this.tree.getHexRoot();
  }

  getProof(i: number) {
    const leaves = this.getCompleteLeaves();
    const leaf = leaves[i];
    const proof = this.tree.getHexProof(leaf, i);
    const root = this.tree.getHexRoot();
    return { leaf, proof, root };
  }

//   getEncodedProofAndSignature(i: number, signature: string) {
//     const { proof } = this.getProof(i);
//     return encodeProof(i, proof, signature);
//   }

  getDataToSign(): MerkleOrderElements {
    let layer = this.getCompleteElements() as any;
    while (layer.length > 2) {
      layer = chunk(layer, 2);
    }
    return layer;
  }

//   add(element: BaseType) {
//     this.elements.push(element);
//   }

  getMerkleOrderHash() {
    const structHash = this.encoder.hashStruct("MerkleOrder", {
      tree: this.getDataToSign(),
    });
    const leaves = this.getCompleteLeaves().map(hexToBuffer);
    const rootHash = utils.hexlify(getRoot(leaves, false));
    const typeHash = utils.keccak256(utils.toUtf8Bytes(this.encoder._types.MerkleOrder));
    const merkleOrderHash = utils.keccak256(utils.hexConcat([typeHash, rootHash]));

    console.log("typeHash is ", typeHash);

    console.log("merkleOrderHash is ", merkleOrderHash);
    console.log("structHash is ", structHash);

    if (merkleOrderHash !== structHash) {
      throw new Error("expected derived bulk order hash to match");
    }

    return structHash;
  }

  constructor(
    public types: EIP712TypeDefinitions,
    public rootType: string,
    public leafType: string,
    public elements: BaseType[],
    public depth: number
  ) {
    const encoder = utils._TypedDataEncoder.from(types);
    this.encoder = encoder;
    this.leafHasher = (leaf: BaseType) => encoder.hashStruct(leafType, leaf);
    this.defaultNode = DefaultGetter.from(types, leafType);
    this.defaultLeaf = this.leafHasher(this.defaultNode);
    this.tree = getTree(this.getCompleteLeaves(), this.defaultLeaf);
  }
}

function getMerkleOrderTreeHeight(length: number): number {
  return Math.max(Math.ceil(Math.log2(length)), 1);
}

function getMerkleOrderTypes(height: number): EIP712TypeDefinitions {
  const types = { ...merkleOrderTypes };
  types.MerkleOrder = [
    { name: "tree", type: `MakerAsk${`[2]`.repeat(height)}` },
  ];
  return types;
}

export function getMerkleOrderTree(
  makerAsks: MakerAsk[],
  startIndex = 0,
  height = getMerkleOrderTreeHeight(makerAsks.length + startIndex)
) {
  const types = getMerkleOrderTypes(height);
  const defaultNode = DefaultGetter.from(types, "MakerAsk");
  let elements = [...makerAsks];

  if (startIndex > 0) {
    elements = [
      ...fillArray([] as MakerAsk[], startIndex, defaultNode),
      ...makerAsks,
    ];
  }
  const tree = new Eip712MerkleTree(
    types,
    "MerkleOrder",
    "MakerAsk",
    elements,
    height
  );
  return tree;
}