import { Contract } from "ethers";
import { ethers } from "hardhat";
import type { Greeter } from "../../../typechain";

export interface Mocks {
  greeter: Greeter;
}

const deploy = async (name: string, ...args: any[]): Promise<Contract> => {
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy(...args);
  await contract.deployed();
  return contract;
};

export async function setUpContracts(): Promise<Mocks> {
  const greeter = await deploy("Greeter", "Hello");
  return { greeter: greeter as Greeter };
}
