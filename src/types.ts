import { ethers, BigNumberish, BytesLike, ContractTransaction, BigNumber, Overrides } from "ethers";
import { TypedDataSigner, TypedDataField } from "@ethersproject/abstract-signer";
import { Eip712MakerMerkleTree } from "./utils/Eip712MakerMerkleTree";

/** Addresses used to create a LooksRare instance */
export interface Addresses {
  LOOKS: string;
  EXCHANGE_V2: string;
  TRANSFER_MANAGER_V2: string;
  WETH: string;
  ORDER_VALIDATOR_V2: string;
  REVERSE_RECORDS: string;
  LOOKS_LP_V3: string;
}

/** List of supported chains */
export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,
  HARDHAT = 31337,
}

/** List of collection types supported by the protocol */
export enum CollectionType {
  ERC721 = 0,
  ERC1155 = 1,
}

/** List of trading strategies */
export enum StrategyType {
  standard = 0,
  collection = 1,
  collectionWithMerkleTree = 2,
}

/** Type for maker order */
export enum QuoteType {
  Bid = 0,
  Ask = 1,
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

/** EIP712 type data */
export type EIP712TypedData = Record<string, Array<TypedDataField>>;

/**
 * Item structure used for batch transfers
 * @see https://github.com/LooksRare/contracts-exchange-v2/blob/8de425de2571a57112e9e67cf0c925439a83c9e3/contracts/interfaces/ITransferManager.sol#L16
 */
export interface BatchTransferItem {
  collection: string;
  collectionType: CollectionType;
  itemIds: BigNumberish[];
  amounts: BigNumberish[];
}

/**
 * Temporary type until full of TypedDataSigner in ethers V6
 * @see https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts#L53
 */
export type Signer = ethers.Signer & TypedDataSigner;

/** Return type for any on chain call */
export interface ContractMethods {
  call: (additionalOverrides?: Overrides) => Promise<ContractTransaction>;
  estimateGas: (additionalOverrides?: Overrides) => Promise<BigNumber>;
  callStatic: (additionalOverrides?: Overrides) => Promise<any>;
}

/** Return type for strategyInfo */
export interface StrategyInfo {
  isActive: boolean;
  standardProtocolFeeBp: number;
  minTotalFeeBp: number;
  maxProtocolFeeBp: number;
}

/** Return object of createMakerAsk  */
export interface CreateMakerAskOutput {
  maker: Maker;
  isTransferManagerApproved: boolean;
  isCollectionApproved: boolean;
}

/** Return object of createMakerBid  */
export interface CreateMakerBidOutput {
  maker: Maker;
  isCurrencyApproved: boolean;
  isBalanceSufficient: boolean;
}

/** Input of the createMakerAsk function */
export interface CreateMakerInput {
  /** Collection address */
  collection: string;
  /** Strategy ID, 0: Standard, 1: Collection, etc*/
  strategyId: StrategyType;
  /** Asset type, 0: ERC-721, 1:ERC-1155, etc */
  collectionType: CollectionType;
  /** Subset nonce used to group an arbitrary number of orders under the same nonce */
  subsetNonce: BigNumberish;
  /** Order nonce, get it from the LooksRare api */
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

export type CreateMakerCollectionOfferInput = Omit<CreateMakerInput, "strategyId" | "itemIds">;

export type CreateMakerCollectionOfferWithProofInput = Omit<CreateMakerInput, "strategyId">;

/** Maker object to be used in execute functions */
export interface Maker {
  /** Bid or ask, 0: bid, 1: ask */
  quoteType: QuoteType;
  /** User's current bid / ask nonce */
  globalNonce: BigNumberish;
  /** Subset nonce used to group an arbitrary number of orders under the same nonce */
  subsetNonce: BigNumberish;
  /** Nonce for this specific order */
  orderNonce: BigNumberish;
  /** Strategy ID, 0: Standard, 1: Collection, etc*/
  strategyId: StrategyType;
  /** Asset type, 0: ERC-721, 1:ERC-1155, etc */
  collectionType: CollectionType;
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
  price: BigNumberish;
  /** List of item IDS */
  itemIds: BigNumberish[];
  /** List of amount for each item ID (1 for ERC721) */
  amounts: BigNumberish[];
  /** Additional parameters for complex orders */
  additionalParameters: BytesLike;
}

/** Taker order */
export interface Taker {
  /** Recipient of the transaction */
  recipient: string;
  /** Additional parameters for complex orders */
  additionalParameters: BytesLike;
}

/** Merkle tree node position (needed by the SC) */
export enum MerkleTreeNodePosition {
  Left = 0,
  Right = 1,
}

/** Merkle tree proof to be used within a merkle tree */
export interface MerkleTreeProof {
  value: string;
  position: MerkleTreeNodePosition;
}

/** Merkle root object to be used in the execute function for a multi listing */
export interface MerkleTree {
  root: string;
  proof: MerkleTreeProof[];
}

/** Return type of the sign multiple orders function */
export interface SignMerkleTreeOrdersOutput {
  signature: string;
  merkleTreeProofs: MerkleTree[];
  tree: Eip712MakerMerkleTree;
}

/** Error errors returned by the order validator contract */
export enum OrderValidatorCode {
  // 0. No error
  ORDER_EXPECTED_TO_BE_VALID = 0,

