import { expect } from "chai";
import { BigNumber, constants } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, Mocks, getSigners, Signers } from "../helpers/setup";
import { viewUserBidAskNonces } from "../../utils/calls/nonces";
import { LooksRare } from "../../LooksRare";
import { Addresses } from "../../constants/addresses";
import { SupportedChainId } from "../../types";

describe("Nonces and order cancellation", () => {
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
  it("cancel a nonce", async () => {
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const tx = await lr.cancelOrders([BigNumber.from(0)]).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
  it("cancel several nonces", async () => {
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const tx = await lr.cancelOrders([BigNumber.from(0), BigNumber.from(1)]).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
  it("cancel a subset nonce", async () => {
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const tx = await lr.cancelSubsetOrders([BigNumber.from(0)]).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
  it("cancel several subset nonces", async () => {
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const tx = await lr.cancelSubsetOrders([BigNumber.from(0), BigNumber.from(1)]).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
  it("increment bid nonce", async () => {
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const tx = await lr.cancelAllOrders(true, false).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);

    const userNonces = await viewUserBidAskNonces(
      signers.user1,
      contracts.looksRareProtocol.address,
      signers.user1.address
    );
    expect(userNonces.bidNonce).to.be.equal(1);
    expect(userNonces.askNonce).to.be.equal(0);
  });
  it("increment ask nonce", async () => {
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const tx = await lr.cancelAllOrders(false, true).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);

    const userNonces = await viewUserBidAskNonces(
      signers.user1,
      contracts.looksRareProtocol.address,
      signers.user1.address
    );
    expect(userNonces.bidNonce).to.be.equal(0);
    expect(userNonces.askNonce).to.be.equal(1);
  });
  it("increment bid/ask nonces", async () => {
    const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const tx = await lr.cancelAllOrders(true, true).call();
    const receipt = await tx.wait();

    expect(receipt.status).to.equal(1);
    const userNonces = await viewUserBidAskNonces(
      signers.user1,
      contracts.looksRareProtocol.address,
      signers.user1.address
    );
    expect(userNonces.bidNonce).to.be.equal(1);
    expect(userNonces.askNonce).to.be.equal(1);
  });
});
