import { Contract, Signer, providers, BigNumberish, Overrides } from "ethers";
import { TransferManager } from "../../../typechain/contracts-exchange-v2/contracts/TransferManager";
import abi from "../../abis/TransferManager.json";
import { AssetType } from "../../types";

export const transferSingleItem = (
  signerOrProvider: Signer | providers.Provider,
  address: string,
  collection: string,
  assetType: AssetType,
  from: string,
  to: string,
  itemId: BigNumberish,
  amount: BigNumberish = 1,
  overrides?: Overrides
) => {
  const contract = new Contract(address, abi, signerOrProvider) as TransferManager;
  return contract.transferSingleItem(collection, assetType, from, to, itemId, amount, { ...overrides });
};

export const transferBatchItems = (
  signerOrProvider: Signer | providers.Provider,
  address: string,
  collection: string,
  assetType: AssetType,
  from: string,
  to: string,
  itemIds: BigNumberish[],
  amounts: BigNumberish[],
  overrides?: Overrides
) => {
  const contract = new Contract(address, abi, signerOrProvider) as TransferManager;
  return contract.transferBatchItems(collection, assetType, from, to, itemIds, amounts, { ...overrides });
};

export const transferBatchItemsAcrossCollections = (
  signerOrProvider: Signer | providers.Provider,
  address: string,
  collections: string[],
  assetTypes: AssetType[],
  from: string,
  to: string,
  itemIds: BigNumberish[][],
  amounts: BigNumberish[][],
  overrides?: Overrides
) => {
  const contract = new Contract(address, abi, signerOrProvider) as TransferManager;
  return contract.transferBatchItemsAcrossCollections(collections, assetTypes, from, to, itemIds, amounts, {
    ...overrides,
  });
};

export const grantApprovals = (
  signerOrProvider: Signer | providers.Provider,
  address: string,
  operators: string[],
  overrides?: Overrides
) => {
  const contract = new Contract(address, abi, signerOrProvider) as TransferManager;
  return contract.grantApprovals(operators, { ...overrides });
};

export const revokeApprovals = (
  signerOrProvider: Signer | providers.Provider,
  address: string,
  operators: string[],
  overrides?: Overrides
) => {
  const contract = new Contract(address, abi, signerOrProvider) as TransferManager;
  return contract.revokeApprovals(operators, { ...overrides });
};
