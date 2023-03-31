import { expect } from "chai";
import { BigNumber, utils } from "ethers";
import { ethers } from "hardhat";
import { getTakerParamsTypes } from "../../utils/encodeOrderParams";
import { LooksRare } from "../../LooksRare";
import {
  SupportedChainId,
  CollectionType,
  StrategyType,
  CreateMakerInput,
  CreateMakerCollectionOfferWithProofInput,
  QuoteType,
} from "../../types";
import { ErrorStrategyType, ErrorQuoteType, ErrorItemId } from "../../errors";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";

const baseInput = {
  subsetNonce: 0,
  orderNonce: 0,
  startTime: Math.floor(Date.now() / 1000),
  endTime: Math.floor(Date.now() / 1000) + 3600,
  price: utils.parseEther("1"),
  itemIds: [1],
};

describe("Create takers", () => {
  let mocks: SetupMocks;
  let signers: Signers;

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });

  describe("createTaker", async () => {
    it("create taker with recipient", async () => {
      const baseMakerAskInput: CreateMakerInput = {
        ...baseInput,
        collection: mocks.contracts.collectionERC721.address,
        collectionType: CollectionType.ERC721,
        strategyId: StrategyType.standard,
      };
      const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      const { maker } = await looksrare.createMakerAsk(baseMakerAskInput);
      const taker = looksrare.createTaker(maker, signers.user2.address);

      expect(taker.recipient).to.be.equal(signers.user2.address);
      expect(taker.additionalParameters).to.be.equal("0x");
    });

    it("create taker without recipient", async () => {
      const baseMakerAskInput: CreateMakerInput = {
        ...baseInput,
        collection: mocks.contracts.collectionERC721.address,
        collectionType: CollectionType.ERC721,
        strategyId: StrategyType.standard,
      };
      const looksrare = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      const { maker } = await looksrare.createMakerAsk(baseMakerAskInput);
      const taker = looksrare.createTaker(maker);

      expect(taker.recipient).to.be.equal(ethers.constants.AddressZero);
      expect(taker.additionalParameters).to.be.equal("0x");
    });
  });

  describe("createTakerCollectionOffer", async () => {
    it("create taker for collection order", async () => {
      const baseMakerAskInput: CreateMakerInput = {
        ...baseInput,
        collection: mocks.contracts.collectionERC721.address,
        collectionType: CollectionType.ERC721,
        strategyId: StrategyType.collection,
      };
      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      const { maker } = await lr.createMakerBid(baseMakerAskInput);
      const taker = lr.createTakerCollectionOffer(maker, 1, signers.user2.address);

      const [itemId] = utils.defaultAbiCoder.decode(getTakerParamsTypes(maker.strategyId), taker.additionalParameters);
      expect(taker.recipient).to.be.equal(signers.user2.address);
      expect(BigNumber.from(itemId).toNumber()).to.be.equal(1);
    });

    it("throw when quote type is wrong", async () => {
      const baseMakerAskInput: CreateMakerInput = {
        ...baseInput,
        collection: mocks.contracts.collectionERC721.address,
        collectionType: CollectionType.ERC721,
        strategyId: StrategyType.collection,
      };
      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      const { maker } = await lr.createMakerAsk(baseMakerAskInput);

      expect(() => lr.createTakerCollectionOffer(maker, 1, signers.user2.address)).to.throw(ErrorQuoteType);
    });

    it("throw when strategy type is wrong", async () => {
      const baseMakerAskInput: CreateMakerInput = {
        ...baseInput,
        collection: mocks.contracts.collectionERC721.address,
        collectionType: CollectionType.ERC721,
        strategyId: StrategyType.standard,
      };
      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      const { maker } = await lr.createMakerBid(baseMakerAskInput);

      expect(() => lr.createTakerCollectionOffer(maker, 1, signers.user2.address)).to.throw(ErrorStrategyType);
    });
  });

  describe("createTakerCollectionOfferWithMerkleTree", async () => {
    const itemIds = [0, 1, 2];
    it("create taker for collection order", async () => {
      const makerBidInput: CreateMakerCollectionOfferWithProofInput = {
        ...baseInput,
        collection: mocks.contracts.collectionERC721.address,
        collectionType: CollectionType.ERC721,
        itemIds,
      };
      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      const { maker } = await lr.createMakerCollectionOfferWithProof(makerBidInput);
      const taker = lr.createTakerCollectionOfferWithProof(maker, 1, itemIds, signers.user2.address);

      const [itemId] = utils.defaultAbiCoder.decode(getTakerParamsTypes(maker.strategyId), taker.additionalParameters);
      expect(taker.recipient).to.be.equal(signers.user2.address);
      expect(BigNumber.from(itemId).toNumber()).to.be.equal(1);
    });

    it("throw when quote type is wrong", async () => {
      const makerBidInput: CreateMakerCollectionOfferWithProofInput = {
        ...baseInput,
        collection: mocks.contracts.collectionERC721.address,
        collectionType: CollectionType.ERC721,
        itemIds,
      };
      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      const { maker } = await lr.createMakerCollectionOfferWithProof(makerBidInput);

      const callback = () =>
        lr.createTakerCollectionOfferWithProof(
          { ...maker, quoteType: QuoteType.Ask },
          1,
          itemIds,
          signers.user2.address
        );
      expect(callback).to.throw(ErrorQuoteType);
    });

    it("throw when strategy type is wrong", async () => {
      const makerBidInput: CreateMakerCollectionOfferWithProofInput = {
        ...baseInput,
        collection: mocks.contracts.collectionERC721.address,
        collectionType: CollectionType.ERC721,
        itemIds,
      };
      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      const { maker } = await lr.createMakerCollectionOfferWithProof(makerBidInput);

      const callback = () =>
        lr.createTakerCollectionOfferWithProof(
          { ...maker, strategyId: StrategyType.collection },
          1,
          itemIds,
          signers.user2.address
        );
      expect(callback).to.throw(ErrorStrategyType);
    });

    it("throw when item cannot be found", async () => {
      const makerBidInput: CreateMakerCollectionOfferWithProofInput = {
        ...baseInput,
        collection: mocks.contracts.collectionERC721.address,
        collectionType: CollectionType.ERC721,
        itemIds,
      };
      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
      const { maker } = await lr.createMakerCollectionOfferWithProof(makerBidInput);

      const callback = () => lr.createTakerCollectionOfferWithProof(maker, 4, itemIds, signers.user2.address);
      expect(callback).to.throw(ErrorItemId);
    });
  });
});
