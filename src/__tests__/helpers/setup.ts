import { Contract } from "ethers";
import { ethers } from "hardhat";
import type { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import type { MockERC721 } from "../../../typechain/src/contracts/tests/MockERC721";
import type { MockERC1155 } from "../../../typechain/src/contracts/tests/MockERC1155";

export interface Mocks {
  looksRareProtocol: LooksRareProtocol;
  collection1: MockERC721;
  collection2: MockERC721;
  collection3: MockERC1155;
}

export const getSigners = async () => {
  const signers = await ethers.getSigners();
  return {
    owner: signers[0],
    user1: signers[1],
    user2: signers[2],
    user3: signers[3],
  };
};

const deploy = async (name: string, ...args: any[]): Promise<Contract> => {
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy(...args);
  await contract.deployed();
  return contract;
};

export const setUpContracts = async (): Promise<Mocks> => {
  // Deploy contracts
  const transferManager = await deploy("TransferManager");
  const looksRareProtocol = await deploy(
    "LooksRareProtocol",
    transferManager.address,
    "0x0000000000000000000000000000000000000000"
  );
  const collection1 = await deploy("MockERC721");
  const collection2 = await deploy("MockERC721");
  const collection3 = await deploy("MockERC1155");

  // Setup balances
  const signers = await getSigners();
  for (let i = 0; i < 5; i++) {
    collection1.mint(signers.user1, i);
    collection2.mint(signers.user2, i);
    collection3.mint(signers.user3, i, 10);
  }

  return {
    looksRareProtocol: looksRareProtocol as LooksRareProtocol,
    collection1: collection1 as MockERC721,
    collection2: collection2 as MockERC721,
    collection3: collection3 as MockERC1155,
  };
};
