import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { setApprovalForAll } from "../../utils/calls/tokens";
import { SupportedChainId, CollectionType, StrategyType, CreateMakerInput } from "../../types";

describe("execute taker ask", () => {
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
      itemIds: [1],
    };
  });
  it("execute maker bid and taker ask", async () => {
    const lrUser1 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const lrUser2 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user2, mocks.addresses);
    const { maker, approval } = await lrUser2.createMakerBid(baseMakerAskInput);
    await approval!();
    const signature = await lrUser2.signMakerOrder(maker);
    await setApprovalForAll(signers.user1, maker.collection, lrUser1.addresses.TRANSFER_MANAGER_V2);
    const taker = lrUser1.createTaker(maker, signers.user2.address);

    const contractMethods = lrUser1.executeOrder(maker, taker, signature);

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;

    const tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
  it("execute maker bid from a merkle tree signature, and taker ask", async () => {
    const lrUser1 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const lrUser2 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user2, mocks.addresses);
    const order1 = await lrUser2.createMakerBid(baseMakerAskInput);
    const order2 = await lrUser2.createMakerBid(baseMakerAskInput);
    const { signature, merkleTreeProofs } = await lrUser2.signMultipleMakerOrders([order1.maker, order2.maker]);

    await order1.approval!();

    await setApprovalForAll(signers.user1, order1.maker.collection, lrUser1.addresses.TRANSFER_MANAGER_V2);
    const taker = lrUser1.createTaker(order1.maker, signers.user2.address);

    const { estimateGas, call } = lrUser1.executeOrder(order1.maker, taker, signature, merkleTreeProofs[0]);

    const estimatedGas = await estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    const tx = await call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
});
