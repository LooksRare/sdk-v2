import { Contract, Overrides, providers } from "ethers";
import { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import abi from "../../abis/LooksRareProtocol.json";
import { Signer, StrategyType, StrategyInfo } from "../../types";

export const strategyInfo = async (
  signerOrProvider: providers.Provider | Signer,
  address: string,
  strategyId: StrategyType,
  overrides?: Overrides
): Promise<StrategyInfo> => {
  const contract = new Contract(address, abi, signerOrProvider) as LooksRareProtocol;
  const strategy = await contract.strategyInfo(strategyId, { ...overrides });
  return {
    isActive: strategy.isActive,
    standardProtocolFeeBp: strategy.standardProtocolFeeBp,
    minTotalFeeBp: strategy.minTotalFeeBp,
    maxProtocolFeeBp: strategy.maxProtocolFeeBp,
  };
};
