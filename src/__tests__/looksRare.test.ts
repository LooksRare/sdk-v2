import { expect } from "chai";
import { constants } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, Mocks, getSigners, Signers } from "./helpers/setup";
import { LooksRare } from "../LooksRare";
import { SupportedChainId } from "../types";
import { Addresses } from "../constants/addresses";

describe("LooksRare class", () => {
  let contracts: Mocks;
  let signers: Signers;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
  });
  it("instanciate LooksRare object", () => {
    const provider = signers.user1.provider || ethers.provider;
    expect(new LooksRare(signers.user1, provider, 1).chainId).to.equal(1);
    expect(new LooksRare(signers.user1, provider, SupportedChainId.HARDHAT).chainId).to.equal(SupportedChainId.HARDHAT);
    const addresses: Addresses = {
      EXCHANGE: contracts.looksRareProtocol.address,
      LOOKS: constants.AddressZero,
      TRANSFER_MANAGER: contracts.transferManager.address,
      WETH: constants.AddressZero,
    };
    expect(new LooksRare(signers.user1, provider, SupportedChainId.HARDHAT, addresses).addresses).to.be.eql(addresses);
  });
});
