import { expect } from "chai";
import { utils } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { setUpContracts, Mocks, getSigners, Signers } from "./helpers/setup";
import { computeDigestMakerAsk, getDomainSeparator, getMakerOrderHash } from "./helpers/eip712";
import { contractName, version, makerAskTypes } from "../constants/eip712";
import { signMakerOrders } from "../utils/signMakerOrders";
import { SupportedChainId, MakerAsk, AssetType } from "../types";

const faultySignature =
  "0xcafe829116da9a4b31a958aa790682228b85e5d03b1ae7bb15f8ce4c8432a20813934991833da8e913894c9f35f1f018948c58d68fb61bbca0e07bd43c4492fa2b";

describe.only("SignMakerOrders", () => {
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
  it("validate EIP-712 data", async () => {
    const { collection1, weth, verifier } = contracts;
    const { user1 } = signers;

    const makerOrder: MakerAsk = {
      askNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      assetType: AssetType.ERC721,
      orderNonce: 1,
      minNetRatio: 8500,
      collection: collection1.address,
      currency: weth.address,
      recipient: user1.address,
      signer: user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      minPrice: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: utils.defaultAbiCoder.encode([], []),
    };

    const orderHashSc = await verifier.getMakerOrderHash(makerOrder);
    const orderHashHs = getMakerOrderHash(makerOrder);
    expect(orderHashSc === orderHashHs);

    const domainSc = await verifier.getDomainSeparator();
    const domainJs = getDomainSeparator(domain);
    expect(domainSc === domainJs);

    const digestSc = await verifier.computeDigestMakerAsk(makerOrder);
    const digestJs = computeDigestMakerAsk(domain, makerOrder);
    expect(digestSc === digestJs);
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
      minNetRatio: 8500,
      collection: collection1.address,
      currency: weth.address,
      recipient: user1.address,
      signer: user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      minPrice: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: utils.defaultAbiCoder.encode([], []),
    };

    const signature = await signMakerOrders(user1, domain, makerAskTypes, makerOrder);
    expect(utils.verifyTypedData(domain, makerAskTypes, makerOrder, signature)).to.equal(user1.address);

    await expect(verifier.verifyAskOrders(makerOrder, signature)).to.eventually.be.fulfilled;
    await expect(verifier.verifyAskOrders(makerOrder, faultySignature)).to.eventually.be.rejectedWith(
      "call revert exception"
    );
  });
});
