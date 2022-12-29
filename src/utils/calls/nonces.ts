import { Contract, BigNumber, Overrides, providers, BigNumberish } from "ethers";
import { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import abi from "../../abis/LooksRareProtocol.json";
import { Signer, ContractMethods } from "../../types";

export const viewUserBidAskNonces = async (
  signerOrProvider: providers.Provider | Signer,
  address: string,
  account: string,
  overrides?: Overrides
): Promise<{ bidNonce: BigNumberish; askNonce: BigNumberish }> => {
  const contract = new Contract(address, abi, signerOrProvider) as LooksRareProtocol;
  const nonces = await contract.userBidAskNonces(account, { ...overrides });
  return { bidNonce: nonces[0], askNonce: nonces[1] };
};

export const cancelOrderNonces = (
  signer: Signer,
  address: string,
  nonces: BigNumber[],
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi, signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.cancelOrderNonces(nonces, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.estimateGas.cancelOrderNonces(nonces, { ...overrides, ...additionalOverrides }),
  };
};

export const cancelSubsetNonces = (
  signer: Signer,
  address: string,
  nonces: BigNumber[],
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi, signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.cancelSubsetNonces(nonces, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.estimateGas.cancelSubsetNonces(nonces, { ...overrides, ...additionalOverrides }),
  };
};

export const incrementBidAskNonces = (
  signer: Signer,
  address: string,
  bid: boolean,
  ask: boolean,
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi, signer) as LooksRareProtocol;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.incrementBidAskNonces(bid, ask, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.estimateGas.incrementBidAskNonces(bid, ask, { ...overrides, ...additionalOverrides }),
  };
};
