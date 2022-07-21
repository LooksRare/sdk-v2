import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, Mocks } from "./helpers/setup";
import { information } from "../utils/looksRareProtocol";

describe("LooksRareProtocol", () => {
  let contracts: Mocks;
  beforeEach(async () => {
    contracts = await setUpContracts();
  });
  it("retrieve information ", async () => {
    const { looksRareProtocol } = contracts;
    const info = await information(looksRareProtocol.address, ethers.provider);
    expect(info[1]).to.equal(BigNumber.from("31337"));
  });
});
