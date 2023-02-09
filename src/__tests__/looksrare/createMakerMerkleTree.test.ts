import { expect } from "chai";
import { utils } from "ethers";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { createMakerMerkleTree } from "../../utils/merkleTree";
import { AssetType, QuoteType, Maker } from "../../types";

describe("Create maker merkle tree", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });
  it("create a merkle tree with 2 listings", async () => {
    const makerOrders: Maker[] = [
      {
        quoteType: QuoteType.Ask,
        globalNonce: 1,
        subsetNonce: 1,
        strategyId: 1,
        assetType: AssetType.ERC721,
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
      },
      {
        quoteType: QuoteType.Bid,
        globalNonce: 1,
        subsetNonce: 1,
        strategyId: 1,
        assetType: AssetType.ERC721,
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
      },
    ];
    const tree = createMakerMerkleTree(makerOrders);
    expect(tree.getLeaves().length).to.be.equal(makerOrders.length);
  });
});
