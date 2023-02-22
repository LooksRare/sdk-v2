import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { ERC721 } from "../../../typechain/solmate/src/tokens/ERC721.sol/ERC721";
import { ERC1155 } from "../../../typechain/solmate/src/tokens/ERC1155.sol/ERC1155";
import abiIERC721 from "../../abis/IERC721.json";
import abiIERC1155 from "../../abis/IERC1155.json";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { setApprovalForAll } from "../../utils/calls/tokens";
import { SupportedChainId, CollectionType, BatchTransferItem } from "../../types";

describe("Transfer manager", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });
  it("has user approved", async () => {
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    expect(await lr.isTransferManagerApproved()).to.be.false;

    const methods = lr.grantTransferManagerApproval();
    const tx = await methods.call();
    await tx.wait();
    expect(await lr.isTransferManagerApproved()).to.be.true;
  });
  it("grant operator approvals", async () => {
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);

    const contractMethods = lr.grantTransferManagerApproval();

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;

    const tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
  it("revoke operator approvals", async () => {
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    (await lr.grantTransferManagerApproval().call()).wait();
    const contractMethods = lr.revokeTransferManagerApproval();

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;

    const tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
  it("transfer items from a single collection", async () => {
    const { addresses, contracts } = mocks;
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, addresses);
    await setApprovalForAll(signers.user1, contracts.collectionERC721.address, addresses.TRANSFER_MANAGER_V2);
    (await lr.grantTransferManagerApproval().call()).wait();
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
    const contractMethods = await lr.transferItemsAcrossCollection(receipient, items);

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
    const { addresses, contracts } = mocks;
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, addresses);
    await setApprovalForAll(signers.user1, contracts.collectionERC721.address, addresses.TRANSFER_MANAGER_V2);
    await setApprovalForAll(signers.user1, contracts.collectionERC1155.address, addresses.TRANSFER_MANAGER_V2);
    (await lr.grantTransferManagerApproval().call()).wait();
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
    const contractMethods = await lr.transferItemsAcrossCollection(receipient, items);

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
