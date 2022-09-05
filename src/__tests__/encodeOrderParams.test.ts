import { expect } from "chai";
import { getStrategyParamsTypes, encodeStrategyParams } from "../utils/encodeOrderParams";
import { StrategyType } from "../types";

describe("getStrategyParamsTypes", () => {
  it("standard", () => {
    const paramsTypes = getStrategyParamsTypes(StrategyType.standard);
    expect(paramsTypes).to.eql([]);
  });
  it("collection", () => {
    const paramsTypes = getStrategyParamsTypes(StrategyType.collection);
    expect(paramsTypes).to.eql([]);
  });
});

describe("encodeOrderParams", () => {
  it("standard", () => {
    const encodedParams = encodeStrategyParams([], StrategyType.standard);
    expect(encodedParams).to.equal("0x");
  });
  it("collection", () => {
    const encodedParams = encodeStrategyParams([], StrategyType.collection);
    expect(encodedParams).to.equal("0x");
  });
});
