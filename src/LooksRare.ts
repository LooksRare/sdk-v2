import { BigNumber } from "ethers";
import { TypedDataSigner, TypedDataDomain } from "@ethersproject/abstract-signer";
import { signMakerAsk, signMakerBid } from "./utils/signMakerOrders";
import { encodeParams, getMakerParamsTypes, getTakerParamsTypes } from "./utils/encodeOrderParams";
import { addressesByNetwork, Addresses } from "./constants/addresses";
import { contractName, version } from "./constants/eip712";
import { minNetPriceRatio } from "./constants/";
import { MakerAsk, MakerBid, TakerAsk, TakerBid, SupportedChainId, MakerAskInputs, MakerBidInputs } from "./types";

export class LooksRare {
  public chainId: SupportedChainId;
  public addresses: Addresses;

  constructor(chainId: SupportedChainId) {
    this.chainId = chainId;
    this.addresses = addressesByNetwork[this.chainId];
  }

  getTypedDataDomain(): TypedDataDomain {
    return {
      name: contractName,
      version: version.toString(),
      chainId: this.chainId,
      verifyingContract: this.addresses.EXCHANGE,
    };
  }

  public createMakerAsk({
    signer,
    collection,
    strategy,
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
  }: MakerAskInputs): MakerAsk {
    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw new Error("Timestamps should be in seconds");
    }

    const order: MakerAsk = {
      askNonce: askNonce,
      subsetNonce: subsetNonce,
      strategyId: strategy,
      assetType: assetType,
      orderNonce: orderNonce,
      minNetRatio: minNetPriceRatio, // @TODO update with protocol fees and royalties data
      collection: collection,
      currency: currency,
      recipient: recipient ?? signer,
      signer: signer,
      startTime: startTime,
      endTime: endTime,
      minPrice: price,
      itemIds: itemIds,
      amounts: amounts,
      additionalParameters: encodeParams(additionalParameters, getMakerParamsTypes(strategy)),
    };

    return order;
  }

  public createMakerBid({
    signer,
    collection,
    strategy,
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
  }: MakerBidInputs): MakerBid {
    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw new Error("Timestamps should be in seconds");
    }

    const order: MakerBid = {
      bidNonce: bidNonce,
      subsetNonce: subsetNonce,
      strategyId: strategy,
      assetType: assetType,
      orderNonce: orderNonce,
      minNetRatio: minNetPriceRatio, // @TODO update with protocol fees and royalties data
      collection: collection,
      currency: currency,
      recipient: recipient ?? signer,
      signer: signer,
      startTime: startTime,
      endTime: endTime,
      maxPrice: price,
      itemIds: itemIds,
      amounts: amounts,
      additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(strategy)),
    };

    return order;
  }

  public async signMakerAsk(signer: TypedDataSigner, makerAsk: MakerAsk): Promise<string> {
    return await signMakerAsk(signer, this.getTypedDataDomain(), makerAsk);
  }

  public async signMakerBid(signer: TypedDataSigner, makerBid: MakerBid): Promise<string> {
    return await signMakerBid(signer, this.getTypedDataDomain(), makerBid);
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
}
