import { Contract, Provider, Overrides, Signer } from "ethers";
import { OrderValidatorV2A } from "../../typechain/@looksrare/contracts-exchange-v2/contracts/helpers/OrderValidatorV2A";
import abi from "../../abis/OrderValidatorV2A.json";
import { Maker, MerkleTree, OrderValidatorCode } from "../../types";

export const verifyMakerOrders = async (
  signerOrProvider: Provider | Signer,
  address: string,
  makerOrders: Maker[],
  signatures: string[],
  merkleTrees: MerkleTree[],
  overrides?: Overrides
): Promise<OrderValidatorCode[][]> => {
  const contract = new Contract(address, abi).connect(signerOrProvider) as OrderValidatorV2A;
  const orders = await contract.checkMultipleMakerOrderValidities(makerOrders, signatures, merkleTrees, {
    ...overrides,
  });
  return orders.map((order) => order.map((code) => Number(code) as OrderValidatorCode));
};
