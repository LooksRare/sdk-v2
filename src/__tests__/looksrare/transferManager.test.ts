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
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);

    {
      const tx = await lr.grantTransferManagerApproval().call();
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    }

    {
      const tx = await lr.revokeTransferManagerApproval().call();
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    }
  });
});
