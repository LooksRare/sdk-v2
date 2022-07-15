import { ethers, Contract, BigNumber } from "ethers";
import { LooksRareProtocol } from "../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import abi from "../abis/LooksRareProtocol.json";

export const cancelOrderNonces = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  address: string,
  nonces: BigNumber[]
) => {
  const contract = new Contract(address, abi, signerOrProvider) as LooksRareProtocol;
  return contract.cancelOrderNonces(nonces);
};

export const cancelSubsetNonces = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  address: string,
  nonces: BigNumber[]
) => {
  const contract = new Contract(address, abi, signerOrProvider) as LooksRareProtocol;
  return contract.cancelSubsetNonces(nonces);
};

export const incrementBidAskNonces = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  address: string,
  bid: boolean,
  ask: boolean
) => {
  const contract = new Contract(address, abi, signerOrProvider) as LooksRareProtocol;
  return contract.incrementBidAskNonces(bid, ask);
};
