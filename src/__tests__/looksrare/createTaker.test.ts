import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { SupportedChainId, AssetType, StrategyType, MakerAskInputs, Taker } from "../../types";

describe("Create takers", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });
  it("create taker", async () => {
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
    const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const { makerAsk } = await looksrare.createMakerAsk(baseMakerAskInput);
    const taker = looksrare.createTaker(makerAsk, signers.user2.address);
    const expectedTaker: Taker = {
      recipient: signers.user2.address,
      additionalParameters: "0x",
    };
    await expect(taker).to.be.eql(expectedTaker);
  });
});
