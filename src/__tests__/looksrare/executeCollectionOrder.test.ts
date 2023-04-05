import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { ownerOf, balanceOf } from "../helpers/tokens";
import { LooksRare } from "../../LooksRare";
import { ChainId, CollectionType, CreateMakerCollectionOfferInput } from "../../types";

describe("execute collection order", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let lrUser1: LooksRare;
  let lrUser2: LooksRare;
  let collectionOfferInput: CreateMakerCollectionOfferInput;

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
    lrUser1 = new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    lrUser2 = new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user2, mocks.addresses);

    collectionOfferInput = {
      collection: mocks.contracts.collectionERC721.address,
      collectionType: CollectionType.ERC721,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
    };

    let tx = await lrUser1.grantTransferManagerApproval().call();
    await tx.wait();

    tx = await lrUser2.approveErc20(mocks.addresses.WETH);
    await tx.wait();

    tx = await lrUser1.approveAllCollectionItems(mocks.contracts.collectionERC721.address);
    await tx.wait();
  });

  it("execute estimatedGas and callStatic", async () => {
    const { maker } = await lrUser2.createMakerCollectionOffer(collectionOfferInput);
    const signature = await lrUser2.signMakerOrder(maker);
    const taker = lrUser1.createTakerCollectionOffer(maker, 0);
    const contractMethods = lrUser1.executeOrder(maker, taker, signature);

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);
    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;
  });

  it("execute collection order", async () => {
    const itemId = 0;
    const { maker } = await lrUser2.createMakerCollectionOffer(collectionOfferInput);
    const signature = await lrUser2.signMakerOrder(maker);
    const taker = lrUser1.createTakerCollectionOffer(maker, itemId);

    const user1InitialBalance = await balanceOf(signers.user1, mocks.addresses.WETH);
    const contractMethods = lrUser1.executeOrder(maker, taker, signature);

    const receipt = await (await contractMethods.call()).wait();
    expect(receipt.status).to.be.equal(1);

    const owner = await ownerOf(signers.user2, collectionOfferInput.collection, itemId);
    expect(owner).to.be.equal(signers.user2.address);

    const user1UpdatedBalance = await balanceOf(signers.user1, mocks.addresses.WETH);
    expect(user1UpdatedBalance.gt(user1InitialBalance)).to.be.true;
  });
});
