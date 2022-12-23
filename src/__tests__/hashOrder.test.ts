import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { LooksRare } from "../LooksRare";
import { setUpContracts, SetupMocks, getSigners, Signers } from "./helpers/setup";
import { getMakerAskHash, getMakerBidHash, getMerkleTreeHash } from "../utils/hashOrder";
import { MakerAsk, MakerBid, AssetType } from "../types";

describe("Hash orders", () => {
  let mocks: SetupMocks;
  let signers: Signers;

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });
  it("validate maker ask order hash", async () => {
    const makerAsk: MakerAsk = {
      askNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      assetType: AssetType.ERC721,
      orderNonce: 1,
      collection: mocks.contracts.collection1.address,
      currency: mocks.addresses.WETH,
      signer: signers.user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      minPrice: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: utils.defaultAbiCoder.encode([], []),
    };

    const { verifier } = mocks.contracts;
    const orderHashSc = await verifier.getMakerAskHash(makerAsk);
    const orderHashHs = getMakerAskHash(makerAsk);
    expect(orderHashSc === orderHashHs);
  });
  it("validate maker bid order hash", async () => {
    const makerBid: MakerBid = {
      bidNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      assetType: AssetType.ERC721,
      orderNonce: 1,
      collection: mocks.contracts.collection1.address,
      currency: mocks.addresses.WETH,
      signer: signers.user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      maxPrice: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: utils.defaultAbiCoder.encode([], []),
    };

    const { verifier } = mocks.contracts;
    const orderHashSc = await verifier.getMakerBidHash(makerBid);
    const orderHashHs = getMakerBidHash(makerBid);
    expect(orderHashSc === orderHashHs);
  });
  it("validate merkle tree order hash", async () => {
    const makerOrders: MakerBid[] = [
      {
        bidNonce: 1,
        subsetNonce: 1,
        strategyId: 1,
        assetType: AssetType.ERC721,
        orderNonce: 1,
        collection: mocks.contracts.collection1.address,
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
        collection: mocks.contracts.collection1.address,
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

    const lr = new LooksRare(ethers.provider, 1, signers.user1);
    const merkleTree = lr.createMakerMerkleTree(makerOrders);

    const { verifier } = mocks.contracts;
    const orderHashSc = await verifier.getMerkleTreeHash(merkleTree);
    const orderHashHs = getMerkleTreeHash(merkleTree.root);
    expect(orderHashSc === orderHashHs);
  });
});
