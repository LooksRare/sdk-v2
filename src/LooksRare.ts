import { ethers } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { SupportedChainId } from "./types";
import { information } from "./utils/looksRareProtocol";
import { addressesByNetwork, Addresses } from "./constants/addresses";
import { contractName, version } from "./constants/eip712";

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

  async information(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
    return information(this.addresses.EXCHANGE, signerOrProvider);
  }
}
