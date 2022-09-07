import { Contract, Signer, providers, BigNumber, Overrides } from "ethers";
import { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import abi from "../../abis/LooksRareProtocol.json";

export const cancelOrderNonces = (
  signerOrProvider: Signer | providers.Provider,
  address: string,
  nonces: BigNumber[],
  overrides?: Overrides
) => {
  const contract = new Contract(address, abi, signerOrProvider) as LooksRareProtocol;
  return contract.cancelOrderNonces(nonces, { ...overrides });
};

export const cancelSubsetNonces = (
  signerOrProvider: Signer | providers.Provider,
  address: string,
  nonces: BigNumber[],
  overrides?: Overrides
) => {
  const contract = new Contract(address, abi, signerOrProvider) as LooksRareProtocol;
  return contract.cancelSubsetNonces(nonces, { ...overrides });
};

export const incrementBidAskNonces = (
  signerOrProvider: Signer | providers.Provider,
  address: string,
  bid: boolean,
  ask: boolean,
  overrides?: Overrides
) => {
  const contract = new Contract(address, abi, signerOrProvider) as LooksRareProtocol;
  return contract.incrementBidAskNonces(bid, ask, { ...overrides });
};
