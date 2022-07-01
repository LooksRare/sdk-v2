import { ethers, Contract } from "ethers";
import { LooksRareProtocol } from "../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import abi from "../abis/LooksRareProtocol.json";

export const information = (address: string, signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  const contract = new Contract(address, abi, signerOrProvider) as LooksRareProtocol;
  return contract.information();
};
