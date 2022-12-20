/* eslint-disable no-await-in-loop */
import { Contract, constants, ContractTransaction } from "ethers";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import type { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import type { TransferManager } from "../../../typechain/contracts-exchange-v2/contracts/TransferManager";
import type { CreatorFeeManagerWithRoyalties } from "../../../typechain/contracts-exchange-v2/contracts/CreatorFeeManagerWithRoyalties";
import type { MockERC721 } from "../../../typechain/src/contracts/tests/MockERC721";
import type { MockERC1155 } from "../../../typechain/src/contracts/tests/MockERC1155";
import type { MockERC20 } from "../../../typechain/src/contracts/tests/MockERC20";
import type { Verifier } from "../../../typechain/src/contracts/tests/Verifier";

chai.use(chaiAsPromised);

export interface Mocks {
  looksRareProtocol: LooksRareProtocol;
  transferManager: TransferManager;
  collection1: MockERC721;
  collection2: MockERC1155;
  collection3: MockERC721;
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

export const NB_NFT_PER_USER = 3;

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
  const signers = await getSigners();
  let tx: ContractTransaction;

  // Deploy contracts
  const transferManager = (await deploy("TransferManager")) as TransferManager;
  const royaltyFeeRegistry = await deploy("MockRoyaltyFeeRegistry", 9500);
  const feeManager = (await deploy(
    "CreatorFeeManagerWithRoyalties",
    royaltyFeeRegistry.address
  )) as CreatorFeeManagerWithRoyalties;
  const weth = (await deploy("MockERC20", "MockWETH", "WETH", 18)) as MockERC20;
  const looksRareProtocol = await deploy("LooksRareProtocol", transferManager.address, weth.address);
  const collection1 = (await deploy("MockERC721", "Collection1", "COL1")) as MockERC721;
  const collection2 = (await deploy("MockERC1155")) as MockERC1155;
  const collection3 = (await deploy("MockERC721", "Collection3", "COL3")) as MockERC721;
  const verifier = (await deploy("Verifier", looksRareProtocol.address)) as Verifier;

  tx = await looksRareProtocol.setCreatorFeeManager(feeManager.address);
  await tx.wait();
  tx = await looksRareProtocol.updateCurrencyWhitelistStatus(constants.AddressZero, true);
  await tx.wait();
  tx = await looksRareProtocol.updateCurrencyWhitelistStatus(weth.address, true);
  await tx.wait();
  tx = await transferManager.whitelistOperator(looksRareProtocol.address);
  await tx.wait();

  // Setup balances
  for (let i = 0; i < NB_NFT_PER_USER; i++) {
    tx = await collection1.mint(signers.user1.address, i);
    await tx.wait();
    tx = await collection2.mint(signers.user2.address, i, 10);
    await tx.wait();
  }
  tx = await collection2.mint(signers.user1.address, 0, 10);
  await tx.wait();

  return {
    looksRareProtocol: looksRareProtocol as LooksRareProtocol,
    transferManager: transferManager as TransferManager,
    collection1: collection1 as MockERC721,
    collection2: collection2 as MockERC1155,
    collection3: collection3 as MockERC721,
    weth: weth as MockERC20,
    verifier: verifier as Verifier,
  };
};
