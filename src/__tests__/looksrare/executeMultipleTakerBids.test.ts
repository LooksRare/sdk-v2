import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { ownerOf } from "../helpers/tokens";
import { ErrorQuoteType } from "../../errors";
import { LooksRare } from "../../LooksRare";
import { ChainId, CollectionType, StrategyType, QuoteType, CreateMakerInput, Maker } from "../../types";

describe("execute multiple taker bids", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let lrUser1: LooksRare;
  let lrUser2: LooksRare;
  let makers: Maker[] = [];

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
    lrUser1 = new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    lrUser2 = new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user2, mocks.addresses);

    const baseMakerAskInput: CreateMakerInput = {
      collection: mocks.contracts.collectionERC721.address,
      collectionType: CollectionType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: parseEther("1"),
      itemIds: [0],
    };

    let tx = await lrUser1.grantTransferManagerApproval().call();
    await tx.wait();

    tx = await lrUser1.approveAllCollectionItems(baseMakerAskInput.collection);
    await tx.wait();

    tx = await lrUser2.approveErc20(mocks.addresses.WETH);
    await tx.wait();

    const { maker: maker1 } = await lrUser1.createMakerAsk(baseMakerAskInput);
    const { maker: maker2 } = await lrUser1.createMakerAsk({ ...baseMakerAskInput, itemIds: [1], orderNonce: 1 });
    makers = [maker1, maker2];
  });

  it("execute estimatedGas and callStatic", async () => {
    const taker1 = lrUser2.createTaker(makers[0], signers.user2.address);
    const taker2 = lrUser2.createTaker(makers[1], signers.user2.address);
    const signature1 = await lrUser1.signMakerOrder(makers[0]);
    const signature2 = await lrUser1.signMakerOrder(makers[1]);

    const orders = [
      { maker: makers[0], taker: taker1, signature: signature1 },
      { maker: makers[1], taker: taker2, signature: signature2 },
    ];
    const contractMethods = lrUser2.executeMultipleOrders(orders, true);

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);
    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;
  });

  it("execute multiple taker bid atomically", async () => {
    const taker1 = lrUser2.createTaker(makers[0], signers.user2.address);
    const taker2 = lrUser2.createTaker(makers[1], signers.user2.address);
    const signature1 = await lrUser1.signMakerOrder(makers[0]);
    const signature2 = await lrUser1.signMakerOrder(makers[1]);

    const orders = [
      { maker: makers[0], taker: taker1, signature: signature1 },
      { maker: makers[1], taker: taker2, signature: signature2 },
    ];
    const user1InitialBalance = await signers.user1.getBalance();
    const contractMethods = lrUser2.executeMultipleOrders(orders, true);

    const receipt = await (await contractMethods.call()).wait();
    expect(receipt.status).to.be.equal(1);

    const owner = await ownerOf(signers.user2, makers[0].collection, makers[0].itemIds[0]);
    expect(owner).to.be.equal(signers.user2.address);

    const user1UpdatedBalance = await signers.user1.getBalance();
    expect(user1UpdatedBalance.gt(user1InitialBalance)).to.be.true;
  });

  it("execute multiple taker bid non atomically", async () => {
    const taker1 = lrUser2.createTaker(makers[0], signers.user2.address);
    const taker2 = lrUser2.createTaker(makers[1], signers.user2.address);
    const signature1 = await lrUser1.signMakerOrder(makers[0]);
    const signature2 = await lrUser1.signMakerOrder(makers[1]);

    const orders = [
      { maker: makers[0], taker: taker1, signature: signature1 },
      { maker: makers[1], taker: taker2, signature: signature2 },
    ];
    const user1InitialBalance = await signers.user1.getBalance();
    const contractMethods = lrUser2.executeMultipleOrders(orders, false);

    const receipt = await (await contractMethods.call()).wait();
    expect(receipt.status).to.be.equal(1);

    const owner = await ownerOf(signers.user2, makers[0].collection, makers[0].itemIds[0]);
    expect(owner).to.be.equal(signers.user2.address);

    const user1UpdatedBalance = await signers.user1.getBalance();
    expect(user1UpdatedBalance.gt(user1InitialBalance)).to.be.true;
  });

  it("execute multiple taker bid with a merkle tree", async () => {
    const taker1 = lrUser2.createTaker(makers[0], signers.user2.address);
    const taker2 = lrUser2.createTaker(makers[1], signers.user2.address);
    const { signature, merkleTreeProofs } = await lrUser1.signMultipleMakerOrders(makers);

    const orders = [
      { maker: makers[0], taker: taker1, signature: signature, merkleTree: merkleTreeProofs[0] },
      { maker: makers[1], taker: taker2, signature: signature, merkleTree: merkleTreeProofs[1] },
    ];
    const user1InitialBalance = await signers.user1.getBalance();
    const contractMethods = lrUser2.executeMultipleOrders(orders, true);

    const receipt = await (await contractMethods.call()).wait();
    expect(receipt.status).to.be.equal(1);

    const owner = await ownerOf(signers.user2, makers[0].collection, makers[0].itemIds[0]);
    expect(owner).to.be.equal(signers.user2.address);

    const user1UpdatedBalance = await signers.user1.getBalance();
    expect(user1UpdatedBalance.gt(user1InitialBalance)).to.be.true;
  });

  it("throw when the quote type is incorrect", async () => {
    const taker1 = lrUser2.createTaker(makers[0], signers.user2.address);
    const taker2 = lrUser2.createTaker(makers[1], signers.user2.address);
    const signature1 = await lrUser1.signMakerOrder(makers[0]);
    const signature2 = await lrUser1.signMakerOrder(makers[1]);

    const orders = [
      { maker: makers[0], taker: taker1, signature: signature1 },
      { maker: { ...makers[1], quoteType: QuoteType.Bid }, taker: taker2, signature: signature2 },
    ];

    const callback = () => lrUser2.executeMultipleOrders(orders, true);
    expect(callback).to.throw(ErrorQuoteType);
  });
});
