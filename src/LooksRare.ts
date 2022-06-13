import { ethers } from "ethers";
import { SupportedChainId } from "./types";
import { greet } from "./calls/greeter";
import { addressesByNetwork } from "./constants/addresses";

export class LooksRare {
  public chainId: SupportedChainId;

  constructor(chainId: SupportedChainId) {
    this.chainId = chainId;
  }

  async greet(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
    const address = addressesByNetwork[this.chainId].EXCHANGE;
    return greet(address, signerOrProvider);
  }
}
