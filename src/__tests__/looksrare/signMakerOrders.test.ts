import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { LooksRare } from "../../LooksRare";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { contractName, version, makerAskTypes, makerBidTypes, merkleTreeTypes } from "../../constants/eip712";
import { encodeParams, getMakerParamsTypes, getTakerParamsTypes } from "../../utils/encodeOrderParams";
import { SupportedChainId, MakerAsk, MakerBid, AssetType, StrategyType } from "../../types";

const faultySignature =
  "0xcafe829116da9a4b31a958aa790682228b85e5d03b1ae7bb15f8ce4c8432a20813934991833da8e913894c9f35f1f018948c58d68fb61bbca0e07bd43c4492fa2b";

describe("Sign maker orders", () => {
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
      verifyingContract: mocks.addresses.EXCHANGE,
    };
  });
  it("sign maker ask order", async () => {
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const { collection1, verifier } = mocks.contracts;

    const makerOrder: MakerAsk = {
      askNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      assetType: AssetType.ERC721,
      orderNonce: 1,
      collection: collection1.address,
      currency: mocks.addresses.WETH,
      signer: signers.user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      minPrice: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: encodeParams([], getMakerParamsTypes(StrategyType.standard)),
    };

    const signature = await lr.signMakerAsk(makerOrder);

    expect(utils.verifyTypedData(domain, makerAskTypes, makerOrder, signature)).to.equal(signers.user1.address);
    await expect(verifier.verifyAskOrders(makerOrder, signature)).to.eventually.be.fulfilled;
    await expect(verifier.verifyAskOrders(makerOrder, faultySignature)).to.eventually.be.rejectedWith(
      "call revert exception"
    );
  });
  it("sign maker bid order", async () => {
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const { collection1, verifier } = mocks.contracts;

    const makerOrder: MakerBid = {
      bidNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      assetType: AssetType.ERC721,
      orderNonce: 1,
      collection: collection1.address,
      currency: mocks.addresses.WETH,
      signer: signers.user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      maxPrice: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: encodeParams([], getTakerParamsTypes(StrategyType.standard)),
    };

    const signature = await lr.signMakerBid(makerOrder);

    expect(utils.verifyTypedData(domain, makerBidTypes, makerOrder, signature)).to.equal(signers.user1.address);
    await expect(verifier.verifyBidOrders(makerOrder, signature)).to.eventually.be.fulfilled;
    await expect(verifier.verifyBidOrders(makerOrder, faultySignature)).to.eventually.be.rejectedWith(
      "call revert exception"
    );
  });
  it("sign multiple maker bid order (merkle tree)", async () => {
    const { collection1, verifier } = mocks.contracts;
    const makerOrders: MakerBid[] = [
      {
        bidNonce: 1,
        subsetNonce: 1,
        strategyId: 1,
        assetType: AssetType.ERC721,
        orderNonce: 1,
        collection: collection1.address,
        currency: mocks.addresses.WETH,
        signer: signers.user1.address,
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000 + 3600),
        maxPrice: utils.parseEther("1").toString(),
        itemIds: [1],
        amounts: [1],
        additionalParameters: utils.defaultAbiCoder.encode([], []),
      },
      {
        bidNonce: 1,
        subsetNonce: 1,
        strategyId: 1,
        assetType: AssetType.ERC721,
        orderNonce: 1,
        collection: collection1.address,
        currency: mocks.addresses.WETH,
        signer: signers.user1.address,
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000 + 3600),
        maxPrice: utils.parseEther("1").toString(),
        itemIds: [1],
        amounts: [1],
        additionalParameters: utils.defaultAbiCoder.encode([], []),
      },
    ];
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const tree = lr.createMakerMerkleTree(makerOrders);

    const signature = await lr.signMultipleMakers(tree.root);

    expect(utils.verifyTypedData(domain, merkleTreeTypes, tree, signature)).to.equal(signers.user1.address);
    await expect(verifier.verifyMerkleTreeOrders(tree, signature, signers.user1.address)).to.eventually.be.fulfilled;
    await expect(
      verifier.verifyMerkleTreeOrders(tree, faultySignature, signers.user1.address)
    ).to.eventually.be.rejectedWith("call revert exception");
  });
});
