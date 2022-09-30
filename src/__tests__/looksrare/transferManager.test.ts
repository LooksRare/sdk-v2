import { expect } from "chai";
import { constants } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, Mocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { setApprovalForAll, ownerOf, balanceOf } from "../../utils/calls/tokens";
import { Addresses } from "../../constants/addresses";
import { SupportedChainId, AssetType } from "../../types";

describe("Transfer manager", () => {
  let contracts: Mocks;
  let signers: Signers;
  let addresses: Addresses;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
    addresses = {
      EXCHANGE: contracts.looksRareProtocol.address,
      LOOKS: constants.AddressZero,
      TRANSFER_MANAGER: contracts.transferManager.address,
      WETH: contracts.weth.address,
    };
  });
  it("grant and revoke operator approvals", async () => {
    const lr = new LooksRare(signers.user1, ethers.provider, SupportedChainId.HARDHAT, addresses);

    let receipt = await lr.grantTransferManagerApproval();
    expect(receipt.status).to.equal(1);

    receipt = await lr.revokeTransferManagerApproval();
    expect(receipt.status).to.equal(1);
  });
  it("transfer batch items from the same ERC721 collection", async () => {
    const from = signers.user1.address;
    const to = signers.user2.address;
    const collection = contracts.collection1.address;
    const lr = new LooksRare(signers.user1, ethers.provider, SupportedChainId.HARDHAT, addresses);
    await lr.grantTransferManagerApproval();
    await setApprovalForAll(signers.user1, collection, contracts.transferManager.address);

    await lr.transferItemsFromSameCollection(collection, AssetType.ERC721, from, to, [0, 1], [1, 1]);

    const owner = await Promise.all([ownerOf(signers.user1, collection, 0), ownerOf(signers.user1, collection, 1)]);
    expect(owner[0]).to.equal(to);
    expect(owner[1]).to.equal(to);
  });
  it("transfer batch items from the same ERC1155 collection", async () => {
    const from = signers.user2.address;
    const to = signers.user1.address;
    const collection = contracts.collection2.address;
    const lr = new LooksRare(signers.user2, ethers.provider, SupportedChainId.HARDHAT, addresses);
    await lr.grantTransferManagerApproval();
    await setApprovalForAll(signers.user2, collection, contracts.transferManager.address);

    await lr.transferItemsFromSameCollection(collection, AssetType.ERC1155, from, to, [0, 1], [1, 2]);

    const balanceTokenID0 = await Promise.all([
      balanceOf(ethers.provider, collection, from, 0),
      balanceOf(ethers.provider, collection, to, 0),
    ]);
    expect(balanceTokenID0[0]).to.equal(9);
    expect(balanceTokenID0[1]).to.equal(1);

    const balanceTokenID1 = await Promise.all([
      balanceOf(signers.user1, collection, from, 1),
      balanceOf(signers.user2, collection, to, 1),
    ]);
    expect(balanceTokenID1[0]).to.equal(8);
    expect(balanceTokenID1[1]).to.equal(2);
  });
});
