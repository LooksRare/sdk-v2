import { expect } from "chai";
import { AbiCoder, parseEther } from "ethers";
import { ethers } from "hardhat";
import { getTakerParamsTypes } from "../../utils/encodeOrderParams";
import { LooksRare } from "../../LooksRare";
import { ChainId, CollectionType, StrategyType, CreateMakerInput, QuoteType } from "../../types";
import { ErrorStrategyType, ErrorQuoteType, ErrorItemId } from "../../errors";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";

describe("Create takers", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let lrUser1: LooksRare;
  let baseMakerInput: CreateMakerInput;

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
    lrUser1 = new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);

    baseMakerInput = {
      collection: mocks.addresses.MOCK_COLLECTION_ERC721,
      collectionType: CollectionType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: parseEther("1"),
      itemIds: [1],
    };
  });

  describe("createTaker", async () => {
    it("create taker with recipient", async () => {
      const { maker } = await lrUser1.createMakerAsk(baseMakerInput);
      const taker = lrUser1.createTaker(maker, signers.user2.address);

      expect(taker.recipient).to.be.equal(signers.user2.address);
      expect(taker.additionalParameters).to.be.equal("0x");
    });

    it("create taker without recipient", async () => {
      const { maker } = await lrUser1.createMakerAsk(baseMakerInput);
      const taker = lrUser1.createTaker(maker);

      expect(taker.recipient).to.be.equal(ethers.ZeroAddress);
      expect(taker.additionalParameters).to.be.equal("0x");
    });
  });

  describe("createTakerCollectionOffer", async () => {
    it("create taker for collection order", async () => {
      const { maker } = await lrUser1.createMakerBid({
        ...baseMakerInput,
        strategyId: StrategyType.collection,
      });
      const taker = lrUser1.createTakerCollectionOffer(maker, 1, signers.user2.address);
      const [itemId] = AbiCoder.defaultAbiCoder().decode(
        getTakerParamsTypes(maker.strategyId),
        taker.additionalParameters
      );

      expect(taker.recipient).to.be.equal(signers.user2.address);
      expect(Number(BigInt(itemId))).to.be.equal(1);
    });

    it("throw when quote type is wrong", async () => {
      const { maker } = await lrUser1.createMakerAsk({
        ...baseMakerInput,
        strategyId: StrategyType.collection,
      });

      expect(() => lrUser1.createTakerCollectionOffer(maker, 1, signers.user2.address)).to.throw(ErrorQuoteType);
    });

    it("throw when strategy type is wrong", async () => {
      const { maker } = await lrUser1.createMakerBid(baseMakerInput);
      expect(() => lrUser1.createTakerCollectionOffer(maker, 1, signers.user2.address)).to.throw(ErrorStrategyType);
    });
  });

  describe("createTakerCollectionOfferWithMerkleTree", async () => {
    const itemIds = [0, 1, 2];

    it("create taker for collection order", async () => {
      const { maker } = await lrUser1.createMakerCollectionOfferWithProof({
        ...baseMakerInput,
        itemIds,
      });
      const taker = lrUser1.createTakerCollectionOfferWithProof(maker, 1, itemIds, signers.user2.address);

      const [itemId] = AbiCoder.defaultAbiCoder().decode(
        getTakerParamsTypes(maker.strategyId),
        taker.additionalParameters
      );
      expect(taker.recipient).to.be.equal(signers.user2.address);
      expect(Number(BigInt(itemId))).to.be.equal(1);
    });

    it("throw when quote type is wrong", async () => {
      const { maker } = await lrUser1.createMakerCollectionOfferWithProof({
        ...baseMakerInput,
        itemIds,
      });

      const callback = () =>
        lrUser1.createTakerCollectionOfferWithProof(
          { ...maker, quoteType: QuoteType.Ask },
          1,
          itemIds,
          signers.user2.address
        );
      expect(callback).to.throw(ErrorQuoteType);
    });

    it("throw when strategy type is wrong", async () => {
      const { maker } = await lrUser1.createMakerCollectionOfferWithProof({
        ...baseMakerInput,
        itemIds,
      });

      const callback = () =>
        lrUser1.createTakerCollectionOfferWithProof(
          { ...maker, strategyId: StrategyType.collection },
          1,
          itemIds,
          signers.user2.address
        );
      expect(callback).to.throw(ErrorStrategyType);
    });

    it("throw when item cannot be found", async () => {
      const { maker } = await lrUser1.createMakerCollectionOfferWithProof({
        ...baseMakerInput,
        itemIds,
      });

      const callback = () => lrUser1.createTakerCollectionOfferWithProof(maker, 4, itemIds, signers.user2.address);
      expect(callback).to.throw(ErrorItemId);
    });
  });
});
