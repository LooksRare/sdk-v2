import { expect } from "chai";
import { BigNumber } from "ethers";
import { setUpContracts, Mocks, getSigners, Signers } from "./helpers/setup";
import { cancelOrderNonces, cancelSubsetNonces, incrementBidAskNonces } from "../utils/nonces";

describe("nonces", () => {
  let contracts: Mocks;
  let signers: Signers;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
  });
  it("Cancel a nonce", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await cancelOrderNonces(signers.user1, looksRareProtocol.address, [BigNumber.from(0)]);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
  });
  it("Cancel several nonces", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await cancelOrderNonces(signers.user1, looksRareProtocol.address, [
      BigNumber.from(0),
      BigNumber.from(1),
    ]);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
  });
  it("Cancel a subset nonce", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await cancelSubsetNonces(signers.user1, looksRareProtocol.address, [BigNumber.from(0)]);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
  });
  it("Cancel several subset nonces", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await cancelSubsetNonces(signers.user1, looksRareProtocol.address, [
      BigNumber.from(0),
      BigNumber.from(1),
    ]);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
  });
  it("Increment bid nonce", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await incrementBidAskNonces(signers.user1, looksRareProtocol.address, true, false);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
  });
  it("Increment ask nonce", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await incrementBidAskNonces(signers.user1, looksRareProtocol.address, false, true);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
  });
  it("Increment bid/ask nonces", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await incrementBidAskNonces(signers.user1, looksRareProtocol.address, true, false);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
  });
});
