import { BigNumber, providers, constants, BigNumberish } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import * as multicall from "@0xsequence/multicall";
import { addressesByNetwork, Addresses } from "./constants/addresses";
import { contractName, version } from "./constants/eip712";
import { MAX_ORDERS_PER_TREE } from "./constants";
import { signMakerOrder, signMerkleTreeOrders } from "./utils/signMakerOrders";
import {
  incrementBidAskNonces,
  cancelOrderNonces,
  cancelSubsetNonces,
  viewUserBidAskNonces,
} from "./utils/calls/nonces";
import { executeTakerAsk, executeTakerBid } from "./utils/calls/exchange";
import {
  transferBatchItemsAcrossCollections,
  grantApprovals,
  revokeApprovals,
  hasUserApprovedOperator,
} from "./utils/calls/transferManager";
import { verifyMakerOrders } from "./utils/calls/orderValidator";
import { encodeParams, getTakerParamsTypes, getMakerParamsTypes } from "./utils/encodeOrderParams";
import { setApprovalForAll, isApprovedForAll, allowance, approve } from "./utils/calls/tokens";
import {
  Maker,
  Taker,
  SupportedChainId,
  Signer,
  CreateMakerInput,
  CreateMakerOutput,
  MerkleTree,
  ContractMethods,
  OrderValidatorCode,
  BatchTransferItem,
  QuoteType,
  SignMerkleTreeOrdersOutput,
} from "./types";

export class LooksRare {
  /** Current app chain ID */
  public readonly chainId: SupportedChainId;
  /** Mapping of LooksRare protocol addresses for the current chain */
  public readonly addresses: Addresses;
  /**
   * Ethers signer
   * @see https://docs.ethers.io/v5/api/signer/
   */
  public readonly signer?: Signer;
  /**
   * Ethers multicall provider
   * @see https://docs.ethers.io/v5/api/providers/
   * @see https://github.com/0xsequence/sequence.js/tree/master/packages/multicall
   */
  public readonly provider: providers.Provider;

  /** Custom error invalid timestamp */
  public readonly ERROR_TIMESTAMP = new Error("Timestamps should be in seconds");

  /** Custom error undefined signer */
  public readonly ERROR_SIGNER = new Error("Signer is undefined");

  /** Custom error too many orders in one merkle tree */
  public readonly ERROR_MERKLE_TREE_DEPTH = new Error(`Too many orders (limit: ${MAX_ORDERS_PER_TREE})`);

  /** Custom error wrong quote type is being used */
  public readonly ERROR_WRONG_QUOTE_TYPE = new Error("Wrong quote type");

  /**
   * LooksRare protocol main class
   * @param chainId Current app chain id
   * @param provider Ethers provider
   * @param signer Ethers signer
   * @param override Overrides contract addresses for hardhat setup
   */
  constructor(chainId: SupportedChainId, provider: providers.Provider, signer?: Signer, override?: Addresses) {
    this.chainId = chainId;
    this.addresses = override ?? addressesByNetwork[this.chainId];
    this.signer = signer;
    this.provider = new multicall.providers.MulticallProvider(provider);
  }

  /**
   * Return the signer it it's set, throw an exception otherwise
   * @returns Signer
   */
  private getSigner(): Signer {
    if (!this.signer) {
      throw this.ERROR_SIGNER;
    }
    return this.signer;
  }

  /**
   * Retrieve EIP-712 domain
   * @returns TypedDataDomain
   */
  public getTypedDataDomain(): TypedDataDomain {
    return {
      name: contractName,
      version: version.toString(),
      chainId: this.chainId,
      verifyingContract: this.addresses.EXCHANGE_V2,
    };
  }

  /**
   * Create a maker ask object ready to be signed
   * @param CreateMakerInput
   * @returns CreateMakerOutput
   */
  public async createMakerAsk({
    collection,
    strategyId,
    collectionType,
    subsetNonce,
    orderNonce,
    endTime,
    price,
    itemIds,
    amounts = [1],
    currency = constants.AddressZero,
    startTime = Math.floor(Date.now() / 1000),
    additionalParameters = [],
  }: CreateMakerInput): Promise<CreateMakerOutput> {
    const signer = this.getSigner();

    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw this.ERROR_TIMESTAMP;
    }

    const signerAddress = await signer.getAddress();
    const spenderAddress = this.addresses.TRANSFER_MANAGER_V2;

    const [isCollectionApproved, userBidAskNonce] = await Promise.all([
      isApprovedForAll(this.provider, collection, signerAddress, spenderAddress),
      viewUserBidAskNonces(this.provider, this.addresses.EXCHANGE_V2, signerAddress),
    ]);

