import { Contract, Overrides, providers } from "ethers";
import { OrderValidatorV2A } from "../../../typechain/contracts-exchange-v2/contracts/helpers/OrderValidatorV2A";
import abi from "../../abis/OrderValidatorV2A.json";
import { Signer, MakerAsk, MakerBid, MerkleTree, OrderValidatorCode } from "../../types";

export const verifyMakerAskOrders = async (
  signerOrProvider: providers.Provider | Signer,
  address: string,
  makerAskOrders: MakerAsk[],
  signatures: string[],
  merkleTrees: MerkleTree[],
  overrides?: Overrides
): Promise<OrderValidatorCode[][]> => {
  const contract = new Contract(address, abi, signerOrProvider) as OrderValidatorV2A;
  const orders = await contract.verifyMultipleMakerAskOrders(makerAskOrders, signatures, merkleTrees, { ...overrides });
  return orders.map((order) => order.map((code) => code.toNumber() as OrderValidatorCode));
};

export const verifyMakerBidOrders = async (
  signerOrProvider: providers.Provider | Signer,
  address: string,
  makerBidOrders: MakerBid[],
  signatures: string[],
  merkleTrees: MerkleTree[],
  overrides?: Overrides
): Promise<OrderValidatorCode[][]> => {
  const contract = new Contract(address, abi, signerOrProvider) as OrderValidatorV2A;
  const orders = await contract.verifyMultipleMakerBidOrders(makerBidOrders, signatures, merkleTrees, { ...overrides });
  return orders.map((order) => order.map((code) => code.toNumber() as OrderValidatorCode));
};
