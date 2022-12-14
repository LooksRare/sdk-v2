import { expect } from "chai";
import { constants, utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, Mocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { Addresses } from "../../constants/addresses";
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
  let contracts: Mocks;
  let signers: Signers;
  let addresses: Addresses;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
    addresses = {
      EXCHANGE: contracts.looksRareProtocol.address,
      LOOKS: constants.AddressZero,
      TRANSFER_MANAGER: contracts.transferManager.address,
      WETH: contracts.weth.address,
    };
  });
  it("create taker bid", async () => {
    const baseMakerAskInput: MakerAskInputs = {
      collection: contracts.collection1.address,
      assetType: AssetType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [1],
    };
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
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
      collection: contracts.collection1.address,
      assetType: AssetType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [1],
    };
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
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
