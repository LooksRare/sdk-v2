import { ethers } from "ethers";
import { SupportedChainId } from "./types";
import { greet } from "./calls/greeter";
import { addressesByNetwork, Addresses } from "./constants/addresses";

export class LooksRare {
  static readonly version: number = 2;

  public chainId: SupportedChainId;
  public addresses: Addresses;

  constructor(chainId: SupportedChainId) {
    this.chainId = chainId;
    this.addresses = addressesByNetwork[this.chainId];
  }

  async greet(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
    return greet(this.addresses.EXCHANGE, signerOrProvider);
  }
}
