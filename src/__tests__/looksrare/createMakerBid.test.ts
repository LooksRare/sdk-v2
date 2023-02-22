import { expect } from "chai";
import { constants, utils, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { allowance } from "../../utils/calls/tokens";
import { ErrorTimestamp } from "../../errors";
import { SupportedChainId, CollectionType, StrategyType, QuoteType, CreateMakerInput, Maker } from "../../types";

describe("Create maker bid", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let baseMakerInput: CreateMakerInput;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
    baseMakerInput = {
      collection: mocks.contracts.collectionERC721.address,
      collectionType: CollectionType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [1],
    };
  });
  it("create maker bid with wrong time format", async () => {
    const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    await expect(looksrare.createMakerBid({ ...baseMakerInput, startTime: Date.now() })).to.eventually.be.rejectedWith(
      ErrorTimestamp
    );
    await expect(looksrare.createMakerBid({ ...baseMakerInput, endTime: Date.now() })).to.eventually.be.rejectedWith(
      ErrorTimestamp
    );
  });
  it("approvals checks are false if no approval was made", async () => {
    const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const { isCurrencyApproved } = await looksrare.createMakerBid(baseMakerInput);

    expect(isCurrencyApproved).to.be.false;

    await looksrare.approveErc20(looksrare.addresses.WETH);
    const valueApproved = await allowance(
      ethers.provider,
      mocks.addresses.WETH,
      signers.user1.address,
      mocks.addresses.EXCHANGE_V2
    );
    expect(valueApproved.eq(constants.MaxUint256)).to.be.true;
  });
  it("approval checks are true if approval were made", async () => {
    const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const tx = await looksrare.approveErc20(looksrare.addresses.WETH);
    await tx.wait();
    const { isCurrencyApproved } = await looksrare.createMakerBid(baseMakerInput);
    expect(isCurrencyApproved).to.be.true;
  });
  it("create a simple maker bid with default values", async () => {
    const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const output = await looksrare.createMakerBid(baseMakerInput);
    const makerOrder: Maker = {
      quoteType: QuoteType.Bid,
      globalNonce: constants.Zero,
      subsetNonce: baseMakerInput.subsetNonce,
      strategyId: baseMakerInput.strategyId,
      collectionType: baseMakerInput.collectionType,
      orderNonce: baseMakerInput.orderNonce,
      collection: baseMakerInput.collection,
      currency: mocks.addresses.WETH,
      signer: signers.user1.address,
      startTime: output.maker.startTime, // Can't really test the Date.now( executed inside the function)
      endTime: baseMakerInput.endTime,
      price: baseMakerInput.price,
      itemIds: baseMakerInput.itemIds,
      amounts: [1],
      additionalParameters: "0x",
    };
    expect(output.maker).to.eql(makerOrder);
  });
  it("create a simple maker bid with non default values", async () => {
    const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const input = {
      ...baseMakerInput,
      amounts: [1],
      currency: mocks.addresses.WETH,
      startTime: Math.floor(Date.now() / 1000),
      recipient: signers.user2.address,
      additionalParameters: [],
    };
    const output = await looksrare.createMakerBid(input);
    const makerOrder: Maker = {
      quoteType: QuoteType.Bid,
      globalNonce: constants.Zero,
      subsetNonce: input.subsetNonce,
      strategyId: input.strategyId,
      collectionType: input.collectionType,
      orderNonce: input.orderNonce,
      collection: input.collection,
      currency: input.currency!,
      signer: signers.user1.address,
      startTime: input.startTime!,
      endTime: input.endTime,
      price: input.price,
      itemIds: input.itemIds,
      amounts: input.amounts!,
      additionalParameters: "0x",
    };
    expect(output.maker).to.eql(makerOrder);
  });
});
