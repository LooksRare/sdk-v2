import { BigNumber } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { signMakerAsk, signMakerBid } from "./utils/signMakerOrders";
import { incrementBidAskNonces, cancelOrderNonces, cancelSubsetNonces } from "./utils/calls/nonces";
import { executeTakerAsk, executeTakerBid } from "./utils/calls/exchange";
import {
  createMakerAsk,
  createMakerBid,
  MakerAskInputs,
  MakerBidInputs,
  MakerAskOutputs,
  MakerBidOutputs,
} from "./utils/makerOrders";
import { encodeParams, getTakerParamsTypes } from "./utils/encodeOrderParams";
import { addressesByNetwork, Addresses } from "./constants/addresses";
import { contractName, version } from "./constants/eip712";
import { MakerAsk, MakerBid, TakerAsk, TakerBid, SupportedChainId, Signer } from "./types";

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

  public async createMakerAsk(signer: Signer, makerAskInputs: MakerAskInputs): Promise<MakerAskOutputs> {
    return await createMakerAsk(signer, this.addresses.TRANSFER_MANAGER, makerAskInputs);
  }

  public async createMakerBid(signer: Signer, makerOrderInputs: MakerBidInputs): Promise<MakerBidOutputs> {
    return await createMakerBid(signer, this.addresses.TRANSFER_MANAGER, makerOrderInputs);
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

  public async executeTakerAsk(signer: Signer, makerBid: MakerBid, takerAsk: TakerAsk, signature: string) {
    const tx = await executeTakerAsk(signer, this.addresses.EXCHANGE, takerAsk, makerBid, signature);
    return tx.wait();
  }

  public async executeTakerBid(signer: Signer, makerAsk: MakerAsk, takerBid: TakerBid, signature: string) {
    const tx = await executeTakerBid(signer, this.addresses.EXCHANGE, takerBid, makerAsk, signature);
    return tx.wait();
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
