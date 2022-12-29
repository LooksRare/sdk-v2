import { BigNumber, providers, constants, BigNumberish } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import * as multicall from "@0xsequence/multicall";
import { MerkleTree as MerkleTreeJS } from "merkletreejs";
import { keccak256 } from "js-sha3";
import { addressesByNetwork, Addresses } from "./constants/addresses";
import { contractName, version } from "./constants/eip712";
import { signMakerAsk, signMakerBid, signMerkleRoot } from "./utils/signMakerOrders";
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
import { verifyMakerAskOrders, verifyMakerBidOrders } from "./utils/calls/orderValidator";
import { encodeParams, getTakerParamsTypes, getMakerParamsTypes } from "./utils/encodeOrderParams";
import { setApprovalForAll, isApprovedForAll, allowance, approve } from "./utils/calls/tokens";
import { getMakerAskHash, getMakerBidHash } from "./utils/hashOrder";
import {
  AssetType,
  MakerAsk,
  MakerBid,
  TakerAsk,
  TakerBid,
  SupportedChainId,
  Signer,
  MakerAskInputs,
  MakerBidInputs,
  MakerAskOutputs,
  MakerBidOutputs,
  MerkleTree,
  ContractMethods,
  OrderValidatorCode,
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
      verifyingContract: this.addresses.EXCHANGE,
    };
  }

  /**
   * Create a maker ask object ready to be signed
   * @param makerAskInputs
   * @returns MakerAskOutputs
   */
  public async createMakerAsk({
    collection,
    strategyId,
    assetType,
    subsetNonce,
    orderNonce,
    endTime,
    price,
    itemIds,
    amounts = [1],
    currency = constants.AddressZero,
    startTime = Math.floor(Date.now() / 1000),
    additionalParameters = [],
  }: MakerAskInputs): Promise<MakerAskOutputs> {
    const signer = this.getSigner();

    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw this.ERROR_TIMESTAMP;
    }

    const signerAddress = await signer.getAddress();
    const spenderAddress = this.addresses.TRANSFER_MANAGER;

    const [isCollectionApproved, userBidAskNonce] = await Promise.all([
      isApprovedForAll(this.provider, collection, signerAddress, spenderAddress),
      viewUserBidAskNonces(this.provider, this.addresses.EXCHANGE, signerAddress),
    ]);

    const order: MakerAsk = {
      askNonce: userBidAskNonce.askNonce,
      subsetNonce: subsetNonce,
      strategyId: strategyId,
      assetType: assetType,
      orderNonce: orderNonce,
      collection: collection,
      currency: currency,
      signer: signerAddress,
      startTime: startTime,
      endTime: endTime,
      minPrice: price,
      itemIds: itemIds,
      amounts: amounts,
      additionalParameters: encodeParams(additionalParameters, getMakerParamsTypes(strategyId)),
    };

    return {
      makerAsk: order,
      approval: isCollectionApproved ? undefined : () => setApprovalForAll(signer, collection, spenderAddress),
    };
  }

  /**
   * Create a maker bid object ready to be signed
   * @param makerBidOutputs
   * @returns MakerBidOutputs
   */
  public async createMakerBid({
    collection,
    strategyId,
    assetType,
    subsetNonce,
    orderNonce,
    endTime,
    price,
    itemIds,
    amounts = [1],
    currency = this.addresses.WETH,
    startTime = Math.floor(Date.now() / 1000),
    additionalParameters = [],
  }: MakerBidInputs): Promise<MakerBidOutputs> {
    const signer = this.getSigner();

    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw this.ERROR_TIMESTAMP;
    }

    const signerAddress = await signer.getAddress();
    const spenderAddress = this.addresses.EXCHANGE;

    const [currentAllowance, userBidAskNonce] = await Promise.all([
      allowance(this.provider, currency, signerAddress, spenderAddress),
      viewUserBidAskNonces(this.provider, this.addresses.EXCHANGE, signerAddress),
    ]);

    const order: MakerBid = {
      bidNonce: userBidAskNonce.bidNonce,
      subsetNonce: subsetNonce,
      strategyId: strategyId,
      assetType: assetType,
      orderNonce: orderNonce,
      collection: collection,
      currency: currency,
      signer: signerAddress,
      startTime: startTime,
      endTime: endTime,
      maxPrice: price,
      itemIds: itemIds,
      amounts: amounts,
      additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(strategyId)),
    };

    return {
      makerBid: order,
      approval: BigNumber.from(currentAllowance).lt(price)
        ? () => approve(signer, currency, spenderAddress)
        : undefined,
    };
  }

  /**
   * Create multiple listing using a merkle tree
   * @param makerOrders List of maker orders (bid or ask)
   * @returns MerkleTree
   */
  public createMakerMerkleTree(makerOrders: (MakerAsk | MakerBid)[]): MerkleTree {
    const leaves = makerOrders.map((order) => {
      const hash = "askNonce" in order ? getMakerAskHash(order as MakerAsk) : getMakerBidHash(order as MakerBid);
      return Buffer.from(hash.slice(2), "hex");
    });
    const tree = new MerkleTreeJS(leaves, keccak256, { sortPairs: true });

    return {
      root: tree.getHexRoot(),
      proof: leaves.map((leaf) => tree.getHexProof(leaf).join(",")),
    };
  }

  /**
   * Create a taker ask ready to be executed against a maker bid
   * @param makerBid Maker bid that will be used as counterparty for the taker ask
   * @param recipient Recipient address of the taker
   * @param additionalParameters Additional parameters used to support complex orders
   */
  public createTakerAsk(makerBid: MakerBid, recipient: string, additionalParameters: any[] = []): TakerAsk {
    const order: TakerAsk = {
      recipient: recipient,
      minPrice: makerBid.maxPrice,
      itemIds: makerBid.itemIds,
      amounts: makerBid.amounts,
      additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(makerBid.strategyId)),
    };
    return order;
  }

  /**
   * Create a taker bid ready to be executed against a maker ask
   * @param makerAsk Maker ask that will be used as counterparty for the taker bid
   * @param recipient Recipient address of the taker
   * @param additionalParameters Additional parameters used to support complex orders
   */
  public createTakerBid(makerAsk: MakerAsk, recipient: string, additionalParameters: any[] = []): TakerBid {
    const order: TakerBid = {
      recipient: recipient,
      maxPrice: makerAsk.minPrice,
      itemIds: makerAsk.itemIds,
      amounts: makerAsk.amounts,
      additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(makerAsk.strategyId)),
    };
    return order;
  }

  /**
   * Sign a maker ask using the signer provided in the constructor
   * @param makerAsk Order to be signed by the user
   * @returns Signature
   */
  public async signMakerAsk(makerAsk: MakerAsk): Promise<string> {
    const signer = this.getSigner();
    return await signMakerAsk(signer, this.getTypedDataDomain(), makerAsk);
  }

  /**
   * Sign a maker bid using the signer provided in the constructor
   * @param makerBid Order to be signed by the user
   * @returns Signature
   */
  public async signMakerBid(makerBid: MakerBid): Promise<string> {
    const signer = this.getSigner();
    return await signMakerBid(signer, this.getTypedDataDomain(), makerBid);
  }

  /**
   * Sign multiple maker orders (bids or asks) with a single signature
   * @param hexRoot Merkler tree root
   * @returns Signature
   */
  public async signMultipleMakers(hexRoot: MerkleTree["root"]): Promise<string> {
    const signer = this.getSigner();
    return await signMerkleRoot(signer, this.getTypedDataDomain(), hexRoot);
  }

  /**
   * Execute a trade with a taker ask and a maker bid
   * @param makerBid Maker bid
   * @param takerAsk Taker ask
   * @param signature Signature of the maker order
   * @param merkleTree If the maker has been signed with a merkle tree
   * @param referrer Referrer address if applicable
   */
  public executeTakerAsk(
    makerBid: MakerBid,
    takerAsk: TakerAsk,
    signature: string,
    merkleTree: MerkleTree = { root: constants.HashZero, proof: [] },
    referrer: string = constants.AddressZero
  ): ContractMethods {
    const signer = this.getSigner();
    return executeTakerAsk(signer, this.addresses.EXCHANGE, takerAsk, makerBid, signature, merkleTree, referrer);
  }

  /**
   * Execute a trade with a taker bid and a maker ask
   * @param makerAsk Maker ask
   * @param takerBid Taker bid
   * @param signature Signature of the maker order
   * @param merkleTree If the maker has been signed with a merkle tree
   * @param referrer Referrer address if applicable
   */
  public executeTakerBid(
    makerAsk: MakerAsk,
    takerBid: TakerBid,
    signature: string,
    merkleTree: MerkleTree = { root: constants.HashZero, proof: [] },
    referrer: string = constants.AddressZero
  ): ContractMethods {
    const signer = this.getSigner();
    return executeTakerBid(signer, this.addresses.EXCHANGE, takerBid, makerAsk, signature, merkleTree, referrer);
  }

  /**
   * Cancell all maker bid and/or ask orders for the current user
   * @param bid Cancel all bids
   * @param ask Cancel all asks
   */
  public cancelAllOrders(bid: boolean, ask: boolean): ContractMethods {
    const signer = this.getSigner();
    return incrementBidAskNonces(signer, this.addresses.EXCHANGE, bid, ask);
  }

  /**
   * Cancel a list of specific orders
   * @param nonces List of nonces to be cancelled
   */
  public cancelOrders(nonces: BigNumber[]): ContractMethods {
    const signer = this.getSigner();
    return cancelOrderNonces(signer, this.addresses.EXCHANGE, nonces);
  }

  /**
   * Cancel a list of specific subset orders
   * @param nonces List of nonces to be cancelled
   */
  public cancelSubsetOrders(nonces: BigNumber[]): ContractMethods {
    const signer = this.getSigner();
    return cancelSubsetNonces(signer, this.addresses.EXCHANGE, nonces);
  }

  /**
   * Check whether or not an operator has been approved by the user
   * @param operators List of operators (default to the exchange address)
   * @returns
   */
  public async isTransferManagerApproved(operators: string = this.addresses.EXCHANGE): Promise<boolean> {
    const signer = this.getSigner();
    const signerAddress = await signer.getAddress();
    return hasUserApprovedOperator(this.getSigner(), this.addresses.TRANSFER_MANAGER, signerAddress, operators);
  }

  /**
   * Grant a list of operators the rights to transfer user's assets using the transfer manager
   * @param operators List of operators (default to the exchange address)
   * @defaultValue Exchange address
   */
  public grantTransferManagerApproval(operators: string[] = [this.addresses.EXCHANGE]): ContractMethods {
    const signer = this.getSigner();
    return grantApprovals(signer, this.addresses.TRANSFER_MANAGER, operators);
  }

  /**
   * Revoke a list of operators the rights to transfer user's assets using the transfer manager
   * @param operators List of operators
   * @defaultValue Exchange address
   */
  public revokeTransferManagerApproval(operators: string[] = [this.addresses.EXCHANGE]): ContractMethods {
    const signer = this.getSigner();
    return revokeApprovals(signer, this.addresses.TRANSFER_MANAGER, operators);
  }

  /**
   * Transfer a list of items across different collections
   * @param collections
   * @param assetTypes
   * @param from
   * @param to
   * @param itemIds
   * @param amounts
   */
  public async transferItemsAcrossCollection(
    collections: string[],
    assetTypes: AssetType[],
    to: string,
    itemIds: BigNumberish[][],
    amounts: BigNumberish[][]
  ): Promise<ContractMethods> {
    const signer = this.getSigner();
    const from = await signer.getAddress();
    return transferBatchItemsAcrossCollections(
      signer,
      this.addresses.TRANSFER_MANAGER,
      collections,
      assetTypes,
      from,
      to,
      itemIds,
      amounts
    );
  }

  /**
   *
   * @param makerAskOrders List of maker ask orders
   * @param signatures List of signatures
   * @param merkleTrees List of merkle tree (if applicable)
   * @returns A list of OrderValidatorCode for each order (code 0 being valid)
   */
  public async verifyMakerAskOrders(
    makerAskOrders: MakerAsk[],
    signatures: string[],
    merkleTrees: MerkleTree[]
  ): Promise<OrderValidatorCode[][]> {
    const signer = this.getSigner();
    return verifyMakerAskOrders(signer, this.addresses.ORDER_VALIDATOR, makerAskOrders, signatures, merkleTrees);
  }

  /**
   *
   * @param makerBidOrders List of maker bid orders
   * @param signatures List of signatures
   * @param merkleTrees List of merkle tree (if applicable)
   * @returns A list of OrderValidatorCode for each order (code 0 being valid)
   */
  public async verifyMakerBidOrders(
    makerBidOrders: MakerBid[],
    signatures: string[],
    merkleTrees: MerkleTree[]
  ): Promise<OrderValidatorCode[][]> {
    const signer = this.getSigner();
    return verifyMakerBidOrders(signer, this.addresses.ORDER_VALIDATOR, makerBidOrders, signatures, merkleTrees);
  }
}
