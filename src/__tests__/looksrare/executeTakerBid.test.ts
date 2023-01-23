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

    const tx = await mocks.contracts.transferManager
      .connect(signers.user1)
      .grantApprovals([mocks.addresses.EXCHANGE_V2]);
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
    const lrUser1 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const lrUser2 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user2, mocks.addresses);
    const { makerAsk, approval } = await lrUser1.createMakerAsk(baseMakerAskInput);
    await approval!();
    const signature = await lrUser1.signMakerAsk(makerAsk);
    const takerBid = lrUser2.createTakerBid(makerAsk, signers.user2.address);

    const contractMethods = await lrUser2.executeTakerBid(makerAsk, takerBid, signature);

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.not.be.rejected;

    const tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
  it.skip("execute maker ask from a merkle tree signature and taker bid", async () => {
    const lrUser1 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const lrUser2 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user2, mocks.addresses);
    const order1 = await lrUser1.createMakerAsk(baseMakerAskInput);
    const order2 = await lrUser1.createMakerAsk(baseMakerAskInput);
    const tree = await lrUser2.createMakerMerkleTree([order1.makerAsk, order2.makerAsk]);
    const signature = await lrUser2.signMultipleMakers(tree.root);

    await order1.approval!();

    const takerBid = lrUser2.createTakerBid(order1.makerAsk, signers.user2.address);

    const estimatedGas = await lrUser2.executeTakerBid(order1.makerAsk, takerBid, signature, tree).estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    const tx = await lrUser2.executeTakerBid(order1.makerAsk, takerBid, signature, tree).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
});
