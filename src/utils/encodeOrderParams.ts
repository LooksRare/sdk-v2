import { BytesLike, utils } from "ethers";
import { SolidityType, Strategy } from "../types";

export const getStrategyParamsTypes = (strategy: Strategy): SolidityType[] => {
  if (strategy === "standard" || strategy === "collection") {
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
export const encodeStrategyParams = (params: any[], strategy: Strategy): BytesLike => {
  const paramsTypes = getStrategyParamsTypes(strategy);
  return utils.defaultAbiCoder.encode(paramsTypes, params);
};
