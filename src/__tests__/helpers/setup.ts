import { Contract } from "ethers";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import type { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import type { TransferManager } from "../../../typechain/contracts-exchange-v2/contracts/TransferManager";
import type { MockERC721 } from "../../../typechain/src/contracts/tests/MockERC721";
import type { MockERC1155 } from "../../../typechain/src/contracts/tests/MockERC1155";
import type { MockERC20 } from "../../../typechain/src/contracts/tests/MockERC20";
import type { Verifier } from "../../../typechain/src/contracts/tests/Verifier";

chai.use(chaiAsPromised);

export interface Mocks {
  looksRareProtocol: LooksRareProtocol;
  transferManager: TransferManager;
  collection1: MockERC721;
  collection2: MockERC721;
  collection3: MockERC1155;
  weth: MockERC20;
  verifier: Verifier;
}

export interface Signers {
  owner: SignerWithAddress;
  operator: SignerWithAddress;
  user1: SignerWithAddress;
  user2: SignerWithAddress;
  user3: SignerWithAddress;
}

export const NB_NFT_PER_USER = 5;

export const getSigners = async (): Promise<Signers> => {
  const signers = await ethers.getSigners();
  return {
    owner: signers[0],
    operator: signers[1],
    user1: signers[2],
    user2: signers[3],
    user3: signers[4],
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
  const collection1 = (await deploy("MockERC721", "Collection1", "COL1")) as MockERC721;
  const collection2 = (await deploy("MockERC721", "Collection2", "COL2")) as MockERC721;
  const collection3 = (await deploy("MockERC1155")) as MockERC1155;
  const collection4 = (await deploy("MockERC721", "Collection4", "COL4")) as MockERC721;
  const weth = (await deploy("MockERC20", "MockWETH", "WETH", 18)) as MockERC20;
  const verifier = (await deploy("Verifier", looksRareProtocol.address)) as Verifier;

  // Setup balances
  const signers = await getSigners();
  const promises = [];
  for (let i = 0; i < NB_NFT_PER_USER; i++) {
    promises.push(collection1.mint(signers.user1.address, i));
    promises.push(collection2.mint(signers.user2.address, i));
    promises.push(collection3.mint(signers.user3.address, i, 10));
    promises.push(collection4.mint(signers.user1.address, i));
  }
  await Promise.all(promises);

  return {
    looksRareProtocol: looksRareProtocol as LooksRareProtocol,
    transferManager: transferManager as TransferManager,
    collection1: collection1 as MockERC721,
    collection2: collection2 as MockERC721,
    collection3: collection3 as MockERC1155,
    weth: weth as MockERC20,
    verifier: verifier as Verifier,
  };
};
