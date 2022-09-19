import { BigNumber, ContractReceipt, providers } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { signMakerAsk, signMakerBid } from "./utils/signMakerOrders";
import { incrementBidAskNonces, cancelOrderNonces, cancelSubsetNonces } from "./utils/calls/nonces";
import { executeTakerAsk, executeTakerBid } from "./utils/calls/exchange";
import { encodeParams, getTakerParamsTypes, getMakerParamsTypes } from "./utils/encodeOrderParams";
import { minNetPriceRatio } from "./constants";
import { addressesByNetwork, Addresses } from "./constants/addresses";
import { contractName, version } from "./constants/eip712";
import { setApprovalForAll, isApprovedForAll, allowance, approve } from "./utils/calls/tokens";
import {
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
} from "./types";

export class LooksRare {
  public readonly chainId: SupportedChainId;
  public readonly addresses: Addresses;
  public readonly signer: Signer;
  public readonly provider: providers.Provider;

  constructor(signer: Signer, provider: providers.Provider, chainId: SupportedChainId, override?: Addresses) {
    this.chainId = chainId;
    this.addresses = override ?? addressesByNetwork[this.chainId];
    this.signer = signer;
    this.provider = provider;
  }

  public async createMakerAsk({
    collection,
    strategyId,
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
  }: MakerAskInputs): Promise<MakerAskOutputs> {
    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw new Error("Timestamps should be in seconds");
    }

    const signerAddress = await this.signer.getAddress();

    const order: MakerAsk = {
      askNonce: askNonce,
      subsetNonce: subsetNonce,
      strategyId: strategyId,
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
      additionalParameters: encodeParams(additionalParameters, getMakerParamsTypes(strategyId)),
    };

    const isCollectionApproved = await isApprovedForAll(
      this.signer,
      collection,
      signerAddress,
      this.addresses.TRANSFER_MANAGER
    );
    const action = isCollectionApproved
      ? undefined
      : () => setApprovalForAll(this.signer, collection, this.addresses.TRANSFER_MANAGER);

    return { order, action };
  }

  public async createMakerBid({
    collection,
    strategyId,
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
  }: MakerBidInputs): Promise<MakerBidOutputs> {
    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw new Error("Timestamps should be in seconds");
    }

    const signerAddress = await this.signer.getAddress();

    const order: MakerBid = {
      bidNonce: bidNonce,
      subsetNonce: subsetNonce,
      strategyId: strategyId,
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
      additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(strategyId)),
    };

    const currentAllowance = await allowance(this.signer, currency, signerAddress, this.addresses.TRANSFER_MANAGER);
    const action = BigNumber.from(currentAllowance).lt(price)
      ? () => approve(this.signer, currency, this.addresses.TRANSFER_MANAGER)
      : undefined;

    return { order, action };
  }

  public createTakerAsk(makerBid: MakerBid, recipient: string, additionalParameters: any[] = []): TakerAsk {
    const order: TakerAsk = {
      recipient: recipient,
      minNetRatio: makerBid.minNetRatio,
      minPrice: makerBid.maxPrice,
      itemIds: makerBid.itemIds,
      amounts: makerBid.amounts,
      additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(makerBid.strategyId)),
    };
    return order;
  }

  public createTakerBid(makerAsk: MakerAsk, recipient: string, additionalParameters: any[] = []): TakerBid {
    const order: TakerBid = {
      recipient: recipient,
      minNetRatio: makerAsk.minNetRatio,
      maxPrice: makerAsk.minPrice,
      itemIds: makerAsk.itemIds,
      amounts: makerAsk.amounts,
      additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(makerAsk.strategyId)),
    };
    return order;
  }

  public getTypedDataDomain(): TypedDataDomain {
    return {
      name: contractName,
      version: version.toString(),
      chainId: this.chainId,
      verifyingContract: this.addresses.EXCHANGE,
    };
  }

  public async signMakerAsk(makerAsk: MakerAsk): Promise<string> {
    return await signMakerAsk(this.signer, this.getTypedDataDomain(), makerAsk);
  }

  public async signMakerBid(makerBid: MakerBid): Promise<string> {
    return await signMakerBid(this.signer, this.getTypedDataDomain(), makerBid);
  }

  public async executeTakerAsk(makerBid: MakerBid, takerAsk: TakerAsk, signature: string): Promise<ContractReceipt> {
    const tx = await executeTakerAsk(this.signer, this.addresses.EXCHANGE, takerAsk, makerBid, signature);
    return tx.wait();
  }

  public async executeTakerBid(makerAsk: MakerAsk, takerBid: TakerBid, signature: string): Promise<ContractReceipt> {
    const tx = await executeTakerBid(this.signer, this.addresses.EXCHANGE, takerBid, makerAsk, signature);
    return tx.wait();
  }

  public async cancelAllOrders(bid: boolean, ask: boolean): Promise<ContractReceipt> {
    const tx = await incrementBidAskNonces(this.signer, this.addresses.EXCHANGE, bid, ask);
    return tx.wait();
  }

  public async cancelOrders(nonces: BigNumber[]): Promise<ContractReceipt> {
    const tx = await cancelOrderNonces(this.signer, this.addresses.EXCHANGE, nonces);
    return tx.wait();
  }

  public async cancelSubsetOrders(nonces: BigNumber[]): Promise<ContractReceipt> {
    const tx = await cancelSubsetNonces(this.signer, this.addresses.EXCHANGE, nonces);
    return tx.wait();
  }
}
