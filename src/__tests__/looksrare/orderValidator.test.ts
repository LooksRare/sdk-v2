import { expect } from "chai";
import { utils, constants } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import {
  SupportedChainId,
  AssetType,
  StrategyType,
  MakerAskInputs,
  MakerBidInputs,
  OrderValidatorCode,
} from "../../types";

const defaultMerkleRoot = { root: constants.HashZero, proof: [] };

describe("Order validation", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();

    const tx = await mocks.contracts.transferManager
      .connect(signers.user1)
      .grantApprovals([mocks.addresses.EXCHANGE_V2]);
    await tx.wait();
  });
  it("verify maker ask orders", async () => {
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
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const { makerAsk, approval } = await lr.createMakerAsk(baseMakerAskInput);
    const signature = await lr.signMakerAsk(makerAsk);

    let orders = await lr.verifyMakerAskOrders([makerAsk], [signature], [defaultMerkleRoot]);
    expect(orders[0].some((code) => code === OrderValidatorCode.ERC721_NO_APPROVAL_FOR_ALL_OR_ITEM_ID)).to.be.true;

    await approval!();

    orders = await lr.verifyMakerAskOrders([makerAsk], [signature], [defaultMerkleRoot]);
    expect(orders[0].every((code) => code === OrderValidatorCode.ORDER_EXPECTED_TO_BE_VALID)).to.be.true;
  });
  it("verify maker bid orders", async () => {
    const baseMakerBidInput: MakerBidInputs = {
      collection: mocks.contracts.collection1.address,
      assetType: AssetType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [1],
    };

    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const { makerBid, approval } = await lr.createMakerBid(baseMakerBidInput);
    const signature = await lr.signMakerBid(makerBid);

    let orders = await lr.verifyMakerBidOrders([makerBid], [signature], [defaultMerkleRoot]);
    expect(orders[0].some((code) => code === OrderValidatorCode.ERC20_BALANCE_INFERIOR_TO_PRICE)).to.be.true;

    const tx = await mocks.contracts.weth.mint(signers.user1.address, utils.parseEther("10"));
    await tx.wait();

    orders = await lr.verifyMakerBidOrders([makerBid], [signature], [defaultMerkleRoot]);
    expect(orders[0].some((code) => code === OrderValidatorCode.ERC20_APPROVAL_INFERIOR_TO_PRICE)).to.be.true;

    await approval!();

    orders = await lr.verifyMakerBidOrders([makerBid], [signature], [defaultMerkleRoot]);
    expect(orders[0].every((code) => code === OrderValidatorCode.ORDER_EXPECTED_TO_BE_VALID)).to.be.true;
  });
});
