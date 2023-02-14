import { expect } from "chai";
import { utils } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { setUpContracts, SetupMocks, getSigners, Signers } from "./helpers/setup";
import { contractName, version, makerTypes } from "../constants/eip712";
import { signMakerOrder } from "../utils/signMakerOrders";
import { encodeParams, getMakerParamsTypes, getTakerParamsTypes } from "../utils/encodeOrderParams";
import { SupportedChainId, Maker, CollectionType, StrategyType, QuoteType } from "../types";

const faultySignature =
  "0xcafe829116da9a4b31a958aa790682228b85e5d03b1ae7bb15f8ce4c8432a20813934991833da8e913894c9f35f1f018948c58d68fb61bbca0e07bd43c4492fa2b";

describe("SignMakerOrders", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let domain: TypedDataDomain;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
    domain = {
      name: contractName,
      version: version.toString(),
      chainId: SupportedChainId.HARDHAT,
      verifyingContract: mocks.addresses.EXCHANGE_V2,
    };
  });
  it("sign maker ask order", async () => {
    const { collection1, verifier } = mocks.contracts;
    const { user1 } = signers;

    const makerOrder: Maker = {
      quoteType: QuoteType.Ask,
      globalNonce: 1,
      subsetNonce: 1,
      orderNonce: 1,
      strategyId: 1,
      collectionType: CollectionType.ERC721,
      collection: collection1.address,
      currency: mocks.addresses.WETH,
      signer: user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      price: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: encodeParams([], getMakerParamsTypes(StrategyType.standard)),
    };

    const signature = await signMakerOrder(user1, domain, makerOrder);

    expect(utils.verifyTypedData(domain, makerTypes, makerOrder, signature)).to.equal(user1.address);
    await verifier.verifySignature(makerOrder, signature);
    await expect(verifier.verifySignature(makerOrder, signature)).to.eventually.be.fulfilled;
    await expect(verifier.verifySignature(makerOrder, faultySignature)).to.eventually.be.rejectedWith(
      "call revert exception"
    );
  });
  it("sign maker bid order", async () => {
    const { collection1, verifier } = mocks.contracts;
    const { user1 } = signers;

    const makerOrder: Maker = {
      quoteType: QuoteType.Bid,
      globalNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      collectionType: CollectionType.ERC721,
      orderNonce: 1,
      collection: collection1.address,
      currency: mocks.addresses.WETH,
      signer: user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      price: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: encodeParams([], getTakerParamsTypes(StrategyType.standard)),
    };

    const signature = await signMakerOrder(user1, domain, makerOrder);

    expect(utils.verifyTypedData(domain, makerTypes, makerOrder, signature)).to.equal(user1.address);
    await expect(verifier.verifySignature(makerOrder, signature)).to.eventually.be.fulfilled;
    await expect(verifier.verifySignature(makerOrder, faultySignature)).to.eventually.be.rejectedWith(
      "call revert exception"
    );
  });
});
