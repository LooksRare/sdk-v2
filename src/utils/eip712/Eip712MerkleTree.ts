import { _TypedDataEncoder as TypedDataEncoder } from "@ethersproject/hash";
import { MerkleTree } from "merkletreejs";
import { bufferKeccak, chunk, fillArray, hexToBuffer } from "./utils";
import { defaultMaker } from "./defaultMaker";
import { Maker, EIP712TypedData } from "../../types";

type BulkOrderElements = [Maker, Maker] | [BulkOrderElements, BulkOrderElements];

export class Eip712MerkleTree<BaseType extends Record<string, any> = any> {
  tree: MerkleTree;
  private leafHasher: (value: any) => string;
  defaultNode: any;
  defaultLeaf: string;
  encoder: TypedDataEncoder;

  constructor(
    public types: EIP712TypedData,
    public rootType: string,
    public leafType: string,
    public elements: BaseType[],
    public depth: number
  ) {
    const encoder = TypedDataEncoder.from(types);
    this.encoder = encoder;
    this.leafHasher = (leaf: BaseType) => encoder.hashStruct(leafType, leaf);
    this.defaultNode = defaultMaker;
    this.defaultLeaf = this.leafHasher(this.defaultNode);
    this.tree = new MerkleTree(this.getCompleteLeaves().map(hexToBuffer), bufferKeccak, {
      // complete: true,
      sort: false,
      hashLeaves: false,
      fillDefaultHash: hexToBuffer(this.defaultLeaf),
    });
  }

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

  getProof(i: number) {
    const leaves = this.getCompleteLeaves();
    const leaf = leaves[i];
    const proof = this.tree.getHexProof(leaf, i);
    const root = this.tree.getHexRoot();
    return { leaf, proof, root };
  }

  getDataToSign(): BulkOrderElements {
    let layer = this.getCompleteElements() as any;
    while (layer.length > 2) {
      layer = chunk(layer, 2);
    }
    return layer;
  }
}
