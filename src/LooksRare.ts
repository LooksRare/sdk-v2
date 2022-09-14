import { BigNumber, ContractReceipt } from "ethers";
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
  public signer: Signer;

  constructor(signer: Signer, chainId: SupportedChainId, override?: Addresses) {
    this.chainId = chainId;
    this.addresses = override ?? addressesByNetwork[this.chainId];
    this.signer = signer;
  }

  public async createMakerAsk(makerAskInputs: MakerAskInputs): Promise<MakerAskOutputs> {
    return await createMakerAsk(this.signer, this.addresses.TRANSFER_MANAGER, makerAskInputs);
  }

  public async createMakerBid(makerOrderInputs: MakerBidInputs): Promise<MakerBidOutputs> {
    return await createMakerBid(this.signer, this.addresses.TRANSFER_MANAGER, makerOrderInputs);
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