    const order: Maker = {
      quoteType: QuoteType.Ask,
      globalNonce: userBidAskNonce.askNonce,
      subsetNonce: subsetNonce,
      strategyId: strategyId,
      collectionType: collectionType,
      orderNonce: orderNonce,
      collection: collection,
      currency: currency,
      signer: signerAddress,
      startTime: startTime,
      endTime: endTime,
      price: price,
      itemIds: itemIds,
      amounts: amounts,
      additionalParameters: encodeParams(additionalParameters, getMakerParamsTypes(strategyId)),
    };

    return {
      maker: order,
      approval: isCollectionApproved ? undefined : () => setApprovalForAll(signer, collection, spenderAddress),
    };
  }

  /**
   * Create a maker bid object ready to be signed
   * @param CreateMakerInput
   * @returns CreateMakerOutput
   */
  public async createMakerBid({
    collection,
    strategyId,
    collectionType,
    subsetNonce,
    orderNonce,
    endTime,
    price,
    itemIds,
    amounts = [1],
    currency = this.addresses.WETH,
    startTime = Math.floor(Date.now() / 1000),
    additionalParameters = [],
  }: CreateMakerInput): Promise<CreateMakerOutput> {
    const signer = this.getSigner();

    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw this.ERROR_TIMESTAMP;
    }

    const signerAddress = await signer.getAddress();
    const spenderAddress = this.addresses.EXCHANGE_V2;

    const [currentAllowance, userBidAskNonce] = await Promise.all([
      allowance(this.provider, currency, signerAddress, spenderAddress),
      viewUserBidAskNonces(this.provider, this.addresses.EXCHANGE_V2, signerAddress),
    ]);

    const order: Maker = {
      quoteType: QuoteType.Bid,
      globalNonce: userBidAskNonce.bidNonce,
      subsetNonce: subsetNonce,
      strategyId: strategyId,
      collectionType: collectionType,
      orderNonce: orderNonce,
      collection: collection,
      currency: currency,
      signer: signerAddress,
      startTime: startTime,
      endTime: endTime,
      price: price,
      itemIds: itemIds,
      amounts: amounts,
      additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(strategyId)),
    };

    return {
      maker: order,
      approval: BigNumber.from(currentAllowance).lt(price)
        ? () => approve(signer, currency, spenderAddress)
        : undefined,
    };
  }

  /**
   * Create a taker ask ready to be executed against a maker bid
   * @param maker Maker order that will be used as counterparty for the taker
   * @param recipient Recipient address of the taker (if none, it will use the sender)
   * @param additionalParameters Additional parameters used to support complex orders
   */
  public createTaker(maker: Maker, recipient: string = constants.AddressZero, additionalParameters: any[] = []): Taker {
    const order: Taker = {
      recipient: recipient,
      additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(maker.strategyId)),
    };
    return order;
  }

  /**
   * Wrapper of createTaker to facilitate taker creation for collection orders
   * @see this.createTaker
   * @param makerBid Maker bid that will be used as counterparty for the taker
   * @param itemId Token id to use as a counterparty for the collection order
   * @param recipient Recipient address of the taker (if none, it will use the sender)
   */
  public createTakerForCollectionOrder(maker: Maker, itemId: BigNumberish, recipient?: string): Taker {
    if (maker.quoteType !== QuoteType.Bid) {
      throw this.ERROR_WRONG_QUOTE_TYPE;
    }
    return this.createTaker(maker, recipient, [itemId]);
  }

  /**
   * Sign a maker order using the signer provided in the constructor
   * @param maker Order to be signed by the user
   * @returns Signature
   */
  public async signMakerOrder(maker: Maker): Promise<string> {
    const signer = this.getSigner();
    return await signMakerOrder(signer, this.getTypedDataDomain(), maker);
  }

  /**
   * Sign multiple maker orders with a single signature
   * @param makerOrders Array of maker orders
   * @returns Signature and Merkletree
   */
  public async signMultipleMakerOrders(makerOrders: Maker[]): Promise<SignMerkleTreeOrdersOutput> {
    if (makerOrders.length > MAX_ORDERS_PER_TREE) {
      throw this.ERROR_MERKLE_TREE_DEPTH;
    }
    const signer = this.getSigner();
    return signMerkleTreeOrders(signer, this.getTypedDataDomain(), makerOrders);
  }

  /**
   * Execute a trade with a taker ask and a maker bid
   * @param makerBid Maker bid
   * @param taker Taker order
   * @param signature Signature of the maker order
   * @param merkleTree If the maker has been signed with a merkle tree
   * @param referrer Referrer address if applicable
   */
  public executeTakerAsk(
    maker: Maker,
    taker: Taker,
    signature: string,
    merkleTree: MerkleTree = { root: constants.HashZero, proof: [] },
    referrer: string = constants.AddressZero
  ): ContractMethods {
    if (maker.quoteType !== QuoteType.Bid) {
      throw this.ERROR_WRONG_QUOTE_TYPE;
    }
    const signer = this.getSigner();
    return executeTakerAsk(signer, this.addresses.EXCHANGE_V2, taker, maker, signature, merkleTree, referrer);
  }

  /**
   * Execute a trade with a taker bid and a maker ask
   * @param makerAsk Maker ask
   * @param taker Taker order
   * @param signature Signature of the maker order
   * @param merkleTree If the maker has been signed with a merkle tree
   * @param referrer Referrer address if applicable
   */
  public executeTakerBid(
    maker: Maker,
    taker: Taker,
    signature: string,
    merkleTree: MerkleTree = { root: constants.HashZero, proof: [] },
    referrer: string = constants.AddressZero
  ): ContractMethods {
    if (maker.quoteType !== QuoteType.Ask) {
      throw this.ERROR_WRONG_QUOTE_TYPE;
    }
    const signer = this.getSigner();
    return executeTakerBid(signer, this.addresses.EXCHANGE_V2, taker, maker, signature, merkleTree, referrer);
  }

  /**
   * Cancell all maker bid and/or ask orders for the current user
   * @param bid Cancel all bids
   * @param ask Cancel all asks
   */
  public cancelAllOrders(bid: boolean, ask: boolean): ContractMethods {
    const signer = this.getSigner();
    return incrementBidAskNonces(signer, this.addresses.EXCHANGE_V2, bid, ask);
  }

  /**
   * Cancel a list of specific orders
   * @param nonces List of nonces to be cancelled
   */
  public cancelOrders(nonces: BigNumberish[]): ContractMethods {
    const signer = this.getSigner();
    return cancelOrderNonces(signer, this.addresses.EXCHANGE_V2, nonces);
  }

  /**
   * Cancel a list of specific subset orders
   * @param nonces List of nonces to be cancelled
   */
  public cancelSubsetOrders(nonces: BigNumberish[]): ContractMethods {
    const signer = this.getSigner();
    return cancelSubsetNonces(signer, this.addresses.EXCHANGE_V2, nonces);
  }

  /**
   * Check whether or not an operator has been approved by the user
   * @param operators List of operators (default to the exchange address)
   * @returns
   */
  public async isTransferManagerApproved(operators: string = this.addresses.EXCHANGE_V2): Promise<boolean> {
    const signer = this.getSigner();
    const signerAddress = await signer.getAddress();
    return hasUserApprovedOperator(this.getSigner(), this.addresses.TRANSFER_MANAGER_V2, signerAddress, operators);
  }

  /**
   * Grant a list of operators the rights to transfer user's assets using the transfer manager
   * @param operators List of operators (default to the exchange address)
   * @defaultValue Exchange address
   */
  public grantTransferManagerApproval(operators: string[] = [this.addresses.EXCHANGE_V2]): ContractMethods {
    const signer = this.getSigner();
    return grantApprovals(signer, this.addresses.TRANSFER_MANAGER_V2, operators);
  }

  /**
   * Revoke a list of operators the rights to transfer user's assets using the transfer manager
   * @param operators List of operators
   * @defaultValue Exchange address
   */
  public revokeTransferManagerApproval(operators: string[] = [this.addresses.EXCHANGE_V2]): ContractMethods {
    const signer = this.getSigner();
    return revokeApprovals(signer, this.addresses.TRANSFER_MANAGER_V2, operators);
  }

  /**
   * Transfer a list of items across different collections
   * @param to
   * @param collectionItems Each object in the array represent a list of items for a specific collection
   */
  public async transferItemsAcrossCollection(
    to: string,
    collectionItems: BatchTransferItem[]
  ): Promise<ContractMethods> {
    const signer = this.getSigner();
    const from = await signer.getAddress();
    return transferBatchItemsAcrossCollections(signer, this.addresses.TRANSFER_MANAGER_V2, collectionItems, from, to);
  }

  /**
   *
   * @param makerAskOrders List of maker ask orders
   * @param signatures List of signatures
   * @param merkleTrees List of merkle tree (if applicable)
   * @returns A list of OrderValidatorCode for each order (code 0 being valid)
   */
  public async verifyMakerOrders(
    makerOrders: Maker[],
    signatures: string[],
    merkleTrees: MerkleTree[]
  ): Promise<OrderValidatorCode[][]> {
    const signer = this.getSigner();
    return verifyMakerOrders(signer, this.addresses.ORDER_VALIDATOR_V2, makerOrders, signatures, merkleTrees);
  }
}
