import { _TypedDataEncoder as TypedDataEncoder } from "@ethersproject/hash";
import { keccak256, BytesLike } from "ethers/lib/utils";
import { MerkleTree } from "merkletreejs";
import { defaultMaker } from "../constants/defaultValues";
import { Maker, EIP712TypedData } from "../types";

type BatchOrderElements = [Maker, Maker] | [BatchOrderElements, BatchOrderElements];

const makeArray = <T>(len: number, getValue: (i: number) => T) =>
  Array(len)
    .fill(0)
    .map((_, i) => getValue(i));

const chunk = <T>(array: T[], size: number) => {
  return makeArray(Math.ceil(array.length / size), (i) => array.slice(i * size, (i + 1) * size));
};

const hexToBuffer = (value: string) => Buffer.from(value.slice(2), "hex");

const fillArray = <T>(arr: T[], length: number, value: T) => {
  if (length > arr.length) {
    arr.push(...Array(length - arr.length).fill(value));
  }
  return arr;
};

export class Eip712MerkleTree<BaseType extends Record<string, any> = any> {
  public tree: MerkleTree;
  private defaultNode: any;
  private completeLeaves: string[];

  constructor(
    public types: EIP712TypedData,
    public rootType: string,
    public leafType: string,
    public elements: BaseType[],
    public depth: number
  ) {
    const encoder = TypedDataEncoder.from(types);
    const leafHasher = (leaf: BaseType) => encoder.hashStruct(leafType, leaf);
    this.defaultNode = defaultMaker;
    const defaultLeaf = leafHasher(this.defaultNode);
    const leaves = this.elements.map(leafHasher);
    this.completeLeaves = fillArray([...leaves], this.completedSize, defaultLeaf);
    this.tree = new MerkleTree(
      this.completeLeaves.map(hexToBuffer),
      (value: BytesLike) => hexToBuffer(keccak256(value)),
      {
        // complete: true,
        sort: false,
        hashLeaves: false,
        fillDefaultHash: hexToBuffer(defaultLeaf),
      }
    );
  }

  get completedSize() {
    return Math.pow(2, this.depth);
  }

  public getHexRoot() {
    return this.tree.getHexRoot();
  }

  public getPositionalProof(i: number) {
    const leaf = this.completeLeaves[i];
    const proof = this.tree.getPositionalHexProof(leaf, i);
    return { leaf, proof };
  }

  private getCompleteElements() {
    const elements = this.elements;
    return fillArray([...elements], this.completedSize, this.defaultNode);
  }

  public getDataToSign(): { tree: BatchOrderElements } {
    let layer = this.getCompleteElements() as any;
    while (layer.length > 2) {
      layer = chunk(layer, 2);
    }
    return { tree: layer };
  }
}
