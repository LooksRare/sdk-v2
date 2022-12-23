import { expect } from "chai";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { SupportedChainId } from "../../types";

describe("LooksRare class", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });
  it("instanciate LooksRare object with a signer", () => {
    expect(new LooksRare(ethers.provider, 1, signers.user1).chainId).to.equal(1);
    expect(new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1).chainId).to.equal(
      SupportedChainId.HARDHAT
    );
  });
  it("instanciate LooksRare object with a signer and override addresses", () => {
    const { addresses } = mocks;
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    expect(lr.addresses).to.be.eql(addresses);
  });
  it("instanciate LooksRare object without a signer and reject a contract call", async () => {
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT);
    expect(lr.getTypedDataDomain().chainId).to.be.eql(SupportedChainId.HARDHAT);
    expect(() => lr.cancelAllOrders(true, true)).to.throw(lr.ERROR_SIGNER);
  });
});
