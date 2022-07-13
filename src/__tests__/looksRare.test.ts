import { expect } from "chai";
import { LooksRare } from "../LooksRare";
import { SupportedChainId } from "../types";

describe("LooksRare class", () => {
  it("instanciate LooksRare with the correct chain id", () => {
    expect(new LooksRare(1).chainId).to.equal(1);
    expect(new LooksRare(SupportedChainId.RINKEBY).chainId).to.equal(SupportedChainId.RINKEBY);
  });
});
