import { expect } from "chai";
import { constants, utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, Mocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { Addresses } from "../../constants/addresses";
import { allowance, approve } from "../../utils/calls/tokens";
import { SupportedChainId, AssetType, StrategyType, MakerBidInputs, MakerBid } from "../../types";

describe("Create maker bid", () => {
  let contracts: Mocks;
  let signers: Signers;
  let baseMakerInput: MakerBidInputs;
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
    baseMakerInput = {
      collection: contracts.collection1.address,
      assetType: AssetType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [1],
    };
  });
  it("create maker bid with wrong time format", async () => {
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    await expect(looksrare.createMakerBid({ ...baseMakerInput, startTime: Date.now() })).to.eventually.be.rejected;
    await expect(looksrare.createMakerBid({ ...baseMakerInput, endTime: Date.now() })).to.eventually.be.rejected;
  });
  it("returns action function if no approval was made", async () => {
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const { action } = await looksrare.createMakerBid(baseMakerInput);
    expect(action).to.not.be.undefined;

    await action!();
    const valueApproved = await allowance(
      ethers.provider,
      contracts.weth.address,
      signers.user1.address,
      contracts.looksRareProtocol.address
    );
    expect(valueApproved.eq(constants.MaxUint256)).to.be.true;
  });
  it("returns undefined action function if approval was made", async () => {
    await approve(signers.user1, contracts.weth.address, contracts.looksRareProtocol.address);
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const output = await looksrare.createMakerBid(baseMakerInput);
    expect(output.action).to.be.undefined;
  });
  it("create a simple maker bid with default values", async () => {
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const output = await looksrare.createMakerBid(baseMakerInput);
    const makerOrder: MakerBid = {
      bidNonce: constants.Zero,
      subsetNonce: baseMakerInput.subsetNonce,
      strategyId: baseMakerInput.strategyId,
      assetType: baseMakerInput.assetType,
      orderNonce: baseMakerInput.orderNonce,
      collection: baseMakerInput.collection,
      currency: contracts.weth.address,
      signer: signers.user1.address,
      startTime: output.order.startTime, // Can't really test the Date.now( executed inside the function)
      endTime: baseMakerInput.endTime,
      maxPrice: baseMakerInput.price,
      itemIds: baseMakerInput.itemIds,
      amounts: [1],
      additionalParameters: "0x",
    };
    expect(output.order).to.eql(makerOrder);
  });
  it("create a simple maker bid with non default values", async () => {
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const input = {
      ...baseMakerInput,
      amounts: [1],
      currency: contracts.weth.address,
      startTime: Math.floor(Date.now() / 1000),
      recipient: signers.user2.address,
      additionalParameters: [],
    };
    const output = await looksrare.createMakerBid(input);
    const makerOrder: MakerBid = {
      bidNonce: constants.Zero,
      subsetNonce: input.subsetNonce,
      strategyId: input.strategyId,
      assetType: input.assetType,
      orderNonce: input.orderNonce,
      collection: input.collection,
      currency: input.currency!,
      signer: signers.user1.address,
      startTime: input.startTime!,
      endTime: input.endTime,
      maxPrice: input.price,
      itemIds: input.itemIds,
      amounts: input.amounts!,
      additionalParameters: "0x",
    };
    expect(output.order).to.eql(makerOrder);
  });
});
