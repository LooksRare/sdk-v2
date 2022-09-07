import { expect } from "chai";
import { ethers } from "hardhat";
import { setUpContracts, Mocks, getSigners, Signers, NB_NFT_PER_USER } from "./helpers/setup";
import { isApprovedForAll, setApprovalForAll, balanceOf, ownerOf } from "../utils/calls/nft";

describe("ERC721 & ERC1155", () => {
  let contracts: Mocks;
  let signers: Signers;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
  });
  it("approve ERC721", async () => {
    const provider = ethers.provider;
    const { collection1 } = contracts;

    let isApproved = await isApprovedForAll(
      provider,
      collection1.address,
      signers.user1.address,
      signers.operator.address
    );
    expect(isApproved).to.be.false;

    // Approve
    let transaction = await setApprovalForAll(signers.user1, collection1.address, signers.operator.address);
    let receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);

    isApproved = await isApprovedForAll(provider, collection1.address, signers.user1.address, signers.operator.address);
    expect(isApproved).to.be.true;

    // Cancel approval
    transaction = await setApprovalForAll(signers.user1, collection1.address, signers.operator.address, false);
    receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);

    isApproved = await isApprovedForAll(provider, collection1.address, signers.user1.address, signers.operator.address);
    expect(isApproved).to.be.false;
  });
  it("approve ERC1155", async () => {
    const provider = ethers.provider;
    const { collection3 } = contracts;

    let isApproved = await isApprovedForAll(
      provider,
      collection3.address,
      signers.user1.address,
      signers.operator.address
    );
    expect(isApproved).to.be.false;

    const transaction = await setApprovalForAll(signers.user1, collection3.address, signers.operator.address);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);

    isApproved = await isApprovedForAll(provider, collection3.address, signers.user1.address, signers.operator.address);
    expect(isApproved).to.be.true;
  });
  it("balanceOf", async () => {
    const provider = ethers.provider;
    const { collection1, collection3 } = contracts;

    // ERC721
    expect(await balanceOf(provider, collection1.address, signers.user1.address)).to.equal(NB_NFT_PER_USER);
    expect(await balanceOf(provider, collection1.address, signers.user3.address)).to.equal(0);

    // ERC1155
    expect(await balanceOf(provider, collection3.address, signers.user1.address, 0)).to.equal(0);
    expect(await balanceOf(provider, collection3.address, signers.user3.address, 0)).to.equal(10);
  });
  it("ownerOf", async () => {
    const provider = ethers.provider;
    const { collection1, collection2 } = contracts;

    expect(await ownerOf(provider, collection1.address, 0)).to.equal(signers.user1.address);
    expect(await ownerOf(provider, collection2.address, 0)).to.equal(signers.user2.address);
  });
});
