import { expect } from "chai";
import { utils } from "ethers";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { createMakerMerkleTree } from "../../utils/merkleTree";
import { AssetType, MakerBid, MakerAsk } from "../../types";

describe("Create maker merkle tree", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });
  it("create a merkle tree with 2 listings", async () => {
    const makerOrders: (MakerBid | MakerAsk)[] = [
      {
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
    const tree = createMakerMerkleTree(makerOrders);
    expect(tree.getLeaves().length).to.be.equal(makerOrders.length);
  });
});
