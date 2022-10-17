import { Contract, BigNumberish, Overrides } from "ethers";
import { TransferManager } from "../../../typechain/contracts-exchange-v2/contracts/TransferManager";
import abi from "../../abis/TransferManager.json";
import { AssetType, Signer } from "../../types";

export const transferBatchItemsAcrossCollections = (
  signer: Signer,
  address: string,
  collections: string[],
  assetTypes: AssetType[],
  from: string,
  to: string,
  itemIds: BigNumberish[][],
  amounts: BigNumberish[][],
  overrides?: Overrides
) => {
  const contract = new Contract(address, abi, signer) as TransferManager;
  return contract.transferBatchItemsAcrossCollections(collections, assetTypes, from, to, itemIds, amounts, {
    ...overrides,
  });
};

export const grantApprovals = (signer: Signer, address: string, operators: string[], overrides?: Overrides) => {
  const contract = new Contract(address, abi, signer) as TransferManager;
  return contract.grantApprovals(operators, { ...overrides });
};

export const revokeApprovals = (signer: Signer, address: string, operators: string[], overrides?: Overrides) => {
  const contract = new Contract(address, abi, signer) as TransferManager;
  return contract.revokeApprovals(operators, { ...overrides });
};
