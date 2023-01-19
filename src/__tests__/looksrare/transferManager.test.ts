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
import { SupportedChainId, AssetType } from "../../types";

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

    await expect(contractMethods.callStatic()).to.eventually.not.be.rejected;

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

    await expect(contractMethods.callStatic()).to.eventually.not.be.rejected;

    const tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
  it("transfer items from a single collection", async () => {
    const { addresses, contracts } = mocks;
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, addresses);
    await setApprovalForAll(signers.user1, contracts.collection1.address, addresses.TRANSFER_MANAGER_V2);
    (await lr.grantTransferManagerApproval().call()).wait();
    const collection1 = new Contract(contracts.collection1.address, abiIERC721, ethers.provider) as ERC721;

    const receipient = signers.user3.address;
    const tokenId = 0;

    // Check the initial owner
    const initialOwner = await collection1.ownerOf(tokenId);
    expect(initialOwner).to.be.equal(signers.user1.address);

    // Execute the transfer
    const contractMethods = await lr.transferItemsAcrossCollection(
      [contracts.collection1.address],
      [AssetType.ERC721],
      receipient,
      [[tokenId]],
      [[1]]
    );

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.not.be.rejected;

    const tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);

    // Check the new owner
    const newOwner = await collection1.ownerOf(tokenId);
    expect(newOwner).to.be.equal(receipient);
  });
  it("transfer items from multiple collections", async () => {
    const { addresses, contracts } = mocks;
    const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, addresses);
    await setApprovalForAll(signers.user1, contracts.collection1.address, addresses.TRANSFER_MANAGER_V2);
    await setApprovalForAll(signers.user1, contracts.collection2.address, addresses.TRANSFER_MANAGER_V2);
    (await lr.grantTransferManagerApproval().call()).wait();
    const collection1 = new Contract(contracts.collection1.address, abiIERC721, ethers.provider) as ERC721;
    const collection2 = new Contract(contracts.collection2.address, abiIERC1155, ethers.provider) as ERC1155;

    const receipient = signers.user3.address;

    // Execute the transfer
    const contractMethods = await lr.transferItemsAcrossCollection(
      [contracts.collection1.address, contracts.collection2.address],
      [AssetType.ERC721, AssetType.ERC1155],
      receipient,
      [[0], [0]],
      [[1], [10]]
    );

    const estimatedGas = await contractMethods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    await expect(contractMethods.callStatic()).to.eventually.not.be.rejected;

    const tx = await contractMethods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);

    // Check the new owner
    const newOwner = await collection1.ownerOf(0);
    expect(newOwner).to.be.equal(receipient);
    const newBalance = await collection2.balanceOf(receipient, 0);
    expect(newBalance).to.be.equal(10);
  });
});
