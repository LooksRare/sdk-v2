import { expect } from "chai";
import { constants, utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, Mocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { Addresses } from "../../constants/addresses";
import { isApprovedForAll, setApprovalForAll } from "../../utils/calls/tokens";
import { SupportedChainId, AssetType, StrategyType, MakerAskInputs, MakerAsk } from "../../types";

describe("Create maker ask", () => {
  let contracts: Mocks;
  let signers: Signers;
  let baseMakerAskInput: MakerAskInputs;
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
    baseMakerAskInput = {
      collection: contracts.collection1.address,
      assetType: AssetType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      // startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [1],
    };
  });
  it("create maker ask with wrong time format", async () => {
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    await expect(looksrare.createMakerAsk({ ...baseMakerAskInput, startTime: Date.now() })).to.eventually.be.rejected;
    await expect(looksrare.createMakerAsk({ ...baseMakerAskInput, endTime: Date.now() })).to.eventually.be.rejected;
  });
  it("returns action function if no approval was made", async () => {
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const { action } = await looksrare.createMakerAsk(baseMakerAskInput);
    expect(action).to.not.be.undefined;

    await action!();
    const isApproved = await isApprovedForAll(
      ethers.provider,
      baseMakerAskInput.collection,
      signers.user1.address,
      contracts.transferManager.address
    );
    expect(isApproved).to.be.true;
  });
  it("returns undefined action function if approval was made", async () => {
    await setApprovalForAll(signers.user1, baseMakerAskInput.collection, contracts.transferManager.address);
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const output = await looksrare.createMakerAsk(baseMakerAskInput);
    expect(output.action).to.be.undefined;
  });
  it("create a simple maker ask with default values", async () => {
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const output = await looksrare.createMakerAsk(baseMakerAskInput);
    const makerOrder: MakerAsk = {
      askNonce: constants.Zero,
      subsetNonce: baseMakerAskInput.subsetNonce,
      strategyId: baseMakerAskInput.strategyId,
      assetType: baseMakerAskInput.assetType,
      orderNonce: baseMakerAskInput.orderNonce,
      collection: baseMakerAskInput.collection,
      currency: constants.AddressZero,
      signer: signers.user1.address,
      startTime: output.order.startTime, // Can't really test the Date.now( executed inside the function)
      endTime: baseMakerAskInput.endTime,
      minPrice: baseMakerAskInput.price,
      itemIds: baseMakerAskInput.itemIds,
      amounts: [1],
      additionalParameters: "0x",
    };
    expect(output.order).to.eql(makerOrder);
  });
  it("create a simple maker ask with non default values", async () => {
    const looksrare = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const input = {
      ...baseMakerAskInput,
      amounts: [1],
      currency: addresses.WETH,
      startTime: Math.floor(Date.now() / 1000),
      recipient: signers.user2.address,
      additionalParameters: [],
    };
    const output = await looksrare.createMakerAsk(input);
    const makerOrder: MakerAsk = {
      askNonce: constants.Zero,
      subsetNonce: input.subsetNonce,
      strategyId: input.strategyId,
      assetType: input.assetType,
      orderNonce: input.orderNonce,
      collection: input.collection,
      currency: input.currency!,
      signer: signers.user1.address,
      startTime: input.startTime!,
      endTime: input.endTime,
      minPrice: input.price,
      itemIds: input.itemIds,
      amounts: input.amounts!,
      additionalParameters: "0x",
    };
    expect(output.order).to.eql(makerOrder);
  });
});
