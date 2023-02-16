import { expect } from "chai";
import { utils } from "ethers";
import { setUpContracts, SetupMocks, getSigners, Signers } from "./helpers/setup";
import { getMakerHash } from "../utils/hashOrder";
import { Maker, CollectionType, QuoteType } from "../types";

describe("Hash orders", () => {
  let mocks: SetupMocks;
  let signers: Signers;

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });
  it("validate maker ask order hash", async () => {
    const makerAsk: Maker = {
      quoteType: QuoteType.Ask,
      globalNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      collectionType: CollectionType.ERC721,
      orderNonce: 1,
      collection: mocks.contracts.collection1.address,
      currency: mocks.addresses.WETH,
      signer: signers.user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      price: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: utils.defaultAbiCoder.encode([], []),
    };

    const { verifier } = mocks.contracts;
    const orderHashSc = await verifier.getMakerHash(makerAsk);
    const orderHashJs = getMakerHash(makerAsk);
    expect(orderHashSc).to.equal(orderHashJs);
  });
  it("validate maker bid order hash", async () => {
    const makerBid: Maker = {
      quoteType: QuoteType.Bid,
      globalNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      collectionType: CollectionType.ERC721,
      orderNonce: 1,
      collection: mocks.contracts.collection1.address,
      currency: mocks.addresses.WETH,
      signer: signers.user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      price: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: utils.defaultAbiCoder.encode([], []),
    };

    const { verifier } = mocks.contracts;
    const orderHashSc = await verifier.getMakerHash(makerBid);
    const orderHashJs = getMakerHash(makerBid);
    expect(orderHashSc).to.equal(orderHashJs);
  });
});
