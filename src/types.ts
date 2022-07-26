import { BigNumberish, BytesLike } from "ethers";

export enum SupportedChainId {
  MAINNET = 1,
  RINKEBY = 4,
  HARDHAT = 31337,
}

export enum AssetType {
  ERC721 = 0,
  ERC1155 = 1,
}

// Orders

export interface BaseMakerOrder {
  bidAskNonce: BigNumberish;
  subsetNonce: BigNumberish;
  strategyId: number;
  assetType: number;
  collection: string;
  currency: string;
  recipient: string;
  signer: string;
  startTime: BigNumberish;
  endTime: BigNumberish;
  minNetRatio: BigNumberish;
}

export interface SingleMakerAskOrder {
  minPrice: BigNumberish;
  itemIds: BigNumberish[];
  amounts: BigNumberish[];
  orderNonce: BigNumberish;
  additionalParameters: BytesLike;
}

export interface SingleMakerBidOrder {
  maxPrice: BigNumberish;
  itemIds: BigNumberish[];
  amounts: BigNumberish[];
  orderNonce: BigNumberish;
  additionalParameters: BytesLike;
}

export interface MultipleMakerBidOrders {
  makerBidOrders: SingleMakerBidOrder[];
  baseMakerOrder: BaseMakerOrder;
}

export interface MultipleMakerBidOrdersWithSignature extends MultipleMakerBidOrders {
  signature: string;
}

export interface MultipleMakerAskOrders {
  makerAskOrders: SingleMakerAskOrder[];
  baseMakerOrder: BaseMakerOrder;
}

export interface MultipleMakerAskOrdersWithSignature extends MultipleMakerAskOrders {
  signature: string;
}

export interface TakerBidOrder {
  maxPrice: BigNumberish;
  recipient: string;
  itemIds: BigNumberish[];
  amounts: BigNumberish[];
  additionalParameters: BytesLike;
}

export interface MultipleTakerBidOrders {
  referrer: string;
  currency: string;
  takerBidOrders: TakerBidOrder[];
}

export interface TakerAskOrder {
  recipient: string;
  minPrice: BigNumberish;
  itemIds: BigNumberish[];
  amounts: BigNumberish[];
  minNetRatio: BigNumberish;
  additionalParameters: BytesLike;
}

export interface MultipleTakerAskOrders {
  referrer: string;
  currency: string;
  takerAskOrders: TakerAskOrder[];
}
