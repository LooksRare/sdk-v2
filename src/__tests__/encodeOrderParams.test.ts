import { expect } from "chai";
import { getMakerParamsTypes, getTakerParamsTypes, encodeParams } from "../utils/encodeOrderParams";
import { StrategyType } from "../types";

describe("getMakerParamsTypes", () => {
  it("standard", () => {
    const paramsTypes = getMakerParamsTypes(StrategyType.standard);
    expect(paramsTypes).to.eql([]);
  });
  it("collection", () => {
    const paramsTypes = getMakerParamsTypes(StrategyType.collection);
    expect(paramsTypes).to.eql([]);
  });
  it("invalid param", () => {
    // Enforce a check with no params just for code coverage
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const paramsTypes = getMakerParamsTypes();
    expect(paramsTypes).to.eql([]);
  });
});

describe("getTakerParamsTypes", () => {
  it("standard", () => {
    const paramsTypes = getTakerParamsTypes(StrategyType.standard);
    expect(paramsTypes).to.eql([]);
  });
  it("collection", () => {
    const paramsTypes = getTakerParamsTypes(StrategyType.collection);
    expect(paramsTypes).to.eql(["uint256"]);
  });
  it("invalid param", () => {
    // Enforce a check with no params just for code coverage
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const paramsTypes = getTakerParamsTypes();
    expect(paramsTypes).to.eql([]);
  });
});

describe("encodeOrderParams", () => {
  it("standard", () => {
    const encodedParams = encodeParams([], getMakerParamsTypes(StrategyType.standard));
    expect(encodedParams).to.equal("0x");
  });
  it("collection", () => {
    const encodedParams = encodeParams([], getMakerParamsTypes(StrategyType.collection));
    expect(encodedParams).to.equal("0x");
  });
});
