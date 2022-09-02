import { expect } from "chai";
import { getStrategyParamsTypes, encodeStrategyParams } from "../utils/encodeOrderParams";

describe("getStrategyParamsTypes", () => {
  it("standard", () => {
    const paramsTypes = getStrategyParamsTypes("standard");
    expect(paramsTypes).to.eql([]);
  });
  it("collection", () => {
    const paramsTypes = getStrategyParamsTypes("collection");
    expect(paramsTypes).to.eql([]);
  });
});

describe("encodeOrderParams", () => {
  it("standard", () => {
    const encodedParams = encodeStrategyParams([], "standard");
    expect(encodedParams).to.equal("0x");
  });
  it("collection", () => {
    const encodedParams = encodeStrategyParams([], "collection");
    expect(encodedParams).to.equal("0x");
  });
});
