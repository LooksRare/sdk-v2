import { utils } from "ethers";
import { hashingMakerTypes, MAKER_ASK_HASH, MAKER_BID_HASH } from "../constants/eip712";
import { MakerAsk, MakerBid } from "../types";

/**
 * Hash maker ask order
 * @external OrderStruct hash function
 * @param makerAsk
 * @returns string (bytes32)
 */
export const getMakerAskHash = (makerAsk: MakerAsk): string => {
  const values = [
    MAKER_ASK_HASH,
    makerAsk.askNonce,
    makerAsk.subsetNonce,
    makerAsk.strategyId,
    makerAsk.assetType,
    makerAsk.orderNonce,
    makerAsk.collection,
    makerAsk.currency,
    makerAsk.recipient,
    makerAsk.signer,
    makerAsk.startTime,
    makerAsk.endTime,
    makerAsk.minPrice,
    utils.keccak256(utils.solidityPack(["uint256[]"], [makerAsk.itemIds])),
    utils.keccak256(utils.solidityPack(["uint256[]"], [makerAsk.amounts])),
    utils.keccak256(makerAsk.additionalParameters),
  ];
  return utils.keccak256(utils.defaultAbiCoder.encode(hashingMakerTypes, values));
};

/**
 * Hash maker ask order
 * @external OrderStruct hash function
 * @param makerBid
 * @returns string (bytes32)
 */
export const getMakerBidHash = (makerBid: MakerBid): string => {
  const values = [
    MAKER_BID_HASH,
    makerBid.bidNonce,
    makerBid.subsetNonce,
    makerBid.strategyId,
    makerBid.assetType,
    makerBid.orderNonce,
    makerBid.collection,
    makerBid.currency,
    makerBid.recipient,
    makerBid.signer,
    makerBid.startTime,
    makerBid.endTime,
    makerBid.maxPrice,
    utils.keccak256(utils.solidityPack(["uint256[]"], [makerBid.itemIds])),
    utils.keccak256(utils.solidityPack(["uint256[]"], [makerBid.amounts])),
    utils.keccak256(makerBid.additionalParameters),
  ];
  return utils.keccak256(utils.defaultAbiCoder.encode(hashingMakerTypes, values));
};
