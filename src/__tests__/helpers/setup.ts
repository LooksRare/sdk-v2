/* eslint-disable no-await-in-loop */
import { Contract, constants, ContractTransaction } from "ethers";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Addresses } from "../../types";
import type { LooksRareProtocol } from "../../typechain/@looksrare/contracts-exchange-v2/contracts/LooksRareProtocol";
import type { TransferManager } from "../../typechain/@looksrare/contracts-exchange-v2/contracts/TransferManager";
import type { StrategyCollectionOffer } from "../../typechain/@looksrare/contracts-exchange-v2/contracts/executionStrategies/StrategyCollectionOffer";
import type { CreatorFeeManagerWithRoyalties } from "../../typechain/@looksrare/contracts-exchange-v2/contracts/CreatorFeeManagerWithRoyalties";
import type { OrderValidatorV2A } from "../../typechain/@looksrare/contracts-exchange-v2/contracts/helpers/OrderValidatorV2A";
import type { MockERC721 } from "../../typechain/src/contracts/tests/MockERC721";
import type { MockERC1155 } from "../../typechain/src/contracts/tests/MockERC1155";
import type { WETH } from "../../typechain/solmate/src/tokens/WETH";
import type { Verifier } from "../../typechain/src/contracts/tests/Verifier";

chai.use(chaiAsPromised);

export interface SetupMocks {
  contracts: {
    looksRareProtocol: LooksRareProtocol;
    transferManager: TransferManager;
    collectionERC721: MockERC721;
    collectionERC1155: MockERC1155;
    weth: WETH;
    verifier: Verifier;
    orderValidator: OrderValidatorV2A;
  };
  addresses: Addresses;
}

export interface Signers {
  owner: SignerWithAddress;
  operator: SignerWithAddress;
  protocolFeeRecipient: SignerWithAddress;
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
    protocolFeeRecipient: signers[2],
    user1: signers[3],
    user2: signers[4],
    user3: signers[5],
  };
};

const deploy = async (name: string, ...args: any[]): Promise<Contract> => {
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy(...args);
  await contract.deployed();
  return contract;
};

export const setUpContracts = async (): Promise<SetupMocks> => {
  const signers = await getSigners();
  let tx: ContractTransaction;

  // Deploy contracts
  const transferManager = (await deploy("TransferManager", signers.owner.address)) as TransferManager;
  const royaltyFeeRegistry = await deploy("MockRoyaltyFeeRegistry", signers.owner.address, 9500);
  const feeManager = (await deploy(
    "CreatorFeeManagerWithRoyalties",
    royaltyFeeRegistry.address
  )) as CreatorFeeManagerWithRoyalties;
  const weth = (await deploy("WETH")) as WETH;
  const looksRareProtocol = (await deploy(
    "LooksRareProtocol",
    signers.owner.address,
    signers.protocolFeeRecipient.address,
    transferManager.address,
    weth.address
  )) as LooksRareProtocol;
  const strategyCollectionOffer = (await deploy("StrategyCollectionOffer")) as StrategyCollectionOffer;

  tx = await looksRareProtocol.updateCreatorFeeManager(feeManager.address);
  await tx.wait();
  tx = await looksRareProtocol.updateCurrencyStatus(constants.AddressZero, true);
  await tx.wait();
  tx = await looksRareProtocol.updateCurrencyStatus(weth.address, true);
  await tx.wait();
  tx = await transferManager.allowOperator(looksRareProtocol.address);
  await tx.wait();
  tx = await looksRareProtocol.addStrategy(
    250,
    250,
    300,
    strategyCollectionOffer.interface.getSighash("executeCollectionStrategyWithTakerAsk"),
    true,
    strategyCollectionOffer.address
  );
  await tx.wait();

  const orderValidator = (await deploy("OrderValidatorV2A", looksRareProtocol.address)) as OrderValidatorV2A;
  const collectionERC721 = (await deploy("MockERC721", "collectionERC721", "COL1")) as MockERC721;
  const collectionERC1155 = (await deploy("MockERC1155")) as MockERC1155;
  const verifier = (await deploy("Verifier", looksRareProtocol.address)) as Verifier;

  // Setup balances
  const wethUser1 = new ethers.Contract(weth.address, weth.interface, signers.user1);
  tx = await wethUser1.deposit({ value: ethers.utils.parseEther("10") });
  await tx.wait();

  const wethUser2 = new ethers.Contract(weth.address, weth.interface, signers.user2);
  tx = await wethUser2.deposit({ value: ethers.utils.parseEther("10") });
  await tx.wait();

  for (let i = 0; i < NB_NFT_PER_USER; i++) {
    tx = await collectionERC721.mint(signers.user1.address);
    await tx.wait();
    tx = await collectionERC1155.mint(signers.user2.address, i, 10);
    await tx.wait();
  }
  tx = await collectionERC1155.mint(signers.user1.address, 0, 10);
  await tx.wait();

  return {
    contracts: {
      looksRareProtocol,
      transferManager,
      collectionERC721,
      collectionERC1155,
      weth,
      verifier,
      orderValidator,
    },
    addresses: {
      EXCHANGE_V2: looksRareProtocol.address,
      LOOKS: constants.AddressZero,
      TRANSFER_MANAGER_V2: transferManager.address,
      WETH: weth.address,
      ORDER_VALIDATOR_V2: orderValidator.address,
      REVERSE_RECORDS: constants.AddressZero,
      LOOKS_LP_V3: constants.AddressZero,
    },
  };
};