  // 1. Strategy & currency-related errors
  CURRENCY_NOT_ALLOWED = 101,
  STRATEGY_NOT_IMPLEMENTED = 111,
  STRATEGY_INVALID_QUOTE_TYPE = 112,
  STRATEGY_NOT_ACTIVE = 113,

  // 2. Maker order struct-related errors
  MAKER_ORDER_INVALID_STANDARD_SALE = 201,
  MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE = 211,
  MAKER_ORDER_INVALID_CURRENCY_NON_STANDARD_SALE = 212,
  MAKER_ORDER_TEMPORARILY_INVALID_NON_STANDARD_SALE = 213,

  // 3. Nonce-related errors
  USER_SUBSET_NONCE_CANCELLED = 301,
  USER_ORDER_NONCE_EXECUTED_OR_CANCELLED = 311,
  USER_ORDER_NONCE_IN_EXECUTION_WITH_OTHER_HASH = 312,
  INVALID_USER_GLOBAL_BID_NONCE = 321,
  INVALID_USER_GLOBAL_ASK_NONCE = 322,

  // 4. errors related to signatures (EOA, EIP-1271) and merkle tree computations
  ORDER_HASH_PROOF_NOT_IN_MERKLE_TREE = 401,
  MERKLE_PROOF_PROOF_TOO_LARGE = 402,
  INVALID_SIGNATURE_LENGTH = 411,
  INVALID_S_PARAMETER_EOA = 412,
  INVALID_V_PARAMETER_EOA = 413,
  NULL_SIGNER_EOA = 414,
  INVALID_SIGNER_EOA = 415,
  MISSING_IS_VALID_SIGNATURE_FUNCTION_EIP1271 = 421,
  SIGNATURE_INVALID_EIP1271 = 422,

  // 5. Timestamp-related errors
  START_TIME_GREATER_THAN_END_TIME = 501,
  TOO_LATE_TO_EXECUTE_ORDER = 502,
  TOO_EARLY_TO_EXECUTE_ORDER = 503,

  // 6. Transfer-related (ERC20, ERC721, ERC1155 tokens), including transfers and approvals, errors.
  SAME_ITEM_ID_IN_BUNDLE = 601,
  ERC20_BALANCE_INFERIOR_TO_PRICE = 611,
  ERC20_APPROVAL_INFERIOR_TO_PRICE = 612,
  ERC721_ITEM_ID_DOES_NOT_EXIST = 621,
  ERC721_ITEM_ID_NOT_IN_BALANCE = 622,
  ERC721_NO_APPROVAL_FOR_ALL_OR_ITEM_ID = 623,
  ERC1155_BALANCE_OF_DOES_NOT_EXIST = 631,
  ERC1155_BALANCE_OF_ITEM_ID_INFERIOR_TO_AMOUNT = 632,
  ERC1155_IS_APPROVED_FOR_ALL_DOES_NOT_EXIST = 633,
  ERC1155_NO_APPROVAL_FOR_ALL = 634,

  // 7. Asset-type errors
  POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_ERC721 = 701,
  POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_ERC1155 = 702,

  // 8. Transfer manager-related errors
  NO_TRANSFER_MANAGER_APPROVAL_BY_USER_FOR_EXCHANGE = 801,
  TRANSFER_MANAGER_APPROVAL_REVOKED_BY_OWNER_FOR_EXCHANGE = 802,

  // 9. Creator fee-related errors
  BUNDLE_ERC2981_NOT_SUPPORTED = 901,
  CREATOR_FEE_TOO_HIGH = 902,
}
