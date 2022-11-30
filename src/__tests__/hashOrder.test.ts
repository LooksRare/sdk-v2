import { expect } from "chai";
import { utils } from "ethers";
import { setUpContracts, Mocks, getSigners, Signers } from "./helpers/setup";
import { getMakerAskHash, getMakerBidHash } from "../utils/hashOrder";
import { MakerAsk, MakerBid, AssetType } from "../types";

describe("hash orders", () => {
  let contracts: Mocks;
  let signers: Signers;

  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
  });
  it("validate maker ask order hash", async () => {
    const makerAsk: MakerAsk = {
      askNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      assetType: AssetType.ERC721,
      orderNonce: 1,
      collection: contracts.collection1.address,
      currency: contracts.weth.address,
      signer: signers.user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      minPrice: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: utils.defaultAbiCoder.encode([], []),
    };

    const { verifier } = contracts;
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
      collection: contracts.collection1.address,
      currency: contracts.weth.address,
      signer: signers.user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      maxPrice: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: utils.defaultAbiCoder.encode([], []),
    };

    const { verifier } = contracts;
    const orderHashSc = await verifier.getMakerBidHash(makerBid);
    const orderHashHs = getMakerBidHash(makerBid);
    expect(orderHashSc === orderHashHs);
  });
});
