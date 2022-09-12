import { BigNumber, Contract, ContractTransaction, constants } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { signMakerAsk, signMakerBid } from "./utils/signMakerOrders";
import { incrementBidAskNonces, cancelOrderNonces, cancelSubsetNonces } from "./utils/calls/nonces";
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

  public async createMakerAsk({
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
  }: MakerAskInputs): Promise<{ order: MakerAsk; action?: () => Promise<ContractTransaction> }> {
    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw new Error("Timestamps should be in seconds");
    }

    const signerAddress = await signer.getAddress();

    const order: MakerAsk = {
      askNonce: askNonce,
      subsetNonce: subsetNonce,
      strategyId: strategy,
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
      additionalParameters: encodeParams(additionalParameters, getMakerParamsTypes(strategy)),
    };

    const contract = new Contract(collection, abiIERC721, signer) as IERC721;
    const isCollectionApproved = await contract.isApprovedForAll(signerAddress, this.addresses.TRANSFER_MANAGER);
    const action = isCollectionApproved
      ? undefined
      : () => contract.setApprovalForAll(this.addresses.TRANSFER_MANAGER, true);

    return { order, action };
  }

  public async createMakerBid({
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
  }: MakerBidInputs): Promise<{ order: MakerBid; action?: () => Promise<ContractTransaction> }> {
    if (BigNumber.from(startTime).toString().length > 10 || BigNumber.from(endTime).toString().length > 10) {
      throw new Error("Timestamps should be in seconds");
    }

    const signerAddress = await signer.getAddress();

    const order: MakerBid = {
      bidNonce: bidNonce,
      subsetNonce: subsetNonce,
      strategyId: strategy,
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
      additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(strategy)),
    };

    const contract = new Contract(currency, abiIERC20, signer) as IERC20;

    const allowance = await contract.allowance(signerAddress, this.addresses.TRANSFER_MANAGER);
    const action = BigNumber.from(allowance).lt(price)
      ? () => contract.approve(this.addresses.TRANSFER_MANAGER, constants.MaxUint256)
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

  public async signMakerAsk(signer: Signer, makerAsk: MakerAsk): Promise<string> {
    return await signMakerAsk(signer, this.getTypedDataDomain(), makerAsk);
  }

  public async signMakerBid(signer: Signer, makerBid: MakerBid): Promise<string> {
    return await signMakerBid(signer, this.getTypedDataDomain(), makerBid);
  }

  public async cancelAllOrders(signer: Signer, bid: boolean, ask: boolean) {
    const tx = await incrementBidAskNonces(signer, this.addresses.EXCHANGE, bid, ask);
    return tx.wait();
  }

  public async cancelOrders(signer: Signer, nonces: BigNumber[]) {
    const tx = await cancelOrderNonces(signer, this.addresses.EXCHANGE, nonces);
    return tx.wait();
  }

  public async cancelSubsetOrders(signer: Signer, nonces: BigNumber[]) {
    const tx = await cancelSubsetNonces(signer, this.addresses.EXCHANGE, nonces);
    return tx.wait();
  }
}
