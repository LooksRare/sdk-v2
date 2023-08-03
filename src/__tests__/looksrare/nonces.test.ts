import { expect } from "chai";
import { ethers } from "hardhat";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { viewUserBidAskNonces } from "../../utils/calls/nonces";
import { LooksRare } from "../../LooksRare";
import { ChainId } from "../../types";

describe("Nonces and order cancellation", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let lrUser1: LooksRare;

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();
    lrUser1 = new LooksRare(ChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
  });

  describe("cancelOrders", () => {
    it("cancel a nonce", async () => {
      const tx = await lrUser1.cancelOrders([0]).call();
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);
    });

    it("cancel several nonces", async () => {
      const tx = await lrUser1.cancelOrders([0, 1]).call();
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);
    });

    it("method analysis", async () => {
      const contractMethods = lrUser1.cancelOrders([0, 1]);
      const estimatedGas = await contractMethods.estimateGas();
      expect(Number(estimatedGas)).to.be.greaterThan(0);
      await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;
    });
  });

  describe("cancelSubsetOrders", () => {
    it("cancel a subset nonce", async () => {
      const tx = await lrUser1.cancelSubsetOrders([0]).call();
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);
    });

    it("cancel several subset nonces", async () => {
      const tx = await lrUser1.cancelSubsetOrders([0, 1]).call();
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);
    });

    it("method analysis", async () => {
      const contractMethods = lrUser1.cancelSubsetOrders([0, 1]);
      const estimatedGas = await contractMethods.estimateGas();
      expect(Number(estimatedGas)).to.be.greaterThan(0);
      await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;
    });
  });

  describe("cancelAllOrders", () => {
    it("increment bid nonce", async () => {
      const tx = await lrUser1.cancelAllOrders(true, false).call();
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);

      const userNonces = await viewUserBidAskNonces(signers.user1, mocks.addresses.EXCHANGE_V2, signers.user1.address);
      expect(userNonces.bidNonce > 0n).to.be.true;
      expect(userNonces.askNonce).to.be.eq(0n);
    });

    it("increment ask nonce", async () => {
      const tx = await lrUser1.cancelAllOrders(false, true).call();
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);

      const userNonces = await viewUserBidAskNonces(signers.user1, mocks.addresses.EXCHANGE_V2, signers.user1.address);
      expect(userNonces.bidNonce).to.be.eq(0n);
      expect(userNonces.askNonce > 0n).to.be.true;
    });

    it("increment bid/ask nonces", async () => {
      const tx = await lrUser1.cancelAllOrders(true, true).call();
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);

      const userNonces = await viewUserBidAskNonces(signers.user1, mocks.addresses.EXCHANGE_V2, signers.user1.address);
      expect(userNonces.bidNonce > 0n).to.be.true;
      expect(userNonces.askNonce > 0n).to.be.true;
    });

    it("method analysis", async () => {
      const contractMethods = lrUser1.cancelAllOrders(true, true);
      const estimatedGas = await lrUser1.cancelAllOrders(true, true).estimateGas();
      expect(Number(estimatedGas)).to.be.greaterThan(0);
      await expect(contractMethods.callStatic()).to.eventually.be.fulfilled;
    });
  });
});
