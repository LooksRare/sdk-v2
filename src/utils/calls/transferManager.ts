import { Contract, Overrides, Provider } from "ethers";
import { TransferManager } from "../../typechain/@looksrare/contracts-exchange-v2/contracts/TransferManager";
import abi from "../../abis/TransferManager.json";
import { Signer, ContractMethods, BatchTransferItem } from "../../types";

export const hasUserApprovedOperator = async (
  signerOrProvider: Provider | Signer,
  address: string,
  user: string,
  operator: string,
  overrides?: Overrides
): Promise<boolean> => {
  const contract = new Contract(address, abi).connect(signerOrProvider) as TransferManager;
  const hasApproved = await contract.hasUserApprovedOperator(user, operator, { ...overrides });
  return hasApproved;
};

export const grantApprovals = (
  signer: Signer,
  address: string,
  operators: string[],
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi).connect(signer) as TransferManager;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.grantApprovals(operators, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.grantApprovals.estimateGas(operators, { ...overrides, ...additionalOverrides }),
    callStatic: (additionalOverrides?: Overrides) =>
      contract.grantApprovals.staticCall(operators, { ...overrides, ...additionalOverrides }),
  };
};

export const revokeApprovals = (
  signer: Signer,
  address: string,
  operators: string[],
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi).connect(signer) as TransferManager;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.revokeApprovals(operators, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.revokeApprovals.estimateGas(operators, { ...overrides, ...additionalOverrides }),
    callStatic: (additionalOverrides?: Overrides) =>
      contract.revokeApprovals.staticCall(operators, { ...overrides, ...additionalOverrides }),
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
  const contract = new Contract(address, abi).connect(signer) as TransferManager;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.transferBatchItemsAcrossCollections(items, from, to, {
        ...overrides,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.transferBatchItemsAcrossCollections.estimateGas(items, from, to, {
        ...overrides,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: Overrides) =>
      contract.transferBatchItemsAcrossCollections.staticCall(items, from, to, {
        ...overrides,
        ...additionalOverrides,
      }),
  };
};
