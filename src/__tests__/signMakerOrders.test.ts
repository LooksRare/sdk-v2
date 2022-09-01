import { expect } from "chai";
import { utils } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { setUpContracts, Mocks, getSigners, Signers } from "./helpers/setup";
import { contractName, version, makerAskTypes } from "../constants/eip712";
import { signMakerOrders } from "../utils/signMakerOrders";
import { SupportedChainId, MakerAsk, AssetType } from "../types";

const faultySignature =
  "0xcafe829116da9a4b31a958aa790682228b85e5d03b1ae7bb15f8ce4c8432a20813934991833da8e913894c9f35f1f018948c58d68fb61bbca0e07bd43c4492fa2b";

describe("SignMakerOrders", () => {
  let contracts: Mocks;
  let signers: Signers;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
  });
  it("sign maker ask order", async () => {
    const { looksRareProtocol, collection1, weth, verifier } = contracts;
    const { user1 } = signers;

    const domain: TypedDataDomain = {
      name: contractName,
      version: version.toString(),
      chainId: SupportedChainId.HARDHAT,
      verifyingContract: looksRareProtocol.address,
    };
    const makerOrder: MakerAsk = {
      askNonce: 0,
      subsetNonce: 0,
      strategyId: 0,
      assetType: AssetType.ERC721,
      orderNonce: 0,
      minNetRatio: 8500,
      collection: collection1.address,
      currency: weth.address,
      recipient: user1.address,
      signer: user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      minPrice: utils.parseEther("1").toString(),
      itemIds: [0],
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
