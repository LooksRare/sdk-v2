import { Contract, BigNumber, Overrides } from "ethers";
import { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import abi from "../../abis/LooksRareProtocol.json";
import { Signer } from "../../types";

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
