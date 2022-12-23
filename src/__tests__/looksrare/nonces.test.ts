import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { viewUserBidAskNonces } from "../../utils/calls/nonces";
import { LooksRare } from "../../LooksRare";
import { SupportedChainId } from "../../types";

describe("Nonces and order cancellation", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
  });
  describe("cancelOrders", () => {
    it("cancel a nonce", async () => {
      const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
      const tx = await lr.cancelOrders([BigNumber.from(0)]).call();
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });
    it("cancel several nonces", async () => {
      const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
      const tx = await lr.cancelOrders([BigNumber.from(0), BigNumber.from(1)]).call();
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });
    it("estimate gas", async () => {
      const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
      const estimatedGas = await lr.cancelOrders([BigNumber.from(0), BigNumber.from(1)]).estimateGas();
      expect(estimatedGas.toNumber()).to.be.greaterThan(0);
    });
  });
  describe("cancelSubsetOrders", () => {
    it("cancel a subset nonce", async () => {
      const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
      const tx = await lr.cancelSubsetOrders([BigNumber.from(0)]).call();
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });
    it("cancel several subset nonces", async () => {
      const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
      const tx = await lr.cancelSubsetOrders([BigNumber.from(0), BigNumber.from(1)]).call();
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });
    it("estimate gas", async () => {
      const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
      const estimatedGas = await lr.cancelSubsetOrders([BigNumber.from(0), BigNumber.from(1)]).estimateGas();
      expect(estimatedGas.toNumber()).to.be.greaterThan(0);
    });
  });
  describe("cancelAllOrders", () => {
    it("increment bid nonce", async () => {
      const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
      const tx = await lr.cancelAllOrders(true, false).call();
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      const userNonces = await viewUserBidAskNonces(signers.user1, mocks.addresses.EXCHANGE, signers.user1.address);
      expect(userNonces.bidNonce).to.be.equal(1);
      expect(userNonces.askNonce).to.be.equal(0);
    });
    it("increment ask nonce", async () => {
      const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
      const tx = await lr.cancelAllOrders(false, true).call();
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      const userNonces = await viewUserBidAskNonces(signers.user1, mocks.addresses.EXCHANGE, signers.user1.address);
      expect(userNonces.bidNonce).to.be.equal(0);
      expect(userNonces.askNonce).to.be.equal(1);
    });
    it("increment bid/ask nonces", async () => {
      const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
      const tx = await lr.cancelAllOrders(true, true).call();
      const receipt = await tx.wait();

      expect(receipt.status).to.equal(1);
      const userNonces = await viewUserBidAskNonces(signers.user1, mocks.addresses.EXCHANGE, signers.user1.address);
      expect(userNonces.bidNonce).to.be.equal(1);
      expect(userNonces.askNonce).to.be.equal(1);
    });
    it("estimate gas", async () => {
      const lr = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, mocks.addresses);
      const estimatedGas = await lr.cancelAllOrders(true, true).estimateGas();
      expect(estimatedGas.toNumber()).to.be.greaterThan(0);
    });
  });
});
