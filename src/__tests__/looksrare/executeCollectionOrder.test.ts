import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { setApprovalForAll } from "../../utils/calls/tokens";
import { SupportedChainId, CollectionType, StrategyType, CreateMakerInput } from "../../types";

describe("execute collection order", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let baseMakerBidInput: CreateMakerInput;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();

    const tx = await mocks.contracts.transferManager
      .connect(signers.user1)
      .grantApprovals([mocks.addresses.EXCHANGE_V2]);
    await tx.wait();

    baseMakerBidInput = {
      collection: mocks.contracts.collectionERC721.address,
      collectionType: CollectionType.ERC721,
      strategyId: StrategyType.collection,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [1],
    };
  });
  it("execute collection order", async () => {
    const lrUser1 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const lrUser2 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user2, mocks.addresses);
    const { maker, approval } = await lrUser2.createMakerBid(baseMakerBidInput);
    await approval!();
    const signature = await lrUser2.signMakerOrder(maker);

    await setApprovalForAll(signers.user1, maker.collection, lrUser1.addresses.TRANSFER_MANAGER_V2);
    const taker = lrUser1.createTakerForCollectionOrder(maker, 0);

    const contractMethods = lrUser1.executeOrder(maker, taker, signature);

    const tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
});
