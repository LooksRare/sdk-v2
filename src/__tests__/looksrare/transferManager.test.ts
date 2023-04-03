import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { ERC721 } from "../../typechain/solmate/src/tokens/ERC721.sol/ERC721";
import { ERC1155 } from "../../typechain/solmate/src/tokens/ERC1155.sol/ERC1155";
import abiIERC721 from "../../abis/IERC721.json";
import abiIERC1155 from "../../abis/IERC1155.json";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { SupportedChainId, CollectionType, BatchTransferItem } from "../../types";

describe("Transfer manager", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let lrUser1: LooksRare;

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
    lrUser1 = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
  });

  it("has user approved", async () => {
    expect(await lrUser1.isTransferManagerApproved()).to.be.false;

    const methods = lrUser1.grantTransferManagerApproval();
    const tx = await methods.call();
    await tx.wait();

    expect(await lrUser1.isTransferManagerApproved()).to.be.true;
  });

  it("grant operator approvals", async () => {
    const contractMethods = lrUser1.grantTransferManagerApproval();

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;

    const tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });

  it("revoke operator approvals", async () => {
    await (await lrUser1.grantTransferManagerApproval().call()).wait();
    const contractMethods = lrUser1.revokeTransferManagerApproval();

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;

    const tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });

  it("transfer items from a single collection", async () => {
    const { contracts } = mocks;
    await (await lrUser1.approveAllCollectionItems(contracts.collectionERC721.address)).wait();
    await (await lrUser1.grantTransferManagerApproval().call()).wait();
    const collectionERC721 = new Contract(contracts.collectionERC721.address, abiIERC721, ethers.provider) as ERC721;

    const receipient = signers.user3.address;
    const tokenId = 0;

    // Check the initial owner
    const initialOwner = await collectionERC721.ownerOf(tokenId);
    expect(initialOwner).to.be.equal(signers.user1.address);

    const items: BatchTransferItem[] = [
      {
        collection: contracts.collectionERC721.address,
        collectionType: CollectionType.ERC721,
        itemIds: [tokenId],
        amounts: [1],
      },
    ];
    const contractMethods = await lrUser1.transferItemsAcrossCollection(receipient, items);

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;

    const tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);

    // Check the new owner
    const newOwner = await collectionERC721.ownerOf(tokenId);
    expect(newOwner).to.be.equal(receipient);
  });

  it("transfer items from multiple collections", async () => {
    const { contracts } = mocks;
    await (await lrUser1.approveAllCollectionItems(contracts.collectionERC721.address)).wait();
    await (await lrUser1.approveAllCollectionItems(contracts.collectionERC1155.address)).wait();
    (await lrUser1.grantTransferManagerApproval().call()).wait();
    const collectionERC721 = new Contract(contracts.collectionERC721.address, abiIERC721, ethers.provider) as ERC721;
    const collectionERC1155 = new Contract(
      contracts.collectionERC1155.address,
      abiIERC1155,
      ethers.provider
    ) as ERC1155;

    const receipient = signers.user3.address;

    // Execute the transfer
    const items: BatchTransferItem[] = [
      {
        collection: contracts.collectionERC721.address,
        collectionType: CollectionType.ERC721,
        itemIds: [0],
        amounts: [1],
      },
      {
        collection: contracts.collectionERC1155.address,
        collectionType: CollectionType.ERC1155,
        itemIds: [0],
        amounts: [10],
      },
    ];
    const contractMethods = await lrUser1.transferItemsAcrossCollection(receipient, items);

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;

    const tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);

    // Check the new owner
    const newOwner = await collectionERC721.ownerOf(0);
    expect(newOwner).to.be.equal(receipient);
    const newBalance = await collectionERC1155.balanceOf(receipient, 0);
    expect(newBalance).to.be.equal(10);
  });
});
