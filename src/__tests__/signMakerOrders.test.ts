import { expect } from "chai";
import { utils } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { setUpContracts, Mocks, getSigners, Signers } from "./helpers/setup";
import { contractName, version, makerBidOrdersTypes } from "../constants/eip712";
import { signMakerOrders } from "../utils/signMakerOrders";
import { SupportedChainId, MultipleMakerBidOrders, AssetType } from "../types";

describe.only("SignMakerOrders", () => {
  let contracts: Mocks;
  let signers: Signers;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();
  });
  it("sign maker order", async () => {
    const domain: TypedDataDomain = {
      name: contractName,
      version: version.toString(),
      chainId: SupportedChainId.HARDHAT,
      verifyingContract: contracts.looksRareProtocol.address,
    };
    const makerOrder: MultipleMakerBidOrders = {
      baseMakerOrder: {
        bidAskNonce: 0,
        subsetNonce: 0,
        strategyId: 0,
        assetType: AssetType.ERC721,
        collection: contracts.collection1.address,
        currency: contracts.weth.address,
        recipient: signers.user1.address,
        signer: signers.user1.address,
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

    const signature = await signMakerOrders(signers.user1, domain, makerBidOrdersTypes, makerOrder);
    expect(utils.verifyTypedData(domain, makerBidOrdersTypes, makerOrder, signature)).to.equal(signers.user1.address);

    // TODO Check signature validity with
    // - The contract helpers https://github.com/LooksRare/contracts-libs/blob/master/contracts/SignatureChecker.sol
  });
});
