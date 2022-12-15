import { ethers, BigNumberish, BytesLike, ContractTransaction, BigNumber } from "ethers";
import { TypedDataSigner } from "@ethersproject/abstract-signer";

/** List of supported chains */
export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,
  HARDHAT = 31337,
}

/** List of asset types supported by the protocol */
export enum AssetType {
  ERC721 = 0,
  ERC1155 = 1,
}

/** List of trading strategies */
export enum StrategyType {
  standard = 0,
  collection = 1,
}

/** Solidity types (used for EIP-712 types) */
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

/**
 * Temporary type until full of TypedDataSigner in ethers V6
 * @see https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts#L53
 */
export type Signer = ethers.Signer & TypedDataSigner;

export interface ContractMethods {
  call: () => Promise<ContractTransaction>;
  estimateGas: () => Promise<BigNumber>;
}

/** Output of the createMakerAsk function */
export interface MakerAskOutputs {
  /** Maker order ready to be signed */
  order: MakerAsk;
  /** Function to be called before signing the order */
  action?: () => Promise<ContractTransaction>;
}

/** Input of the createMakerAsk function */
export interface MakerAskInputs {
  /** Collection address */
  collection: string;
  /** Strategy ID */
  strategyId: StrategyType;
  /** Asset type */
  assetType: AssetType;
  /** Subset nonce */
  subsetNonce: BigNumberish;
  /** Order nonce */
  orderNonce: BigNumberish;
  /** Timestamp in seconds when the order becomes invalid */
  endTime: BigNumberish;
  /** Asset price in wei */
  price: BigNumberish;
  /**
   * List of items ids to be sold
   * @defaultValue [1]
   */
  itemIds: BigNumberish[];
  /** Amount for each item ids (needs to have the same length as itemIds array) */
  amounts?: BigNumberish[];
  /**
   * Currency address
   * @defaultValue ETH
   */
  currency?: string;
  /**
   * Order validity start time
   * @defaultValue now
   */
  startTime?: BigNumberish;
  /**
   * Additional parameters for complex orders
   * @defaultValue []
   */
  additionalParameters?: any[];
}

/** Output of the createMakerBid function */
export interface MakerBidOutputs {
  /** Maker order ready to be signed */
  order: MakerBid;
  /** Function to be called before signing the order */
  action?: () => Promise<ContractTransaction>;
}

/** Input of the createMakerBid function */
export interface MakerBidInputs {
  /** Collection address */
  collection: string;
  /** Strategy ID */
  strategyId: StrategyType;
  /** Asset type */
  assetType: AssetType;
  /** Subset nonce */
  subsetNonce: BigNumberish;
  /** Order nonce */
  orderNonce: BigNumberish;
  /** Timestamp in seconds when the order becomes invalid */
  endTime: BigNumberish;
  /** Asset price in wei */
  price: BigNumberish;
  /**
   * List of items ids to be sold
   * @defaultValue [1]
   */
  itemIds: BigNumberish[];
  /** Amount for each item ids (needs to have the same length as itemIds array) */
  amounts?: BigNumberish[];
  /**
   * Currency address
   * @defaultValue ETH
   */
  currency?: string;
  /**
   * Order validity start time
   * @defaultValue now
   */
  startTime?: BigNumberish;
  /**
   * Additional parameters for complex orders
   * @defaultValue []
   */
  additionalParameters?: any[];
}

/** Maker ask object to be used in execute functions */
export interface MakerAsk {
  /** User's current ask nonce */
  askNonce: BigNumberish;
  /** Subset nonce used to group an arbitrary number of orders under the same nonce */
  subsetNonce: BigNumberish;
  /** Strategy ID, 0: Standard, 1: Collection, etc*/
  strategyId: StrategyType;
  /** Asset type, 0: ERC-721, 1:ERC-1155, etc */
  assetType: AssetType;
  /** Nonce for this specific order */
  orderNonce: BigNumberish;
  /** Collection address */
  collection: string;
  /** Currency address (zero address for ETH) */
  currency: string;
  /** Signer address */
  signer: string;
  /** Timestamp in second of the time when the order starts to be valid */
  startTime: BigNumberish;
  /** Timestamp in second of the time when the order becomes invalid */
  endTime: BigNumberish;
  /** Minimum price to be received after the trade */
  minPrice: BigNumberish;
  /** List of item IDS */
  itemIds: BigNumberish[];
  /** List of amount for each item ID (1 for ERC721) */
  amounts: BigNumberish[];
  /** Additional parameters for complex orders */
  additionalParameters: BytesLike;
}

/** Maker bid object to be used in execute functions */
export interface MakerBid {
  /** User's current bid nonce */
  bidNonce: BigNumberish;
  /** Subset nonce used to group an arbitrary number of orders under the same nonce */
  subsetNonce: BigNumberish;
  /** Strategy ID, 0: Standard, 1: Collection, etc*/
  strategyId: StrategyType;
  /** Asset type, 0: ERC-721, 1:ERC-1155, etc */
  assetType: AssetType;
  /** Nonce for this specific order */
  orderNonce: BigNumberish;
  /** Collection address */
  collection: string;
  /** Currency address (zero address for ETH) */
  currency: string;
  /** Signer address */
  signer: string;
  /** Timestamp in second of the time when the order starts to be valid */
  startTime: BigNumberish;
  /** Timestamp in second of the time when the order becomes invalid */
  endTime: BigNumberish;
  /** Maximum price to be paid for the trade */
  maxPrice: BigNumberish;
  /** List of item IDS */
  itemIds: BigNumberish[];
  /** List of amount for each item ID (1 for ERC721) */
  amounts: BigNumberish[];
  /** Additional parameters for complex orders */
  additionalParameters: BytesLike;
}

/** Taker ask object to be used in execute functions */
export interface TakerAsk {
  /** Recipient of the transaction */
  recipient: string;
  /** Minimum price to receive for the trade */
  minPrice: BigNumberish;
  /** List of items IDs */
  itemIds: BigNumberish[];
  /** List of amount for each items ID */
  amounts: BigNumberish[];
  /** Additional parameters for complex orders */
  additionalParameters: BytesLike;
}

/** Taker bid object to be used in execute functions */
export interface TakerBid {
  /** Recipient of the transaction */
  recipient: string;
  /** Maximum price to be paid for the trade */
  maxPrice: BigNumberish;
  /** List of items IDs */
  itemIds: BigNumberish[];
  /** List of amount for each items ID */
  amounts: BigNumberish[];
  /** Additional parameters for complex orders */
  additionalParameters: BytesLike;
}

/** Merkle root object to be used in the execute function for a multi listing */
export interface MerkleTree {
  /** Root of the merkle tree */
  root: string;
  proof: string[];
}
