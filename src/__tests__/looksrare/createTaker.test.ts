import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import {
  SupportedChainId,
  AssetType,
  StrategyType,
  MakerAskInputs,
  MakerBidInputs,
  TakerBid,
  TakerAsk,
} from "../../types";

describe("Create takers", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });
  it("create taker bid", async () => {
    const baseMakerAskInput: MakerAskInputs = {
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
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
    const { order } = await looksrare.createMakerAsk(baseMakerAskInput);
    const takerBid = looksrare.createTakerBid(order, signers.user2.address);
    const expectedTakerBid: TakerBid = {
      recipient: signers.user2.address,
      itemIds: order.itemIds,
      amounts: order.amounts,
      maxPrice: order.minPrice,
      additionalParameters: "0x",
    };
    await expect(takerBid).to.be.eql(expectedTakerBid);
  });
  it("create taker ask", async () => {
    const baseMakerAskInput: MakerBidInputs = {
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
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
    const { order } = await looksrare.createMakerBid(baseMakerAskInput);
    const takerAsk = looksrare.createTakerAsk(order, signers.user2.address);
    const expectedTakerAsk: TakerAsk = {
      recipient: signers.user2.address,
      itemIds: order.itemIds,
      amounts: order.amounts,
      minPrice: order.maxPrice,
      additionalParameters: "0x",
    };
    await expect(takerAsk).to.be.eql(expectedTakerAsk);
  });
});
