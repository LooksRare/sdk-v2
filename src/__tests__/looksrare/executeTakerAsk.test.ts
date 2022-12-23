import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { setApprovalForAll } from "../../utils/calls/tokens";
import { SupportedChainId, AssetType, StrategyType, MakerAskInputs } from "../../types";

describe("execute taker ask", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let baseMakerAskInput: MakerAskInputs;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();

    {
      const tx = await mocks.contracts.weth.mint(signers.user2.address, utils.parseEther("10"));
      await tx.wait();
    }

    {
      const tx = await mocks.contracts.transferManager
        .connect(signers.user1)
        .grantApprovals([mocks.addresses.EXCHANGE]);
      await tx.wait();
    }

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
  it("execute maker bid and taker ask", async () => {
    const lrUser1 = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
    const lrUser2 = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user2, mocks.addresses);
    const { order, action } = await lrUser2.createMakerBid(baseMakerAskInput);
    await action!();
    const signature = await lrUser2.signMakerBid(order);
    await setApprovalForAll(signers.user1, order.collection, lrUser1.addresses.TRANSFER_MANAGER);
    const takerBid = lrUser1.createTakerAsk(order, signers.user2.address);

    const estimatedGas = await lrUser1.executeTakerAsk(order, takerBid, signature).estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    const tx = await lrUser1.executeTakerAsk(order, takerBid, signature).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
  it.skip("execute maker bid from a merkle tree signature, and taker ask", async () => {
    const lrUser1 = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
    const lrUser2 = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user2, mocks.addresses);
    const maker1 = await lrUser2.createMakerBid(baseMakerAskInput);
    const maker2 = await lrUser2.createMakerBid(baseMakerAskInput);
    const tree = await lrUser2.createMakerMerkleTree([maker1.order, maker2.order]);
    const signature = await lrUser2.signMultipleMakers(tree.root);

    await maker1.action!();
    await maker2.action!();

    await setApprovalForAll(signers.user1, maker1.order.collection, lrUser1.addresses.TRANSFER_MANAGER);
    const takerBid = lrUser1.createTakerAsk(maker1.order, signers.user2.address);

    const estimatedGas = await lrUser1.executeTakerAsk(maker1.order, takerBid, signature, tree).estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    const tx = await lrUser1.executeTakerAsk(maker1.order, takerBid, signature, tree).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
});
