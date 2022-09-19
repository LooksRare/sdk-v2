import { Contract, BigNumber, Overrides, providers } from "ethers";
import { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import abi from "../../abis/LooksRareProtocol.json";
import { Signer } from "../../types";

export const viewUserBidAskNonces = (
  signerOrProvider: providers.Provider | Signer,
  address: string,
  account: string,
  overrides?: Overrides
) => {
  const contract = new Contract(address, abi, signerOrProvider) as LooksRareProtocol;
  return contract.viewUserBidAskNonces(account, { ...overrides });
};

export const cancelOrderNonces = (signer: Signer, address: string, nonces: BigNumber[], overrides?: Overrides) => {
  const contract = new Contract(address, abi, signer) as LooksRareProtocol;
  return contract.cancelOrderNonces(nonces, { ...overrides });
};

export const cancelSubsetNonces = (signer: Signer, address: string, nonces: BigNumber[], overrides?: Overrides) => {
  const contract = new Contract(address, abi, signer) as LooksRareProtocol;
  return contract.cancelSubsetNonces(nonces, { ...overrides });
};

export const incrementBidAskNonces = (
  signer: Signer,
  address: string,
  bid: boolean,
  ask: boolean,
  overrides?: Overrides
) => {
  const contract = new Contract(address, abi, signer) as LooksRareProtocol;
  return contract.incrementBidAskNonces(bid, ask, { ...overrides });
};
