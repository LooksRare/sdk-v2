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
  it("grant operator approvals", async () => {
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
    const methods = lr.grantTransferManagerApproval();

    const estimatedGas = await methods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    const tx = await methods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
  it("revoke operator approvals", async () => {
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
    (await lr.grantTransferManagerApproval().call()).wait();
    const methods = lr.revokeTransferManagerApproval();

    const estimatedGas = await methods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    const tx = await methods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
  it("transfer items from a single collection", async () => {
    const { addresses, contracts } = mocks;
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    await setApprovalForAll(signers.user1, contracts.collection1.address, addresses.TRANSFER_MANAGER);
    (await lr.grantTransferManagerApproval().call()).wait();
    const collection1 = new Contract(contracts.collection1.address, abiIERC721, ethers.provider) as ERC721;

    const receipient = signers.user3.address;
    const tokenId = 0;

    // Check the initial owner
    const initialOwner = await collection1.ownerOf(tokenId);
    expect(initialOwner).to.be.equal(signers.user1.address);

    // Execute the transfer
    const methods = await lr.transferItemsAcrossCollection(
      [contracts.collection1.address],
      [AssetType.ERC721],
      receipient,
      [[tokenId]],
      [[1]]
    );

    const estimatedGas = await methods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    const tx = await methods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);

    // Check the new owner
    const newOwner = await collection1.ownerOf(tokenId);
    expect(newOwner).to.be.equal(receipient);
  });
  it("transfer items from multiple collections", async () => {
    const { addresses, contracts } = mocks;
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    await setApprovalForAll(signers.user1, contracts.collection1.address, addresses.TRANSFER_MANAGER);
    await setApprovalForAll(signers.user1, contracts.collection2.address, addresses.TRANSFER_MANAGER);
    (await lr.grantTransferManagerApproval().call()).wait();
    const collection1 = new Contract(contracts.collection1.address, abiIERC721, ethers.provider) as ERC721;
    const collection2 = new Contract(contracts.collection2.address, abiIERC1155, ethers.provider) as ERC1155;

    const receipient = signers.user3.address;

    // Execute the transfer
    const methods = await lr.transferItemsAcrossCollection(
      [contracts.collection1.address, contracts.collection2.address],
      [AssetType.ERC721, AssetType.ERC1155],
      receipient,
      [[0], [0]],
      [[1], [10]]
    );

    const estimatedGas = await methods.estimateGas();
    expect(estimatedGas.toNumber()).to.be.greaterThan(0);

    const tx = await methods.call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);

    // Check the new owner
    const newOwner = await collection1.ownerOf(0);
    expect(newOwner).to.be.equal(receipient);
    const newBalance = await collection2.balanceOf(receipient, 0);
    expect(newBalance).to.be.equal(10);
  });
});
