import { Contract, CallOverrides, Provider } from "ethers";
import { LooksRareProtocol } from "../../typechain/@looksrare/contracts-exchange-v2/contracts/LooksRareProtocol";
import abi from "../../abis/LooksRareProtocol.json";
import { Signer, StrategyType, StrategyInfo } from "../../types";

export const strategyInfo = async (
  signerOrProvider: Provider | Signer,
  address: string,
  strategyId: StrategyType,
  overrides?: CallOverrides
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
