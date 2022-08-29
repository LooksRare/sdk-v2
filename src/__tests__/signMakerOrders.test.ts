import { expect } from "chai";
import { utils } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { setUpContracts, Mocks, getSigners, Signers } from "./helpers/setup";
import { contractName, version, makerBidOrdersTypes } from "../constants/eip712";
import { signMakerOrders } from "../utils/signMakerOrders";
import { SupportedChainId, MultipleMakerBidOrders, MultipleMakerBidOrdersWithSignature, AssetType } from "../types";

describe("SignMakerOrders", () => {
  let contracts: Mocks;
  let signers: Signers;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
  });
  it("sign maker order", async () => {
    const { looksRareProtocol, collection1, weth, verifier } = contracts;
    const { user1 } = signers;

    const domain: TypedDataDomain = {
      name: contractName,
      version: version.toString(),
      chainId: SupportedChainId.HARDHAT,
      verifyingContract: looksRareProtocol.address,
    };
    const makerOrder: MultipleMakerBidOrders = {
      baseMakerOrder: {
        bidAskNonce: 0,
        subsetNonce: 0,
        strategyId: 0,
        assetType: AssetType.ERC721,
        collection: collection1.address,
        currency: weth.address,
        recipient: user1.address,
        signer: user1.address,
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000 + 3600),
        minNetRatio: 8500,
      },
      makerBidOrders: [
        {
          maxPrice: utils.parseEther("1").toString(),
          itemIds: [0],
          amounts: [1],
          orderNonce: 0,
          additionalParameters: [],
        },
      ],
    };

    const signature = await signMakerOrders(user1, domain, makerBidOrdersTypes, makerOrder);
    expect(utils.verifyTypedData(domain, makerBidOrdersTypes, makerOrder, signature)).to.equal(user1.address);

    const faultyOrderWithSig: MultipleMakerBidOrdersWithSignature = {
      ...makerOrder,
      signature,
    };
    await expect(verifier.verifyBidOrders(faultyOrderWithSig)).to.eventually.be.rejectedWith("call revert exception");

    const orderWithSig: MultipleMakerBidOrdersWithSignature = {
      ...makerOrder,
      signature,
    };
    await expect(verifier.verifyBidOrders(orderWithSig)).to.eventually.be.fulfilled;
  });
});
