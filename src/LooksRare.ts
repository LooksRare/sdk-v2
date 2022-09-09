import { BigNumber, Contract } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { signMakerAsk, signMakerBid } from "./utils/signMakerOrders";
import { encodeParams, getMakerParamsTypes, getTakerParamsTypes } from "./utils/encodeOrderParams";
import { addressesByNetwork, Addresses } from "./constants/addresses";
import { contractName, version } from "./constants/eip712";
import { minNetPriceRatio } from "./constants/";
import {
  MakerAsk,
  MakerBid,
  TakerAsk,
  TakerBid,
  SupportedChainId,
  MakerAskInputs,
  MakerBidInputs,
  Signer,
} from "./types";
import abiIERC721 from "./abis/IERC721.json";
import abiIERC20 from "./abis/IERC20.json";
import { IERC721 } from "../typechain/contracts-exchange-v2/contracts/interfaces/IERC721";
import { IERC20 } from "../typechain/contracts-exchange-v2/contracts/interfaces/IERC20";

export class LooksRare {
  public chainId: SupportedChainId;
  public addresses: Addresses;

  constructor(chainId: SupportedChainId, override?: Addresses) {
    this.chainId = chainId;
    this.addresses = override ?? addressesByNetwork[this.chainId];
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

  public async signMakerAsk(signer: Signer, makerAsk: MakerAsk): Promise<string> {
    const signerAddress = await signer.getAddress();
    const contract = new Contract(makerAsk.collection, abiIERC721, signer) as IERC721;

    const isCollectionApproved = await contract.isApprovedForAll(signerAddress, this.addresses.TRANSFER_MANAGER);
    if (!isCollectionApproved) {
      throw new Error("NFT not approved for transfer");
    }
    return await signMakerAsk(signer, this.getTypedDataDomain(), makerAsk);
  }

  public async signMakerBid(signer: Signer, makerBid: MakerBid): Promise<string> {
    const signerAddress = await signer.getAddress();
    const contract = new Contract(makerBid.currency, abiIERC20, signer) as IERC20;

    const allowance = await contract.allowance(signerAddress, this.addresses.TRANSFER_MANAGER);
    if (BigNumber.from(allowance).lt(makerBid.maxPrice)) {
      throw new Error("Allowance too low");
    }
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
