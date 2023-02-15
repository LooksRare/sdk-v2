import { TypedDataSigner, TypedDataDomain } from "@ethersproject/abstract-signer";
import { Eip712MerkleTree } from "./Eip712MerkleTree";
import { Maker, MerkleTree } from "../types";
import { makerTypes, getBatchOrderTypes } from "../constants/eip712";

/**
 * Sign a maker order
 * @param signer Ethers typed data signer
 * @param domain Typed data domain
 * @param makerOrder Maker order
 * @returns Signature
 */
export const signMakerOrder = async (
  signer: TypedDataSigner,
  domain: TypedDataDomain,
  makerOrder: Maker
): Promise<string> => {
  return signer._signTypedData(domain, makerTypes, makerOrder);
};

/**
 * Sign a list of maker orders with a merkle tree
 * @param signer Ethers typed data signer
 * @param domain Typed data domain
 * @param makerOrder Maker order
 * @returns Signature and tree
 */
export const signMerkleTreeOrders = async (signer: TypedDataSigner, domain: TypedDataDomain, makerOrders: Maker[]) => {
  const height = Math.max(Math.ceil(Math.log2(makerOrders.length)), 1);
  const types = getBatchOrderTypes(height);
  const tree = new Eip712MerkleTree(types, "BatchOrder", "Maker", makerOrders, height);

  const hexRoot = tree.getHexRoot();

  const merkleTreeProofs: MerkleTree[] = makerOrders.map((_, index) => {
    const { proof } = tree.getPositionalProof(index);
    return {
      root: hexRoot,
      proof: proof.map((node) => {
        return {
          position: node[0] as number,
          value: node[1] as string,
        };
      }),
    };
  });

  const signature = await signer._signTypedData(domain, types, tree.getDataToSign());
  return { signature, merkleTreeProofs, tree };
};
