import { expect } from "chai";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { ChainId } from "../../types";
import { ErrorSigner } from "../../errors";

describe("LooksRare class", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });
  it("instanciate LooksRare object with a signer", () => {
    expect(new LooksRare(1, ethers.provider, signers.user1).chainId).to.equal(1);
    expect(new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user1).chainId).to.equal(ChainId.HARDHAT);
  });
  it("instanciate LooksRare object with a signer and override addresses", () => {
    const { addresses } = mocks;
    const lr = new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user1, addresses);
    expect(lr.addresses).to.be.eql(addresses);
  });
  it("instanciate LooksRare object without a signer and reject a contract call", async () => {
    const lr = new LooksRare(ChainId.HARDHAT, ethers.provider);
    expect(lr.getTypedDataDomain().chainId).to.be.eql(ChainId.HARDHAT);
    expect(() => lr.cancelAllOrders(true, true)).to.throw(ErrorSigner);
  });
});
