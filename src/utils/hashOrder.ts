import { utils } from "ethers";
import { hashingMakerTypes, MAKER_HASH } from "../constants/eip712";
import { Maker } from "../types";

/**
 * Hash maker ask order
 * @external OrderStruct hash function
 * @param maker Maker
 * @returns string (bytes32)
 */
export const getMakerHash = (maker: Maker): string => {
  const values = [
    MAKER_HASH,
    maker.quoteType,
    maker.globalNonce,
    maker.subsetNonce,
    maker.strategyId,
    maker.collectionType,
    maker.orderNonce,
    maker.collection,
    maker.currency,
    maker.signer,
    maker.startTime,
    maker.endTime,
    maker.price,
    utils.keccak256(utils.solidityPack(["uint256[]"], [maker.itemIds])),
    utils.keccak256(utils.solidityPack(["uint256[]"], [maker.amounts])),
    utils.keccak256(maker.additionalParameters),
  ];
  return utils.keccak256(utils.defaultAbiCoder.encode(hashingMakerTypes, values));
};
