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

/**
 * Item structure used for batch transfers
 * @see https://github.com/LooksRare/contracts-exchange-v2/blob/8de425de2571a57112e9e67cf0c925439a83c9e3/contracts/interfaces/ITransferManager.sol#L16
 */
export interface BatchTransferItem {
  collection: string;
  assetType: AssetType;
  itemIds: BigNumberish[];
  amounts: BigNumberish[];
}

/**
 * Temporary type until full of TypedDataSigner in ethers V6
 * @see https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts#L53
 */
export type Signer = ethers.Signer & TypedDataSigner;

export interface ContractMethods {
  call: () => Promise<ContractTransaction>;
  estimateGas: () => Promise<BigNumber>;
  callStatic: () => Promise<any>;
}

/** Output of the createMakerAsk function */
export interface CreateMakerOutput {
  /** Maker order ready to be signed */
  maker: Maker;
  /** Function to be called before signing the order */
  approval?: () => Promise<ContractTransaction>;
}

/** Input of the createMakerAsk function */
export interface CreateMakerInput {
  /** Collection address */
  collection: string;
  /** Strategy ID, 0: Standard, 1: Collection, etc*/
  strategyId: StrategyType;
  /** Asset type, 0: ERC-721, 1:ERC-1155, etc */
  assetType: AssetType;
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

/** Maker object to be used in execute functions */
export interface Maker {
  /** Ask or bid */
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
  assetType: AssetType;
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

/** Taker order used to execute a maker order */
export interface Taker {
  /** Recipient of the transaction */
  recipient: string;
  /** Additional parameters for complex orders */
  additionalParameters: BytesLike;
}

/** Merkle root object to be used in the execute function for a multi listing */
export interface MerkleTree {
  /** Root of the merkle tree */
  root: string;
  proof: string[];
}

/** List of orders with their proof and the tree information */
export interface MultipleOrdersWithMerkleTree {
  root: string;
  signature: string;
  orders: {
    order: Maker;
    hash: Buffer;
    proof: string[];
  }[];
}

/** Error codes returned by the order validator contract */
export enum OrderValidatorCode {
  // 0. No error
  ORDER_EXPECTED_TO_BE_VALID = 0,

  // 1. Nonce-related errors
  USER_SUBSET_NONCE_CANCELLED = 101,
  USER_ORDER_NONCE_EXECUTED_OR_CANCELLED = 111,
  USER_ORDER_NONCE_IN_EXECUTION_WITH_OTHER_HASH = 112,
  USER_GLOBAL_BID_NONCE_HIGHER = 121,
  USER_GLOBAL_BID_NONCE_LOWER = 122,
  USER_GLOBAL_ASK_NONCE_HIGHER = 123,
  USER_GLOBAL_ASK_NONCE_LOWER = 124,

  // 2. Errors related to signatures (EOA, EIP-1271) and Merkle Tree computations
  ORDER_HASH_PROOF_NOT_IN_MERKLE_TREE = 201,
  WRONG_SIGNATURE_LENGTH = 211,
  INVALID_S_PARAMETER_EOA = 212,
  INVALID_V_PARAMETER_EOA = 213,
  NULL_SIGNER_EOA = 214,
  WRONG_SIGNER_EOA = 215,
  MISSING_IS_VALID_SIGNATURE_FUNCTION_EIP1271 = 221,
  SIGNATURE_INVALID_EIP1271 = 222,

  // 3. Strategy & currency-related errors
  CURRENCY_NOT_WHITELISTED = 301,
  STRATEGY_NOT_IMPLEMENTED = 311,
  STRATEGY_TAKER_BID_SELECTOR_INVALID = 312,
  STRATEGY_TAKER_ASK_SELECTOR_INVALID = 313,
  STRATEGY_NOT_ACTIVE = 314,

  // 4. Timestamp-related validation errors
  TOO_LATE_TO_EXECUTE_ORDER = 401,
  TOO_EARLY_TO_EXECUTE_ORDER = 402,

  // 5. Maker order struct-related errors
  MAKER_ORDER_INVALID_STANDARD_SALE = 501,
  MAKER_ORDER_INVALID_NON_STANDARD_SALE = 502,

  // 6. Transfer-related (ERC20, ERC721, ERC1155 tokens), including transfers and approvals, errors
  SAME_ITEM_ID_IN_BUNDLE = 602,
  ERC20_BALANCE_INFERIOR_TO_PRICE = 611,
  ERC20_APPROVAL_INFERIOR_TO_PRICE = 612,
  ERC721_ITEM_ID_DOES_NOT_EXIST = 621,
  ERC721_ITEM_ID_NOT_IN_BALANCE = 622,
  ERC721_NO_APPROVAL_FOR_ALL_OR_ITEM_ID = 623,
  ERC1155_BALANCE_OF_DOES_NOT_EXIST = 631,
  ERC1155_BALANCE_OF_ITEM_ID_INFERIOR_TO_AMOUNT = 632,
  ERC1155_IS_APPROVED_FOR_ALL_DOES_NOT_EXIST = 633,
  ERC1155_NO_APPROVAL_FOR_ALL = 634,

  // 7. Asset-type suggestion
  POTENTIAL_WRONG_ASSET_TYPE_SHOULD_BE_ERC721 = 701,
  POTENTIAL_WRONG_ASSET_TYPE_SHOULD_BE_ERC1155 = 702,
  ASSET_TYPE_NOT_SUPPORTED = 711,

  // 8. Transfer manager-related
  NO_TRANSFER_MANAGER_APPROVAL_BY_USER_FOR_EXCHANGE = 801,
  TRANSFER_MANAGER_APPROVAL_REVOKED_BY_OWNER_FOR_EXCHANGE = 802,

  // 9. Creator fee-related errors
  BUNDLE_ERC2981_NOT_SUPPORTED = 901,
  CREATOR_FEE_TOO_HIGH = 902,
}
