import { BytesLike, utils } from "ethers";
import { SolidityType, StrategyType } from "../types";

export const getMakerParamsTypes = (strategy: StrategyType): SolidityType[] => {
  if (strategy === StrategyType.standard || strategy === StrategyType.collection) {
    return [];
  }
  return [];
};

export const getTakerParamsTypes = (strategy: StrategyType): SolidityType[] => {
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
export const encodeParams = (params: any[], types: SolidityType[]): BytesLike => {
  return utils.defaultAbiCoder.encode(types, params);
};
