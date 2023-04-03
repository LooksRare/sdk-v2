import { TypedDataSigner, TypedDataDomain } from "@ethersproject/abstract-signer";
import { utils } from "ethers";
import { Eip712MakerMerkleTree } from "./Eip712MakerMerkleTree";
import { makerTypes } from "../constants/eip712";
import { Maker, MerkleTree, SignMerkleTreeOrdersOutput } from "../types";

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
  const signature = await signer._signTypedData(domain, makerTypes, makerOrder);
  return utils.joinSignature(signature);
};

/**
 * Sign a list of maker orders with a merkle tree
 * @param signer Ethers typed data signer
 * @param domain Typed data domain
 * @param makerOrder Maker order
 * @returns Signature, array of proofs, and tree
 */
export const signMerkleTreeOrders = async (
  signer: TypedDataSigner,
  domain: TypedDataDomain,
  makerOrders: Maker[]
): Promise<SignMerkleTreeOrdersOutput> => {
  const tree = new Eip712MakerMerkleTree(makerOrders);

  const hexRoot = tree.hexRoot;
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

  const signature = await signer._signTypedData(domain, tree.types, tree.getDataToSign());
  return { signature: utils.joinSignature(signature), merkleTreeProofs, tree };
};
