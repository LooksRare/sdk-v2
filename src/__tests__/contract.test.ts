import { expect } from "chai";
import { BigNumber } from "ethers";
import { setUpContracts, Mocks } from "./helpers/setup";

describe("E2E test", () => {
  let contracts: Mocks;
  beforeEach(async () => {
    contracts = await setUpContracts();
  });
  it("dummy", async () => {
    const { looksRareProtocol } = contracts;
    const information = await looksRareProtocol.information();
    expect(information.initialChainId).to.equal(BigNumber.from("31337"));
  });
});
