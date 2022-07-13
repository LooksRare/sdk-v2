import { ethers } from "ethers";
import { TypedDataSigner, TypedDataDomain } from "@ethersproject/abstract-signer";
import { SupportedChainId, MultipleMakerBidOrders, MultipleMakerAskOrders } from "./types";
import { information } from "./utils/looksRareProtocol";
import { signMakerOrders } from "./utils/signMakerOrders";
import { addressesByNetwork, Addresses } from "./constants/addresses";
import { contractName, version, types as eip712OrderTypes } from "./constants/eip712";

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

  async createMakerOrders(signer: TypedDataSigner, makerOrders: MultipleMakerBidOrders | MultipleMakerAskOrders) {
    return signMakerOrders(signer, this.getTypedDataDomain(), eip712OrderTypes, makerOrders);
  }

  async information(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
    return information(this.addresses.EXCHANGE, signerOrProvider);
  }
}
