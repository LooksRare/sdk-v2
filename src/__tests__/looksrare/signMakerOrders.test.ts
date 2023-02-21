import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { LooksRare } from "../../LooksRare";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { contractName, version, makerTypes } from "../../constants/eip712";
import { MAX_ORDERS_PER_TREE } from "../../constants";
import { encodeParams, getMakerParamsTypes, getTakerParamsTypes } from "../../utils/encodeOrderParams";
import { SupportedChainId, Maker, CollectionType, StrategyType, QuoteType } from "../../types";
import { ErrorMerkleTreeDepth } from "../../errors";

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
      verifyingContract: mocks.addresses.EXCHANGE_V2,
    };
  });
  describe("Sign single maker orders", () => {
    it("sign maker ask order", async () => {
      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      const { collectionERC721, verifier } = mocks.contracts;

      const makerOrder: Maker = {
        quoteType: QuoteType.Ask,
        globalNonce: 1,
        subsetNonce: 1,
        strategyId: 1,
        collectionType: CollectionType.ERC721,
        orderNonce: 1,
        collection: collectionERC721.address,
        currency: mocks.addresses.WETH,
        signer: signers.user1.address,
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000 + 3600),
        price: utils.parseEther("1").toString(),
        itemIds: [1],
        amounts: [1],
        additionalParameters: encodeParams([], getMakerParamsTypes(StrategyType.standard)),
      };

      const signature = await lr.signMakerOrder(makerOrder);

      expect(utils.verifyTypedData(domain, makerTypes, makerOrder, signature)).to.equal(signers.user1.address);
      await expect(verifier.verifySignature(makerOrder, signature)).to.eventually.be.fulfilled;
      await expect(verifier.verifySignature(makerOrder, faultySignature)).to.eventually.be.rejectedWith(
        "call revert exception"
      );
    });
    it("sign maker bid order", async () => {
      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      const { collectionERC721, verifier } = mocks.contracts;

      const makerOrder: Maker = {
        quoteType: QuoteType.Bid,
        globalNonce: 1,
        subsetNonce: 1,
        strategyId: 1,
        collectionType: CollectionType.ERC721,
        orderNonce: 1,
        collection: collectionERC721.address,
        currency: mocks.addresses.WETH,
        signer: signers.user1.address,
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000 + 3600),
        price: utils.parseEther("1").toString(),
        itemIds: [1],
        amounts: [1],
        additionalParameters: encodeParams([], getTakerParamsTypes(StrategyType.standard)),
      };

      const signature = await lr.signMakerOrder(makerOrder);

      expect(utils.verifyTypedData(domain, makerTypes, makerOrder, signature)).to.equal(signers.user1.address);
      await expect(verifier.verifySignature(makerOrder, signature)).to.eventually.be.fulfilled;
      await expect(verifier.verifySignature(makerOrder, faultySignature)).to.eventually.be.rejectedWith(
        "call revert exception"
      );
    });
  });

  describe("Sign multiple maker orders", () => {
    it("sign multiple maker bid order (merkle tree)", async () => {
      const { collectionERC721, verifier } = mocks.contracts;
      const makerOrders: Maker[] = [
        {
          quoteType: QuoteType.Bid,
          globalNonce: 1,
          subsetNonce: 1,
          strategyId: 1,
          collectionType: CollectionType.ERC721,
          orderNonce: 1,
          collection: collectionERC721.address,
          currency: mocks.addresses.WETH,
          signer: signers.user1.address,
          startTime: Math.floor(Date.now() / 1000),
          endTime: Math.floor(Date.now() / 1000 + 3600),
          price: utils.parseEther("1").toString(),
          itemIds: [1],
          amounts: [1],
          additionalParameters: utils.defaultAbiCoder.encode([], []),
        },
        {
          quoteType: QuoteType.Bid,
          globalNonce: 1,
          subsetNonce: 1,
          strategyId: 1,
          collectionType: CollectionType.ERC721,
          orderNonce: 1,
          collection: collectionERC721.address,
          currency: mocks.addresses.WETH,
          signer: signers.user1.address,
          startTime: Math.floor(Date.now() / 1000),
          endTime: Math.floor(Date.now() / 1000 + 3600),
          price: utils.parseEther("1").toString(),
          itemIds: [1],
          amounts: [1],
          additionalParameters: utils.defaultAbiCoder.encode([], []),
        },
        {
          quoteType: QuoteType.Bid,
          globalNonce: 1,
          subsetNonce: 1,
          strategyId: 1,
          collectionType: CollectionType.ERC721,
          orderNonce: 1,
          collection: collectionERC721.address,
          currency: mocks.addresses.WETH,
          signer: signers.user1.address,
          startTime: Math.floor(Date.now() / 1000),
          endTime: Math.floor(Date.now() / 1000 + 3600),
          price: utils.parseEther("1").toString(),
          itemIds: [1],
          amounts: [1],
          additionalParameters: utils.defaultAbiCoder.encode([], []),
        },
      ];
      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);

      const { signature, merkleTreeProofs, tree } = await lr.signMultipleMakerOrders(makerOrders);
      const signerAddress = signers.user1.address;

      expect(utils.verifyTypedData(domain, tree.types, tree.getDataToSign(), signature)).to.equal(signerAddress);

      merkleTreeProofs.forEach(async (merkleTreeProof) => {
        await expect(verifier.verifyMerkleTree(merkleTreeProof, signature, signerAddress)).to.eventually.be.fulfilled;
        await expect(
          verifier.verifyMerkleTree(merkleTreeProof, faultySignature, signerAddress)
        ).to.eventually.be.rejectedWith("call revert exception");
      });
    });
    it("sign orders when number of orders = MAX_ORDERS_PER_TREE", async () => {
      const { collectionERC721 } = mocks.contracts;
      const makerOrders: Maker[] = [...Array(MAX_ORDERS_PER_TREE)].map(() => ({
        quoteType: QuoteType.Bid,
        globalNonce: 1,
        subsetNonce: 1,
        strategyId: 1,
        collectionType: CollectionType.ERC721,
        orderNonce: 1,
        collection: collectionERC721.address,
        currency: mocks.addresses.WETH,
        signer: signers.user1.address,
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000 + 3600),
        price: utils.parseEther("1").toString(),
        itemIds: [1],
        amounts: [1],
        additionalParameters: utils.defaultAbiCoder.encode([], []),
      }));

      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      await expect(lr.signMultipleMakerOrders(makerOrders)).to.eventually.be.fulfilled;
    });
    it("revert if number of orders > MAX_ORDERS_PER_TREE", async () => {
      const { collectionERC721 } = mocks.contracts;
      const makerOrders: Maker[] = [...Array(MAX_ORDERS_PER_TREE + 1)].map(() => ({
        quoteType: QuoteType.Bid,
        globalNonce: 1,
        subsetNonce: 1,
        strategyId: 1,
        collectionType: CollectionType.ERC721,
        orderNonce: 1,
        collection: collectionERC721.address,
        currency: mocks.addresses.WETH,
        signer: signers.user1.address,
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000 + 3600),
        price: utils.parseEther("1").toString(),
        itemIds: [1],
        amounts: [1],
        additionalParameters: utils.defaultAbiCoder.encode([], []),
      }));

      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      await expect(lr.signMultipleMakerOrders(makerOrders)).to.eventually.be.rejectedWith(ErrorMerkleTreeDepth);
    });
  });
});
