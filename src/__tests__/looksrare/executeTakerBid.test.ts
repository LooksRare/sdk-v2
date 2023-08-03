import { expect } from "chai";
import { parseEther } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { ChainId, CollectionType, StrategyType, CreateMakerInput } from "../../types";

describe("execute taker bid", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let lrUser1: LooksRare;
  let lrUser2: LooksRare;
  let baseMakerAskInput: CreateMakerInput;

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
    lrUser1 = new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    lrUser2 = new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user2, mocks.addresses);

    baseMakerAskInput = {
      collection: mocks.addresses.MOCK_COLLECTION_ERC721,
      collectionType: CollectionType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: parseEther("1"),
      itemIds: [1],
    };

    let tx = await lrUser1.grantTransferManagerApproval().call();
    await tx.wait();

    tx = await lrUser1.approveAllCollectionItems(baseMakerAskInput.collection);
    await tx.wait();

    tx = await lrUser2.approveErc20(mocks.addresses.WETH);
    await tx.wait();
  });

  it("execute estimatedGas and callStatic", async () => {
    const { maker } = await lrUser1.createMakerAsk(baseMakerAskInput);
    const signature = await lrUser1.signMakerOrder(maker);
    const taker = lrUser2.createTaker(maker, signers.user2.address);
    const contractMethods = lrUser2.executeOrder(maker, taker, signature);

    const estimatedGas = await contractMethods.estimateGas();
    expect(Number(estimatedGas)).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;
  });

  it("execute maker ask and taker bid with ETH", async () => {
    const { maker } = await lrUser1.createMakerAsk(baseMakerAskInput);
    const signature = await lrUser1.signMakerOrder(maker);
    const taker = lrUser2.createTaker(maker, signers.user2.address);
    const contractMethods = lrUser2.executeOrder(maker, taker, signature);

    const tx = await contractMethods.call();

    const receipt = await tx.wait();
    expect(receipt?.status).to.be.equal(1);
  });

  it("execute maker ask and taker bid with WETH", async () => {
    const { maker } = await lrUser1.createMakerAsk({ ...baseMakerAskInput, currency: mocks.addresses.WETH });
    const signature = await lrUser1.signMakerOrder(maker);
    const taker = lrUser2.createTaker(maker, signers.user2.address);
    const contractMethods = lrUser2.executeOrder(maker, taker, signature);

    const tx = await contractMethods.call();

    const receipt = await tx.wait();
    expect(receipt?.status).to.be.equal(1);
  });

  it("execute maker ask from a merkle tree signature and taker bid", async () => {
    const order1 = await lrUser1.createMakerAsk(baseMakerAskInput);
    const order2 = await lrUser1.createMakerAsk(baseMakerAskInput);
    const { signature, merkleTreeProofs } = await lrUser1.signMultipleMakerOrders([order1.maker, order2.maker]);
    const taker = lrUser2.createTaker(order1.maker, signers.user2.address);
    const contractMethods = lrUser2.executeOrder(order1.maker, taker, signature, merkleTreeProofs[0]);

    const tx = await contractMethods.call();

    const receipt = await tx.wait();
    expect(receipt?.status).to.be.equal(1);
  });
});
