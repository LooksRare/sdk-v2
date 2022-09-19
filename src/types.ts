import { ethers, BigNumberish, BytesLike, ContractTransaction } from "ethers";
import { TypedDataSigner } from "@ethersproject/abstract-signer";

export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,
  HARDHAT = 31337,
}

export enum AssetType {
  ERC721 = 0,
  ERC1155 = 1,
}

export enum StrategyType {
  standard = 0,
  collection = 1,
}

export type SolidityType =
  | "bool"
  | "address"
  | "uint8"
  | "uint16"
  | "uint112"
  | "uint256"
  | "uint256[]"
  | "bytes"
  | "bytes32"
  | "bytes32[]"
  | "string";

// Ethers override

export type Signer = ethers.Signer & TypedDataSigner;

// Orders inputs

export interface MakerAskOutputs {
  order: MakerAsk;
  action?: () => Promise<ContractTransaction>;
}

export interface MakerAskInputs {
  collection: string;
  strategyId: StrategyType;
  assetType: AssetType;
  subsetNonce: BigNumberish;
  orderNonce: BigNumberish;
  endTime: BigNumberish;
  price: BigNumberish;
  currency: string;
  itemIds: BigNumberish[];
  amounts?: BigNumberish[];
  recipient?: string;
  startTime?: BigNumberish;
  additionalParameters?: any[];
}

// Create and sign maker bid order

export interface MakerBidOutputs {
  order: MakerBid;
  action?: () => Promise<ContractTransaction>;
}

export interface MakerBidInputs {
  collection: string;
  strategyId: StrategyType;
  assetType: AssetType;
  subsetNonce: BigNumberish;
  orderNonce: BigNumberish;
  endTime: BigNumberish;
  price: BigNumberish;
  currency: string;
  itemIds: BigNumberish[];
  amounts?: BigNumberish[];
  recipient?: string;
  startTime?: BigNumberish;
  additionalParameters?: any[];
}

// Orders

export interface MakerAsk {
  askNonce: BigNumberish;
  subsetNonce: BigNumberish;
  strategyId: StrategyType; // 0: Standard; 1: Collection; 2. etc.
  assetType: AssetType;
  orderNonce: BigNumberish;
  minNetRatio: number; // e.g., 8500 = At least, 85% of the sale proceeds to the maker ask
  collection: string;
  currency: string;
  recipient: string;
  signer: string;
  startTime: BigNumberish;
  endTime: BigNumberish;
  minPrice: BigNumberish;
  itemIds: BigNumberish[];
  amounts: BigNumberish[]; // length = 1 if single sale // length > 1 if batch sale
  additionalParameters: BytesLike;
}

export interface MakerBid {
  bidNonce: BigNumberish;
  subsetNonce: BigNumberish;
  strategyId: number; // 0: Standard; 1: Collection; 2. etc.
  assetType: AssetType;
  orderNonce: BigNumberish;
  minNetRatio: number; // e.g., 8500 = At least, 85% of the sale proceeds to the maker ask
  collection: string;
  currency: string;
  recipient: string;
  signer: string;
  startTime: BigNumberish;
  endTime: BigNumberish;
  maxPrice: BigNumberish;
  itemIds: BigNumberish[];
  amounts: BigNumberish[];
  additionalParameters: BytesLike;
}

export interface TakerAsk {
  recipient: string;
  minNetRatio: number;
  minPrice: BigNumberish;
  itemIds: BigNumberish[];
  amounts: BigNumberish[];
  additionalParameters: BytesLike;
}

export interface TakerBid {
  recipient: string;
  minNetRatio: number;
  maxPrice: BigNumberish;
  itemIds: BigNumberish[];
  amounts: BigNumberish[];
  additionalParameters: BytesLike;
}
