import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { SupportedChainId, CollectionType, StrategyType, CreateMakerInput, OrderValidatorCode } from "../../types";

describe("Order validation", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let baseMakerAskInput: CreateMakerInput;
  let baseMakerBidInput: CreateMakerInput;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();

    baseMakerAskInput = {
      collection: mocks.contracts.collectionERC721.address,
      collectionType: CollectionType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [1],
    };

    baseMakerBidInput = {
      collection: mocks.contracts.collectionERC721.address,
      collectionType: CollectionType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [1],
    };

    const tx = await mocks.contracts.transferManager
      .connect(signers.user1)
      .grantApprovals([mocks.addresses.EXCHANGE_V2]);
    await tx.wait();
  });
  it("verify maker ask orders", async () => {
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const { maker } = await lr.createMakerAsk(baseMakerAskInput);
    const signature = await lr.signMakerOrder(maker);

    let orders = await lr.verifyMakerOrders([maker], [signature]);
    expect(orders[0].some((code) => code === OrderValidatorCode.ERC721_NO_APPROVAL_FOR_ALL_OR_ITEM_ID)).to.be.true;

    const tx = await lr.approveAllCollectionItems(baseMakerAskInput.collection);
    await tx.wait();

    orders = await lr.verifyMakerOrders([maker], [signature]);
    expect(orders[0].every((code) => code === OrderValidatorCode.ORDER_EXPECTED_TO_BE_VALID)).to.be.true;
  });
  it("verify maker bid orders", async () => {
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const { maker } = await lr.createMakerBid(baseMakerBidInput);
    const signature = await lr.signMakerOrder(maker);

    let orders = await lr.verifyMakerOrders([maker], [signature]);

    orders = await lr.verifyMakerOrders([maker], [signature]);
    expect(orders[0].some((code) => code === OrderValidatorCode.ERC20_APPROVAL_INFERIOR_TO_PRICE)).to.be.true;

    const tx = await lr.approveErc20(lr.addresses.WETH);
    await tx.wait();

    orders = await lr.verifyMakerOrders([maker], [signature]);
    expect(orders[0].every((code) => code === OrderValidatorCode.ORDER_EXPECTED_TO_BE_VALID)).to.be.true;
  });
  it("verify multiple maker orders with a Merkle tree", async () => {
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const { maker: makerBid } = await lr.createMakerBid(baseMakerBidInput);
    const { maker: makerAsk } = await lr.createMakerAsk(baseMakerAskInput);
    const { signature, merkleTreeProofs } = await lr.signMultipleMakerOrders([makerBid, makerAsk]);

    let tx = await lr.approveAllCollectionItems(baseMakerAskInput.collection);
    await tx.wait();
    tx = await lr.approveErc20(lr.addresses.WETH);
    await tx.wait();

    const orders = await lr.verifyMakerOrders(
      [makerBid, makerAsk],
      [signature, signature],
      [merkleTreeProofs[0], merkleTreeProofs[1]]
    );

    expect(orders[0].every((code) => code === OrderValidatorCode.ORDER_EXPECTED_TO_BE_VALID)).to.be.true;
    expect(orders[1].every((code) => code === OrderValidatorCode.ORDER_EXPECTED_TO_BE_VALID)).to.be.true;
  });
});
