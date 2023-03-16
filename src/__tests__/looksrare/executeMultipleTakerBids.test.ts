import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { SupportedChainId, CollectionType, StrategyType, CreateMakerInput } from "../../types";

describe("execute multiple taker bids", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let baseMakerAskInput: CreateMakerInput;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();

    const tx = await mocks.contracts.transferManager
      .connect(signers.user1)
      .grantApprovals([mocks.addresses.EXCHANGE_V2]);
    await tx.wait();

    baseMakerAskInput = {
      collection: mocks.contracts.collectionERC721.address,
      collectionType: CollectionType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [0],
    };
  });
  it("execute multiple taker bid", async () => {
    const lrUser1 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const lrUser2 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user2, mocks.addresses);
    let tx = await lrUser1.approveAllCollectionItems(baseMakerAskInput.collection);
    await tx.wait();

    // Order 1
    const { maker: maker1 } = await lrUser1.createMakerAsk({ ...baseMakerAskInput });
    const signature1 = await lrUser1.signMakerOrder(maker1);
    const taker1 = lrUser2.createTaker(maker1, signers.user2.address);

    // Order 2
    const { maker: maker2 } = await lrUser1.createMakerAsk({ ...baseMakerAskInput, itemIds: [1], orderNonce: 1 });
    const signature2 = await lrUser1.signMakerOrder(maker2);
    const taker2 = lrUser2.createTaker(maker2, signers.user2.address);

    const orders = [
      { maker: maker1, taker: taker1, signature: signature1 },
      { maker: maker2, taker: taker2, signature: signature2 },
    ];

    const contractMethods = lrUser2.executeMultipleOrders(orders, true);

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;

    tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
  it("execute multiple taker bid with a merkle tree", async () => {
    const lrUser1 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const lrUser2 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user2, mocks.addresses);
    let tx = await lrUser1.approveAllCollectionItems(baseMakerAskInput.collection);
    await tx.wait();

    // Order 1
    const { maker: maker1 } = await lrUser1.createMakerAsk({ ...baseMakerAskInput });
    const taker1 = lrUser2.createTaker(maker1, signers.user2.address);

    // Order 2
    const { maker: maker2 } = await lrUser1.createMakerAsk({ ...baseMakerAskInput, itemIds: [1], orderNonce: 1 });
    const taker2 = lrUser2.createTaker(maker2, signers.user2.address);

    const { signature, merkleTreeProofs } = await lrUser1.signMultipleMakerOrders([maker1, maker2]);

    const orders = [
      { maker: maker1, taker: taker1, signature: signature, merkleTree: merkleTreeProofs[0] },
      { maker: maker2, taker: taker2, signature: signature, merkleTree: merkleTreeProofs[1] },
    ];

    const contractMethods = lrUser2.executeMultipleOrders(orders, true);

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;

    tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
});
