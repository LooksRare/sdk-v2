import { expect } from "chai";
import { constants } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, Mocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { Addresses } from "../../constants/addresses";
import { SupportedChainId } from "../../types";

describe("LooksRare class", () => {
  let contracts: Mocks;
  let signers: Signers;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
  });
  it("instanciate LooksRare object with a signer", () => {
    expect(new LooksRare(ethers.provider, 1, signers.user1).chainId).to.equal(1);
    expect(new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1).chainId).to.equal(
      SupportedChainId.HARDHAT
    );
    const addresses: Addresses = {
      EXCHANGE: contracts.looksRareProtocol.address,
      LOOKS: constants.AddressZero,
      TRANSFER_MANAGER: contracts.transferManager.address,
      WETH: contracts.weth.address,
    };
    expect(new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses).addresses).to.be.eql(
      addresses
    );
  });
  it("instanciate LooksRare object without a signer", async () => {
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT);
    expect(lr.getTypedDataDomain().chainId).to.be.eql(SupportedChainId.HARDHAT);
    await expect(lr.cancelAllOrders(true, true)).to.eventually.be.rejected;
  });
});
