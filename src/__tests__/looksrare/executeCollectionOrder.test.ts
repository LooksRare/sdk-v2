import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { SupportedChainId, CollectionType } from "../../types";

describe("execute collection order", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();

    const tx = await mocks.contracts.transferManager
      .connect(signers.user1)
      .grantApprovals([mocks.addresses.EXCHANGE_V2]);
    await tx.wait();
  });
  it("execute collection order", async () => {
    const lrUser1 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    const lrUser2 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user2, mocks.addresses);

    let tx = await lrUser2.approveErc20(lrUser2.addresses.WETH);
    await tx.wait();
    tx = await lrUser1.approveAllCollectionItems(mocks.contracts.collectionERC721.address);
    await tx.wait();

    const { maker } = await lrUser2.createMakerCollectionOffer({
      collection: mocks.contracts.collectionERC721.address,
      collectionType: CollectionType.ERC721,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
    });
    const signature = await lrUser2.signMakerOrder(maker);
    const taker = lrUser1.createTakerCollectionOffer(maker, 0);
    const contractMethods = lrUser1.executeOrder(maker, taker, signature);

    tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
});
