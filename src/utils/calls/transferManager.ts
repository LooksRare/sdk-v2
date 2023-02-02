import { Contract, Overrides, providers } from "ethers";
import { TransferManager } from "../../../typechain/contracts-exchange-v2/contracts/TransferManager";
import abi from "../../abis/TransferManager.json";
import { Signer, ContractMethods, BatchTransferItem } from "../../types";

export const hasUserApprovedOperator = async (
  signerOrProvider: providers.Provider | Signer,
  address: string,
  user: string,
  operator: string,
  overrides?: Overrides
): Promise<boolean> => {
  const contract = new Contract(address, abi, signerOrProvider) as TransferManager;
  const hasApproved = await contract.hasUserApprovedOperator(user, operator, { ...overrides });
  return hasApproved;
};

export const grantApprovals = (
  signer: Signer,
  address: string,
  operators: string[],
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi, signer) as TransferManager;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.grantApprovals(operators, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.estimateGas.grantApprovals(operators, { ...overrides, ...additionalOverrides }),
    callStatic: (additionalOverrides?: Overrides) =>
      contract.callStatic.grantApprovals(operators, { ...overrides, ...additionalOverrides }),
  };
};

export const revokeApprovals = (
  signer: Signer,
  address: string,
  operators: string[],
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi, signer) as TransferManager;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.revokeApprovals(operators, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.estimateGas.revokeApprovals(operators, { ...overrides, ...additionalOverrides }),
    callStatic: (additionalOverrides?: Overrides) =>
      contract.callStatic.revokeApprovals(operators, { ...overrides, ...additionalOverrides }),
  };
};

export const transferBatchItemsAcrossCollections = (
  signer: Signer,
  address: string,
  items: BatchTransferItem[],
  from: string,
  to: string,
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi, signer) as TransferManager;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.transferBatchItemsAcrossCollections(items, from, to, {
        ...overrides,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.estimateGas.transferBatchItemsAcrossCollections(items, from, to, {
        ...overrides,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: Overrides) =>
      contract.callStatic.transferBatchItemsAcrossCollections(items, from, to, {
        ...overrides,
        ...additionalOverrides,
      }),
  };
};
