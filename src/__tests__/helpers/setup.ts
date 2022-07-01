import { Contract } from "ethers";
import { ethers } from "hardhat";
import type { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";

export interface Mocks {
  looksRareProtocol: LooksRareProtocol;
}

const deploy = async (name: string, ...args: any[]): Promise<Contract> => {
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy(...args);
  await contract.deployed();
  return contract;
};

export async function setUpContracts(): Promise<Mocks> {
  const transferManager = await deploy("TransferManager");
  const looksRareProtocol = await deploy(
    "LooksRareProtocol",
    transferManager.address,
    "0x0000000000000000000000000000000000000000"
  );
  return { looksRareProtocol: looksRareProtocol as LooksRareProtocol };
}
