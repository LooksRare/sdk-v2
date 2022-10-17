import { expect } from "chai";
import { constants } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, Mocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { Addresses } from "../../constants/addresses";
import { SupportedChainId } from "../../types";

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
});
