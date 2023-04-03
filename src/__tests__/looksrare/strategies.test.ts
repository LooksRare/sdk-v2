import { expect } from "chai";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { SupportedChainId, StrategyType } from "../../types";

describe("Strategies", () => {
  let mocks: SetupMocks;
  let signers: Signers;

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });

  it("fetch strategies info", async () => {
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const standardStrategy = await lr.strategyInfo(StrategyType.standard);
    expect(standardStrategy).to.not.be.undefined;
    expect(standardStrategy.isActive).to.be.true;

    const collectionStrategy = await lr.strategyInfo(StrategyType.collection);
    expect(collectionStrategy).to.not.be.undefined;
    expect(collectionStrategy.isActive).to.be.true;
  });
});
