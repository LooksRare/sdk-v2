import { expect } from "chai";
import { utils } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { setUpContracts, Mocks, getSigners, Signers } from "./helpers/setup";
import { contractName, version, makerAskTypes, makerBidTypes } from "../constants/eip712";
import { signMakerAsk, signMakerBid } from "../utils/signMakerOrders";
import { encodeParams, getMakerParamsTypes, getTakerParamsTypes } from "../utils/encodeOrderParams";
import { SupportedChainId, MakerAsk, MakerBid, AssetType, StrategyType } from "../types";

const faultySignature =
  "0xcafe829116da9a4b31a958aa790682228b85e5d03b1ae7bb15f8ce4c8432a20813934991833da8e913894c9f35f1f018948c58d68fb61bbca0e07bd43c4492fa2b";

describe("SignMakerOrders", () => {
  let contracts: Mocks;
  let signers: Signers;
  let domain: TypedDataDomain;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
    domain = {
      name: contractName,
      version: version.toString(),
      chainId: SupportedChainId.HARDHAT,
      verifyingContract: contracts.looksRareProtocol.address,
    };
  });
  it("sign maker ask order", async () => {
    const { collection1, weth, verifier } = contracts;
    const { user1 } = signers;

    const makerOrder: MakerAsk = {
      askNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      assetType: AssetType.ERC721,
      orderNonce: 1,
      collection: collection1.address,
      currency: weth.address,
      signer: user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      minPrice: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: encodeParams([], getMakerParamsTypes(StrategyType.standard)),
    };

    const signature = await signMakerAsk(user1, domain, makerOrder);

    expect(utils.verifyTypedData(domain, makerAskTypes, makerOrder, signature)).to.equal(user1.address);
    await expect(verifier.verifyAskOrders(makerOrder, signature)).to.eventually.be.fulfilled;
    await expect(verifier.verifyAskOrders(makerOrder, faultySignature)).to.eventually.be.rejectedWith(
      "call revert exception"
    );
  });
  it("sign maker bid order", async () => {
    const { collection1, weth, verifier } = contracts;
    const { user1 } = signers;

    const makerOrder: MakerBid = {
      bidNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      assetType: AssetType.ERC721,
      orderNonce: 1,
      collection: collection1.address,
      currency: weth.address,
      signer: user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      maxPrice: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: encodeParams([], getTakerParamsTypes(StrategyType.standard)),
    };

    const signature = await signMakerBid(user1, domain, makerOrder);

    expect(utils.verifyTypedData(domain, makerBidTypes, makerOrder, signature)).to.equal(user1.address);
    await expect(verifier.verifyBidOrders(makerOrder, signature)).to.eventually.be.fulfilled;
    await expect(verifier.verifyBidOrders(makerOrder, faultySignature)).to.eventually.be.rejectedWith(
      "call revert exception"
    );
  });
});
