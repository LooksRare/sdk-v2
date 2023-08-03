import { expect } from "chai";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "./helpers/setup";
import { isApprovedForAll, setApprovalForAll } from "../utils/calls/tokens";

describe("Tokens", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });
  it("approve ERC721", async () => {
    const provider = ethers.provider;
    const { collectionERC721 } = mocks.contracts;
    const collectionERC721Address = await collectionERC721.getAddress();

    let isApproved = await isApprovedForAll(
      provider,
      collectionERC721Address,
      signers.user1.address,
      signers.operator.address
    );
    expect(isApproved).to.be.false;

    // Approve
    let transaction = await setApprovalForAll(signers.user1, collectionERC721Address, signers.operator.address, true);
    let receipt = await transaction.wait();
    expect(receipt?.status).to.equal(1);

    isApproved = await isApprovedForAll(
      provider,
      collectionERC721Address,
      signers.user1.address,
      signers.operator.address
    );
    expect(isApproved).to.be.true;

    // Cancel approval
    transaction = await setApprovalForAll(signers.user1, collectionERC721Address, signers.operator.address, false);
    receipt = await transaction.wait();
    expect(receipt?.status).to.equal(1);

    isApproved = await isApprovedForAll(
      provider,
      collectionERC721Address,
      signers.user1.address,
      signers.operator.address
    );
    expect(isApproved).to.be.false;
  });
  it("approve ERC1155", async () => {
    const provider = ethers.provider;
    const { collectionERC1155 } = mocks.contracts;
    const collectionERC1155Address = await collectionERC1155.getAddress();

    let isApproved = await isApprovedForAll(
      provider,
      collectionERC1155Address,
      signers.user2.address,
      signers.operator.address
    );
    expect(isApproved).to.be.false;

    const transaction = await setApprovalForAll(
      signers.user2,
      collectionERC1155Address,
      signers.operator.address,
      true
    );
    const receipt = await transaction.wait();
    expect(receipt?.status).to.equal(1);

    isApproved = await isApprovedForAll(
      provider,
      collectionERC1155Address,
      signers.user2.address,
      signers.operator.address
    );
    expect(isApproved).to.be.true;
  });
});
