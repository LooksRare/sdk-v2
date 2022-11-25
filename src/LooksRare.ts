import { BigNumber, ContractReceipt, providers, constants, BigNumberish } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import * as multicall from "@0xsequence/multicall";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "js-sha3";
import { signMakerAsk, signMakerBid, signMerkleRoot } from "./utils/signMakerOrders";
import {
  incrementBidAskNonces,
  cancelOrderNonces,
  cancelSubsetNonces,
  viewUserBidAskNonces,
} from "./utils/calls/nonces";
import { executeTakerAsk, executeTakerBid } from "./utils/calls/exchange";
import { transferBatchItemsAcrossCollections, grantApprovals, revokeApprovals } from "./utils/calls/transferManager";
import { encodeParams, getTakerParamsTypes, getMakerParamsTypes } from "./utils/encodeOrderParams";
import { addressesByNetwork, Addresses } from "./constants/addresses";
import { contractName, version } from "./constants/eip712";
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
  MerkleRoot,
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
  public readonly signer: Signer;
  /**
   * Ethers provider
   * @see https://docs.ethers.io/v5/api/providers/
   */
  public readonly provider: providers.Provider;

  /**
   * LooksRare protocol main class
   * @param signer Ethers signer
   * @param provider Ethers provider
   * @param chainId Current app chain id
   * @param override Overrides contract addresses for hardhat setup
   */
  constructor(signer: Signer, provider: providers.Provider, chainId: SupportedChainId, override?: Addresses) {
    this.chainId = chainId;
    this.addresses = override ?? addressesByNetwork[this.chainId];
    this.signer = signer;
    this.provider = new multicall.providers.MulticallProvider(provider);
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
    recipient = undefined,
    additionalParameters = [],
  }: MakerAskInputs): Promise<MakerAskOutputs> {
    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw new Error("Timestamps should be in seconds");
    }

    const signerAddress = await this.signer.getAddress();
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
      recipient: recipient ?? signerAddress,
      signer: signerAddress,
      startTime: startTime,
      endTime: endTime,
      minPrice: price,
      itemIds: itemIds,
      amounts: amounts,
      additionalParameters: encodeParams(additionalParameters, getMakerParamsTypes(strategyId)),
    };

    return {
      order,
      action: isCollectionApproved ? undefined : () => setApprovalForAll(this.signer, collection, spenderAddress),
    };
  }

  /**
   * Create a maker bid object ready to be signed
   * @param makerBidOutputs
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
    recipient = undefined,
    additionalParameters = [],
  }: MakerBidInputs): Promise<MakerBidOutputs> {
    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw new Error("Timestamps should be in seconds");
    }

    const signerAddress = await this.signer.getAddress();
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
      recipient: recipient ?? signerAddress,
      signer: signerAddress,
      startTime: startTime,
      endTime: endTime,
      maxPrice: price,
      itemIds: itemIds,
      amounts: amounts,
      additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(strategyId)),
    };

    return {
      order,
      action: BigNumber.from(currentAllowance).lt(price)
        ? () => approve(this.signer, currency, spenderAddress)
        : undefined,
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
    return await signMakerAsk(this.signer, this.getTypedDataDomain(), makerAsk);
  }

  /**
   * Sign a maker bid using the signer provided in the constructor
   * @param makerBid Order to be signed by the user
   * @returns Signature
   */
  public async signMakerBid(makerBid: MakerBid): Promise<string> {
    return await signMakerBid(this.signer, this.getTypedDataDomain(), makerBid);
  }

  /**
   * Sign multiple maker orders (bids or asks) with a single signature
   * @param makerOrders List of maker order to be signed
   * @returns Merkle tree and the signature
   */
  public async signMultipleMakers(makerOrders: (MakerAsk | MakerBid)[]) {
    const leaves = makerOrders.map((order) => {
      const hash = "askNonce" in order ? getMakerAskHash(order as MakerAsk) : getMakerBidHash(order as MakerBid);
      return Buffer.from(hash.slice(2), "hex");
    });
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const merkleRoot: MerkleRoot = { root: tree.getHexRoot() };
    const signature = await signMerkleRoot(this.signer, this.getTypedDataDomain(), merkleRoot);
    return { tree, leaves, root: merkleRoot.root, signature };
  }

  /**
   * Execute a trade with a taker ask and a maker bid
   * @param makerBid Maker bid
   * @param takerAsk Taker ask
   * @param signature Signature of the maker order
   */
  public async executeTakerAsk(
    makerBid: MakerBid,
    takerAsk: TakerAsk,
    signature: string,
    merkleRoot: MerkleRoot = { root: constants.HashZero },
    merkleProof: string[] = [],
    referrer: string = constants.AddressZero
  ): Promise<ContractReceipt> {
    const tx = await executeTakerAsk(
      this.signer,
      this.addresses.EXCHANGE,
      takerAsk,
      makerBid,
      signature,
      merkleRoot,
      merkleProof,
      referrer
    );
    return tx.wait();
  }

  /**
   * Execute a trade with a taker bid and a maker ask
   * @param makerAsk Maker ask
   * @param takerBid Taker bid
   * @param signature Signature of the maker order
   */
  public async executeTakerBid(
    makerAsk: MakerAsk,
    takerBid: TakerBid,
    signature: string,
    merkleRoot: MerkleRoot = { root: constants.HashZero },
    merkleProof: string[] = [],
    referrer: string = constants.AddressZero
  ): Promise<ContractReceipt> {
    const tx = await executeTakerBid(
      this.signer,
      this.addresses.EXCHANGE,
      takerBid,
      makerAsk,
      signature,
      merkleRoot,
      merkleProof,
      referrer
    );
    return tx.wait();
  }

  /**
   * Cancell all maker bid and/or ask orders for the current user
   * @param bid Cancel all bids
   * @param ask Cancel all asks
   */
  public async cancelAllOrders(bid: boolean, ask: boolean): Promise<ContractReceipt> {
    const tx = await incrementBidAskNonces(this.signer, this.addresses.EXCHANGE, bid, ask);
    return tx.wait();
  }

  /**
   * Cancel a list of specific orders
   * @param nonces List of nonces to be cancelled
   */
  public async cancelOrders(nonces: BigNumber[]): Promise<ContractReceipt> {
    const tx = await cancelOrderNonces(this.signer, this.addresses.EXCHANGE, nonces);
    return tx.wait();
  }

  /**
   * Cancel a list of specific subset orders
   * @param nonces List of nonces to be cancelled
   */
  public async cancelSubsetOrders(nonces: BigNumber[]): Promise<ContractReceipt> {
    const tx = await cancelSubsetNonces(this.signer, this.addresses.EXCHANGE, nonces);
    return tx.wait();
  }

  /**
   * Grant a list of operators the rights to transfer user's assets using the transfer manager
   * @param operators List of operators
   * @defaultValue Exchange address
   */
  public async grantTransferManagerApproval(operators: string[] = [this.addresses.EXCHANGE]) {
    const tx = await grantApprovals(this.signer, this.addresses.TRANSFER_MANAGER, operators);
    return tx.wait();
  }

  /**
   * Revoke a list of operators the rights to transfer user's assets using the transfer manager
   * @param operators List of operators
   * @defaultValue Exchange address
   */
  public async revokeTransferManagerApproval(operators: string[] = [this.addresses.EXCHANGE]) {
    const tx = await revokeApprovals(this.signer, this.addresses.TRANSFER_MANAGER, operators);
    return tx.wait();
  }

  public async transferItemsAcrossCollection(
    collections: string[],
    assetTypes: AssetType[],
    from: string,
    to: string,
    itemIds: BigNumberish[][],
    amounts: BigNumberish[][]
  ) {
    const tx = await transferBatchItemsAcrossCollections(
      this.signer,
      this.addresses.TRANSFER_MANAGER,
      collections,
      assetTypes,
      from,
      to,
      itemIds,
      amounts
    );
    return tx.wait();
  }
}
