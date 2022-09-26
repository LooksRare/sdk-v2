import { expect } from "chai";
import { BigNumber } from "ethers";
import { setUpContracts, Mocks, getSigners, Signers } from "./helpers/setup";
import {
  cancelOrderNonces,
  cancelSubsetNonces,
  incrementBidAskNonces,
  viewUserBidAskNonces,
} from "../utils/calls/nonces";

describe("Nonces", () => {
  let contracts: Mocks;
  let signers: Signers;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
  });
  it("cancel a nonce", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await cancelOrderNonces(signers.user1, looksRareProtocol.address, [BigNumber.from(0)]);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
  });
  it("cancel several nonces", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await cancelOrderNonces(signers.user1, looksRareProtocol.address, [
      BigNumber.from(0),
      BigNumber.from(1),
    ]);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
  });
  it("cancel a subset nonce", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await cancelSubsetNonces(signers.user1, looksRareProtocol.address, [BigNumber.from(0)]);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
  });
  it("cancel several subset nonces", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await cancelSubsetNonces(signers.user1, looksRareProtocol.address, [
      BigNumber.from(0),
      BigNumber.from(1),
    ]);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
  });
  it("increment bid nonce", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await incrementBidAskNonces(signers.user1, looksRareProtocol.address, true, false);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
    const userNonces = await viewUserBidAskNonces(signers.user1, looksRareProtocol.address, signers.user1.address);
    expect(userNonces.bidNonce).to.be.equal(1);
    expect(userNonces.askNonce).to.be.equal(0);
  });
  it("increment ask nonce", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await incrementBidAskNonces(signers.user1, looksRareProtocol.address, false, true);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
    const userNonces = await viewUserBidAskNonces(signers.user1, looksRareProtocol.address, signers.user1.address);
    expect(userNonces.bidNonce).to.be.equal(0);
    expect(userNonces.askNonce).to.be.equal(1);
  });
  it("increment bid/ask nonces", async () => {
    const { looksRareProtocol } = contracts;
    const transaction = await incrementBidAskNonces(signers.user1, looksRareProtocol.address, true, true);
    const receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
    const userNonces = await viewUserBidAskNonces(signers.user1, looksRareProtocol.address, signers.user1.address);
    expect(userNonces.bidNonce).to.be.equal(1);
    expect(userNonces.askNonce).to.be.equal(1);
  });
});
