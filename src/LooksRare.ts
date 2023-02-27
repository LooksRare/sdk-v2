import { BigNumber, providers, constants, BigNumberish, ContractTransaction } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import * as multicall from "@0xsequence/multicall";
import { addressesByNetwork } from "./constants/addresses";
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
import { strategyInfo } from "./utils/calls/strategies";
import { ErrorMerkleTreeDepth, ErrorQuoteType, ErrorSigner, ErrorTimestamp, ErrorStrategyType } from "./errors";
import {
  Addresses,
  Maker,
  Taker,
  SupportedChainId,
  Signer,
  CreateMakerInput,
  CreateMakerAskOutput,
  CreateMakerBidOutput,
  MerkleTree,
  ContractMethods,
  OrderValidatorCode,
  BatchTransferItem,
  QuoteType,
  SignMerkleTreeOrdersOutput,
  StrategyType,
  StrategyInfo,
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
      throw new ErrorSigner();
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
   * @returns the maker object, isTransferManagerApproved, and isTransferManagerApproved
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
  }: CreateMakerInput): Promise<CreateMakerAskOutput> {
    const signer = this.getSigner();

    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw new ErrorTimestamp();
    }

    const signerAddress = await signer.getAddress();
    const spenderAddress = this.addresses.TRANSFER_MANAGER_V2;

    const [isCollectionApproved, userBidAskNonce, isTransferManagerApproved] = await Promise.all([
      isApprovedForAll(this.provider, collection, signerAddress, spenderAddress),
      viewUserBidAskNonces(this.provider, this.addresses.EXCHANGE_V2, signerAddress),
      hasUserApprovedOperator(
        this.getSigner(),
        this.addresses.TRANSFER_MANAGER_V2,
        signerAddress,
        this.addresses.EXCHANGE_V2
      ),
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
      isTransferManagerApproved,
      isCollectionApproved,
    };
  }

  /**
   * Create a maker bid object ready to be signed
   * @param CreateMakerInput
   * @returns the maker object and isCurrencyApproved
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
  }: CreateMakerInput): Promise<CreateMakerBidOutput> {
    const signer = this.getSigner();

    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw new ErrorTimestamp();
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
      additionalParameters: encodeParams(additionalParameters, getMakerParamsTypes(strategyId)),
    };

    return {
      maker: order,
      isCurrencyApproved: BigNumber.from(currentAllowance).gte(price),
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
      throw new ErrorQuoteType();
    }
    if (maker.strategyId !== StrategyType.collection) {
      throw new ErrorStrategyType();
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
   * /!\ Use this function for UI implementation only
   * @param makerOrders Array of maker orders
   * @returns Signature and Merkletree
   */
  public async signMultipleMakerOrders(makerOrders: Maker[]): Promise<SignMerkleTreeOrdersOutput> {
    if (makerOrders.length > MAX_ORDERS_PER_TREE) {
      throw new ErrorMerkleTreeDepth();
    }
    const signer = this.getSigner();
    return signMerkleTreeOrders(signer, this.getTypedDataDomain(), makerOrders);
  }

  /**
   * Execute a trade
   * @param makerBid Maker order
   * @param taker Taker order
   * @param signature Signature of the maker order
   * @param merkleTree If the maker has been signed with a merkle tree
   * @param referrer Referrer address if applicable
   */
  public executeOrder(
    maker: Maker,
    taker: Taker,
    signature: string,
    merkleTree: MerkleTree = { root: constants.HashZero, proof: [] },
    referrer: string = constants.AddressZero
  ) {
    const signer = this.getSigner();
    if (maker.quoteType === QuoteType.Ask) {
      return executeTakerBid(signer, this.addresses.EXCHANGE_V2, taker, maker, signature, merkleTree, referrer);
    } else {
      return executeTakerAsk(signer, this.addresses.EXCHANGE_V2, taker, maker, signature, merkleTree, referrer);
    }
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
   * Approve all the items of a collection, to eventually be traded on LooksRare
   * The spender is the TransferManager.
   * @param collectionAddress Address of the collection to be approved.
   * @param approved true to approve, false to revoke the approval (default to true)
   * @returns ContractTransaction
   */
  public approveAllCollectionItems(collectionAddress: string, approved = true): Promise<ContractTransaction> {
    const signer = this.getSigner();
    const spenderAddress = this.addresses.TRANSFER_MANAGER_V2;
    return setApprovalForAll(signer, collectionAddress, spenderAddress, approved);
  }

  /**
   * Approve an ERC20 to be used as a currency on LooksRare.
   * The spender is the LooksRareProtocol contract.
   * @param tokenAddress Address of the ERC20 to approve
   * @param amount Amount to be approved (default to MaxUint256)
   * @returns ContractTransaction
   */
  public approveErc20(tokenAddress: string, amount: BigNumber = constants.MaxUint256): Promise<ContractTransaction> {
    const signer = this.getSigner();
    const spenderAddress = this.addresses.EXCHANGE_V2;
    return approve(signer, tokenAddress, spenderAddress, amount);
  }

  /**
   * Check whether or not an operator has been approved by the user
   * @param operator Operator address (default to the exchange address)
   * @returns true if the operator is approved, false otherwise
   */
  public async isTransferManagerApproved(operator: string = this.addresses.EXCHANGE_V2): Promise<boolean> {
    const signer = this.getSigner();
    const signerAddress = await signer.getAddress();
    return hasUserApprovedOperator(this.getSigner(), this.addresses.TRANSFER_MANAGER_V2, signerAddress, operator);
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
   * @param to Recipient address
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
   * Verify if a set of orders can be executed (i.e are valid)
   * @param makerOrders List of maker orders
   * @param signatures List of signatures
   * @param merkleTrees List of merkle trees (optional)
   * @returns A list of OrderValidatorCode for each order (code 0 being valid)
   */
  public async verifyMakerOrders(
    makerOrders: Maker[],
    signatures: string[],
    merkleTrees?: MerkleTree[]
  ): Promise<OrderValidatorCode[][]> {
    const signer = this.getSigner();
    const defaultMerkleTree = { root: constants.HashZero, proof: [] };
    const _merkleTrees = merkleTrees ?? makerOrders.map(() => defaultMerkleTree);
    return verifyMakerOrders(signer, this.addresses.ORDER_VALIDATOR_V2, makerOrders, signatures, _merkleTrees);
  }

  /**
   * Retrieve strategy info
   * @param strategyId use the enum StrategyType
   * @returns StrategyType
   */
  public async strategyInfo(strategyId: StrategyType): Promise<StrategyInfo> {
    return strategyInfo(this.provider, this.addresses.EXCHANGE_V2, strategyId);
  }
}
