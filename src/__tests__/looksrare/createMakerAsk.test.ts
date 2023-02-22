import { expect } from "chai";
import { constants, utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { isApprovedForAll } from "../../utils/calls/tokens";
import { ErrorTimestamp } from "../../errors";
import { SupportedChainId, CollectionType, StrategyType, QuoteType, CreateMakerInput, Maker } from "../../types";

describe("Create maker ask", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let baseMakerAskInput: CreateMakerInput;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();

    baseMakerAskInput = {
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
  it("create maker ask with wrong time format", async () => {
    const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    await expect(
      looksrare.createMakerAsk({ ...baseMakerAskInput, startTime: Date.now() })
    ).to.eventually.be.rejectedWith(ErrorTimestamp);
    await expect(looksrare.createMakerAsk({ ...baseMakerAskInput, endTime: Date.now() })).to.eventually.be.rejectedWith(
      ErrorTimestamp
    );
  });
  it("returns approval function if no approval was made", async () => {
    const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const { approval } = await looksrare.createMakerAsk(baseMakerAskInput);
    expect(approval).to.not.be.undefined;

    await approval!();
    const isApproved = await isApprovedForAll(
      ethers.provider,
      baseMakerAskInput.collection,
      signers.user1.address,
      mocks.addresses.TRANSFER_MANAGER_V2
    );
    expect(isApproved).to.be.true;
  });
  it("returns undefined approval function if approval was made", async () => {
    const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const tx = await looksrare.approveAllCollectionItems(baseMakerAskInput.collection);
    await tx.wait();
    const output = await looksrare.createMakerAsk(baseMakerAskInput);
    expect(output.approval).to.be.undefined;
  });
  it("create a simple maker ask with default values", async () => {
    const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const output = await looksrare.createMakerAsk(baseMakerAskInput);
    const makerOrder: Maker = {
      quoteType: QuoteType.Ask,
      globalNonce: constants.Zero,
      subsetNonce: baseMakerAskInput.subsetNonce,
      strategyId: baseMakerAskInput.strategyId,
      collectionType: baseMakerAskInput.collectionType,
      orderNonce: baseMakerAskInput.orderNonce,
      collection: baseMakerAskInput.collection,
      currency: constants.AddressZero,
      signer: signers.user1.address,
      startTime: output.maker.startTime, // Can't really test the Date.now( executed inside the function)
      endTime: baseMakerAskInput.endTime,
      price: baseMakerAskInput.price,
      itemIds: baseMakerAskInput.itemIds,
      amounts: [1],
      additionalParameters: "0x",
    };
    expect(output.maker).to.eql(makerOrder);
  });
  it("create a simple maker ask with non default values", async () => {
    const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const input = {
      ...baseMakerAskInput,
      amounts: [1],
      currency: mocks.addresses.WETH,
      startTime: Math.floor(Date.now() / 1000),
      recipient: signers.user2.address,
      additionalParameters: [],
    };
    const output = await looksrare.createMakerAsk(input);
    const makerOrder: Maker = {
      quoteType: QuoteType.Ask,
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
