import { ethers, Contract } from "ethers";
import { Greeter } from "../../typechain/Greeter";
import abi from "../abis/Greeter.json";

export const greet = (address: string, signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  const contract = new Contract(address, abi, signerOrProvider) as Greeter;
  return contract.greet();
};
