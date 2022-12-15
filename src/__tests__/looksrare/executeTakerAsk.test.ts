import { expect } from "chai";
import { constants, utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, Mocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { Addresses } from "../../constants/addresses";
import { setApprovalForAll } from "../../utils/calls/tokens";
import { SupportedChainId, AssetType, StrategyType, MakerAskInputs } from "../../types";

describe("execute taker ask", () => {
  let contracts: Mocks;
  let signers: Signers;
  let baseMakerAskInput: MakerAskInputs;
  let addresses: Addresses;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();

    {
      const tx = await contracts.weth.mint(signers.user2.address, utils.parseEther("10"));
      await tx.wait();
    }

    {
      const tx = await contracts.transferManager
        .connect(signers.user1)
        .grantApprovals([contracts.looksRareProtocol.address]);
      await tx.wait();
    }

    addresses = {
      EXCHANGE: contracts.looksRareProtocol.address,
      LOOKS: constants.AddressZero,
      TRANSFER_MANAGER: contracts.transferManager.address,
      WETH: contracts.weth.address,
    };
    baseMakerAskInput = {
      collection: contracts.collection1.address,
      assetType: AssetType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [1],
    };
  });
  it("execute maker bid and taker ask", async () => {
    const lrUser1 = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const lrUser2 = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user2, addresses);
    const { order, action } = await lrUser2.createMakerBid(baseMakerAskInput);
    await action!();
    const signature = await lrUser2.signMakerBid(order);

    await setApprovalForAll(signers.user1, order.collection, lrUser1.addresses.TRANSFER_MANAGER);
    const takerBid = lrUser1.createTakerAsk(order, signers.user2.address);
    const tx = await lrUser1.executeTakerAsk(order, takerBid, signature).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
});
