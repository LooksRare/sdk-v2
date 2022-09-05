import { BytesLike, utils } from "ethers";
import { SolidityType, StrategyType } from "../types";

export const getStrategyParamsTypes = (strategy: StrategyType): SolidityType[] => {
  if (strategy === StrategyType.standard || strategy === StrategyType.collection) {
    return [];
  }
  return [];
};

/**
 * Given an array of params, returns the encoded params.
 * To be used for orders signature and orders execution
 * @param params array of params
 * @param strategy array of params
 * @returns encoded params
 */
export const encodeStrategyParams = (params: any[], strategy: StrategyType): BytesLike => {
  const paramsTypes = getStrategyParamsTypes(strategy);
  return utils.defaultAbiCoder.encode(paramsTypes, params);
};
