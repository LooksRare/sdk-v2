import { expect } from "chai";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { ownerOf, balanceOf } from "../helpers/tokens";
import { LooksRare } from "../../LooksRare";
import { ChainId, CollectionType, CreateMakerCollectionOfferInput } from "../../types";
import { parseEther } from "ethers";

describe("execute collection order with proof", () => {
  let mocks: SetupMocks;
  let lrUser1: LooksRare;
  let signers: Signers;
  let lrUser2: LooksRare;
  let collectionOfferInput: CreateMakerCollectionOfferInput;
  const itemIds = [0, 1, 2];

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
    lrUser1 = new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    lrUser2 = new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user2, mocks.addresses);

    collectionOfferInput = {
      collection: mocks.addresses.MOCK_COLLECTION_ERC721,
      collectionType: CollectionType.ERC721,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: parseEther("1"),
    };

    let tx = await lrUser1.grantTransferManagerApproval().call();
    await tx.wait();

    tx = await lrUser2.approveErc20(mocks.addresses.WETH);
    await tx.wait();

    tx = await lrUser1.approveAllCollectionItems(mocks.addresses.MOCK_COLLECTION_ERC721);
    await tx.wait();
  });

  it("execute estimatedGas and callStatic", async () => {
    const { maker } = await lrUser2.createMakerCollectionOfferWithProof({
      ...collectionOfferInput,
      itemIds,
    });
    const signature = await lrUser2.signMakerOrder(maker);

    const taker = lrUser1.createTakerCollectionOfferWithProof(maker, 1, itemIds, signers.user1.address);
    const contractMethods = lrUser1.executeOrder(maker, taker, signature);

    const estimatedGas = await contractMethods.estimateGas();
    expect(Number(estimatedGas)).to.be.greaterThan(0);
    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;
  });

  it("execute collection order", async () => {
    const itemId = 0;
    const { maker } = await lrUser2.createMakerCollectionOfferWithProof({
      ...collectionOfferInput,
      itemIds,
    });
    const signature = await lrUser2.signMakerOrder(maker);

    const taker = lrUser1.createTakerCollectionOfferWithProof(maker, itemId, itemIds, signers.user1.address);

    const user1InitialBalance = await balanceOf(signers.user1, mocks.addresses.WETH);
    const { call } = lrUser1.executeOrder(maker, taker, signature);

    const receipt = await (await call()).wait();
    expect(receipt?.status).to.be.equal(1);

    const owner = await ownerOf(signers.user2, collectionOfferInput.collection, itemId);
    expect(owner).to.be.equal(signers.user2.address);

    const user1UpdatedBalance = await balanceOf(signers.user1, mocks.addresses.WETH);
    expect(user1UpdatedBalance > user1InitialBalance).to.be.true;
  });
});
