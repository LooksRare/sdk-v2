import { expect } from "chai";
import { constants } from "ethers";
import { setUpContracts, Mocks } from "./helpers/setup";
import { LooksRare } from "../LooksRare";
import { SupportedChainId } from "../types";
import { Addresses } from "../constants/addresses";

describe("LooksRare class", () => {
  let contracts: Mocks;
  beforeEach(async () => {
    contracts = await setUpContracts();
  });
  it("instanciate LooksRare object", () => {
    expect(new LooksRare(1).chainId).to.equal(1);
    expect(new LooksRare(SupportedChainId.HARDHAT).chainId).to.equal(SupportedChainId.HARDHAT);
    const addresses: Addresses = {
      EXCHANGE: contracts.looksRareProtocol.address,
      LOOKS: constants.AddressZero,
      TRANSFER_MANAGER: contracts.transferManager.address,
    };
    expect(new LooksRare(SupportedChainId.HARDHAT, addresses).addresses).to.be.eql(addresses);
  });
});
