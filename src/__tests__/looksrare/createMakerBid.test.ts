import { expect } from "chai";
import { MaxUint256, parseEther } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { allowance } from "../../utils/calls/tokens";
import { ErrorTimestamp } from "../../errors";
import { ChainId, CollectionType, StrategyType, QuoteType, CreateMakerInput, Maker } from "../../types";

describe("Create maker bid", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let lrUser1: LooksRare;
  let baseMakerInput: CreateMakerInput;

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();

    lrUser1 = new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);

    baseMakerInput = {
      collection: mocks.addresses.MOCK_COLLECTION_ERC721,
      collectionType: CollectionType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: parseEther("1"),
      itemIds: [1],
    };
  });

  it("throws an error when creating maker bid with wrong time format", async () => {
    await expect(lrUser1.createMakerBid({ ...baseMakerInput, startTime: Date.now() })).to.eventually.be.rejectedWith(
      ErrorTimestamp
    );
    await expect(lrUser1.createMakerBid({ ...baseMakerInput, endTime: Date.now() })).to.eventually.be.rejectedWith(
      ErrorTimestamp
    );
  });

  it("approvals checks are false if no approval was made", async () => {
    const { isCurrencyApproved } = await lrUser1.createMakerBid(baseMakerInput);
    expect(isCurrencyApproved).to.be.false;

    await lrUser1.approveErc20(mocks.addresses.WETH);
    const valueApproved = await allowance(
      ethers.provider,
      mocks.addresses.WETH,
      signers.user1.address,
      mocks.addresses.EXCHANGE_V2
    );
    expect(valueApproved).to.be.eq(MaxUint256);
  });

  it("approval checks are true if approval were made", async () => {
    const tx = await lrUser1.approveErc20(mocks.addresses.WETH);
    await tx.wait();
    const { isCurrencyApproved } = await lrUser1.createMakerBid(baseMakerInput);
    expect(isCurrencyApproved).to.be.true;
  });

  it("balance checks are false if balance is not sufficient", async () => {
    const { isBalanceSufficient } = await lrUser1.createMakerBid({
      ...baseMakerInput,
      price: parseEther("100000"),
    });
    expect(isBalanceSufficient).to.be.false;
  });

  it("balance checks are true if balance is sufficient", async () => {
    const { isBalanceSufficient } = await lrUser1.createMakerBid(baseMakerInput);
    expect(isBalanceSufficient).to.be.true;
  });

  it("create a simple maker bid with default values", async () => {
    const output = await lrUser1.createMakerBid(baseMakerInput);
    const makerOrder: Maker = {
      quoteType: QuoteType.Bid,
      globalNonce: 0n,
      subsetNonce: baseMakerInput.subsetNonce,
      strategyId: baseMakerInput.strategyId,
      collectionType: baseMakerInput.collectionType,
      orderNonce: baseMakerInput.orderNonce,
      collection: baseMakerInput.collection,
      currency: mocks.addresses.WETH,
      signer: signers.user1.address,
      startTime: output.maker.startTime, // Can't really test the Date.now (executed inside the function)
      endTime: baseMakerInput.endTime,
      price: baseMakerInput.price,
      itemIds: baseMakerInput.itemIds,
      amounts: [1],
      additionalParameters: "0x",
    };
    expect(output.maker).to.eql(makerOrder);
  });

  it("create a simple maker bid with non default values", async () => {
    const input = {
      ...baseMakerInput,
      amounts: [1],
      currency: mocks.addresses.WETH,
      startTime: Math.floor(Date.now() / 1000),
      recipient: signers.user2.address,
      additionalParameters: [],
    };
    const output = await lrUser1.createMakerBid(input);
    const makerOrder: Maker = {
      quoteType: QuoteType.Bid,
      globalNonce: 0n,
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
