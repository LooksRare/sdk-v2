import { expect } from "chai";
import { setUpContracts, Mocks } from "./helpers/setup";

describe("E2E test", () => {
  let contracts: Mocks;
  beforeEach(async () => {
    contracts = await setUpContracts();
  });
  it("dummy", async () => {
    const { greeter } = contracts;
    const greeting = await greeter.greet();
    expect(greeting).to.equal("Hello");
  });
});
