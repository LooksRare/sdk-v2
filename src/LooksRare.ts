import { TypedDataSigner, TypedDataDomain } from "@ethersproject/abstract-signer";
import { signMakerAsk, signMakerBid } from "./utils/signMakerOrders";
import { addressesByNetwork, Addresses } from "./constants/addresses";
import { contractName, version } from "./constants/eip712";
import { MakerAsk, MakerBid, SupportedChainId } from "./types";

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

  public async signMakerAsk(signer: TypedDataSigner, makerAsk: MakerAsk): Promise<string> {
    return await signMakerAsk(signer, this.getTypedDataDomain(), makerAsk);
  }

  public async signMakerBid(signer: TypedDataSigner, makerBid: MakerBid): Promise<string> {
    return await signMakerBid(signer, this.getTypedDataDomain(), makerBid);
  }
}
