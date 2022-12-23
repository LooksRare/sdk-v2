import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { SupportedChainId, AssetType, StrategyType, MakerAskInputs } from "../../types";

describe("execute taker bid", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let baseMakerAskInput: MakerAskInputs;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();

    const tx = await mocks.contracts.transferManager.connect(signers.user1).grantApprovals([mocks.addresses.EXCHANGE]);
    await tx.wait();

    baseMakerAskInput = {
      collection: mocks.contracts.collection1.address,
      assetType: AssetType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [1],
    };
  });
  it("execute maker ask and taker bid", async () => {
    const lrUser1 = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
    const lrUser2 = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user2, mocks.addresses);
    const { order, action } = await lrUser1.createMakerAsk(baseMakerAskInput);
    await action!();
    const signature = await lrUser1.signMakerAsk(order);
    const takerBid = lrUser2.createTakerBid(order, signers.user2.address);

    const estimatedGas = await lrUser2.executeTakerBid(order, takerBid, signature).estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    const tx = await lrUser2.executeTakerBid(order, takerBid, signature).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
  it.skip("execute maker ask from a merkle tree signature and taker bid", async () => {
    const lrUser1 = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
    const lrUser2 = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user2, mocks.addresses);
    const maker1 = await lrUser1.createMakerAsk(baseMakerAskInput);
    const maker2 = await lrUser1.createMakerAsk(baseMakerAskInput);
    const tree = await lrUser2.createMakerMerkleTree([maker1.order, maker2.order]);
    const signature = await lrUser2.signMultipleMakers(tree.root);

    await maker1.action!();
    await maker2.action!();

    const takerBid = lrUser2.createTakerBid(maker1.order, signers.user2.address);

    const estimatedGas = await lrUser2.executeTakerBid(maker1.order, takerBid, signature, tree).estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    const tx = await lrUser2.executeTakerBid(maker1.order, takerBid, signature, tree).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
});
