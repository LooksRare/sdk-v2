import { expect } from "chai";
import { setUpContracts, Mocks, getSigners, Signers } from "./helpers/setup";
import { grantApprovals, revokeApprovals } from "../utils/transferManager";

describe("TransferManager", () => {
  let contracts: Mocks;
  let signers: Signers;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
    const transaction = await contracts.transferManager.whitelistOperator(signers.owner.address);
    await transaction.wait();
  });
  it("grant and revoke operator approvals", async () => {
    const { transferManager } = contracts;

    let transaction = await grantApprovals(signers.user1, transferManager.address, [signers.owner.address]);
    let receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);

    transaction = await revokeApprovals(signers.user1, transferManager.address, [signers.owner.address]);
    receipt = await transaction.wait();
    expect(receipt.status).to.equal(1);
  });
});
