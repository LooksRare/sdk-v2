import { BigNumber, BigNumberish, ContractTransaction } from "ethers";
import { encodeParams, getMakerParamsTypes, getTakerParamsTypes } from "../utils/encodeOrderParams";
import { setApprovalForAll, isApprovedForAll, allowance, approve } from "./calls/tokens";
import { minNetPriceRatio } from "../constants";
import { MakerAsk, MakerBid, Signer, StrategyType, AssetType } from "../types";

// Create and sign maker ask order

export interface MakerAskOutputs {
  order: MakerAsk;
  action?: () => Promise<ContractTransaction>;
}

export interface MakerAskInputs {
  collection: string;
  strategy: StrategyType;
  assetType: AssetType;
  askNonce: BigNumberish;
  subsetNonce: BigNumberish;
  orderNonce: BigNumberish;
  endTime: BigNumberish;
  price: BigNumberish;
  currency: string;
  itemIds?: BigNumberish[];
  amounts?: BigNumberish[];
  recipient?: string;
  startTime?: BigNumberish;
  additionalParameters?: any[];
}

export const createMakerAsk = async (
  signer: Signer,
  spenderAddress: string,
  {
    collection,
    strategy,
    assetType,
    askNonce,
    subsetNonce,
    orderNonce,
    endTime,
    price,
    currency,
    startTime = Math.floor(Date.now() / 1000),
    recipient = undefined,
    itemIds = [],
    amounts = [1],
    additionalParameters = [],
  }: MakerAskInputs
): Promise<MakerAskOutputs> => {
  if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
    throw new Error("Timestamps should be in seconds");
  }

  const signerAddress = await signer.getAddress();

  const order: MakerAsk = {
    askNonce: askNonce,
    subsetNonce: subsetNonce,
    strategyId: strategy,
    assetType: assetType,
    orderNonce: orderNonce,
    minNetRatio: minNetPriceRatio, // @TODO update with protocol fees and royalties data
    collection: collection,
    currency: currency,
    recipient: recipient ?? signerAddress,
    signer: signerAddress,
    startTime: startTime,
    endTime: endTime,
    minPrice: price,
    itemIds: itemIds,
    amounts: amounts,
    additionalParameters: encodeParams(additionalParameters, getMakerParamsTypes(strategy)),
  };

  const isCollectionApproved = await isApprovedForAll(signer, collection, signerAddress, spenderAddress);
  const action = isCollectionApproved ? undefined : () => setApprovalForAll(signer, collection, spenderAddress);

  return { order, action };
};

// Create and sign maker bid order

export interface MakerBidOutputs {
  order: MakerBid;
  action?: () => Promise<ContractTransaction>;
}

export interface MakerBidInputs {
  collection: string;
  strategy: StrategyType;
  assetType: AssetType;
  bidNonce: BigNumberish;
  subsetNonce: BigNumberish;
  orderNonce: BigNumberish;
  endTime: BigNumberish;
  price: BigNumberish;
  currency: string;
  itemIds?: BigNumberish[];
  amounts?: BigNumberish[];
  recipient?: string;
  startTime?: BigNumberish;
  additionalParameters?: any[];
}

export const createMakerBid = async (
  signer: Signer,
  spenderAddress: string,
  {
    collection,
    strategy,
    assetType,
    bidNonce,
    subsetNonce,
    orderNonce,
    endTime,
    price,
    currency,
    startTime = Math.floor(Date.now() / 1000),
    recipient = undefined,
    itemIds = [],
    amounts = [1],
    additionalParameters = [],
  }: MakerBidInputs
): Promise<MakerBidOutputs> => {
  if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
    throw new Error("Timestamps should be in seconds");
  }

  const signerAddress = await signer.getAddress();

  const order: MakerBid = {
    bidNonce: bidNonce,
    subsetNonce: subsetNonce,
    strategyId: strategy,
    assetType: assetType,
    orderNonce: orderNonce,
    minNetRatio: minNetPriceRatio, // @TODO update with protocol fees and royalties data
    collection: collection,
    currency: currency,
    recipient: recipient ?? signerAddress,
    signer: signerAddress,
    startTime: startTime,
    endTime: endTime,
    maxPrice: price,
    itemIds: itemIds,
    amounts: amounts,
    additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(strategy)),
  };

  const currentAllowance = await allowance(signer, currency, signerAddress, spenderAddress);
  const action = BigNumber.from(currentAllowance).lt(price)
    ? () => approve(signer, currency, spenderAddress)
    : undefined;

  return { order, action };
};
