import { expect } from "chai";
import { utils } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { setUpContracts, SetupMocks, getSigners, Signers } from "./helpers/setup";
import { computeDigestMaker, getDomainSeparator } from "./helpers/eip712";
import { contractName, version, getMakerHash } from "../constants/eip712";
import { SupportedChainId, Maker, CollectionType, QuoteType } from "../types";

describe("EIP-712", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let domain: TypedDataDomain;
  let makerAskOrder: Maker;

  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();

    domain = {
      name: contractName,
      version: version.toString(),
      chainId: SupportedChainId.HARDHAT,
      verifyingContract: mocks.addresses.EXCHANGE_V2,
    };

    makerAskOrder = {
      quoteType: QuoteType.Ask,
      globalNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      collectionType: CollectionType.ERC721,
      orderNonce: 1,
      collection: mocks.contracts.collectionERC721.address,
      currency: mocks.addresses.WETH,
      signer: signers.user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      price: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: utils.defaultAbiCoder.encode([], []),
    };
  });
  it("validate domain data", async () => {
    const { verifier } = mocks.contracts;
    const domainSc = await verifier.getDomainSeparator();
    const domainJs = getDomainSeparator(domain);
    expect(domainSc === domainJs);
  });
  it("validate maker order digest", async () => {
    const { verifier } = mocks.contracts;
    const digestSc = await verifier.computeMakerDigest(makerAskOrder);
    const digestJs = computeDigestMaker(domain, makerAskOrder);
    expect(digestSc === digestJs);
  });
  it("validate maker ask order hash", async () => {
    const { verifier } = mocks.contracts;
    const orderHashSc = await verifier.getMakerHash(makerAskOrder);
    const orderHashJs = getMakerHash(makerAskOrder);
    expect(orderHashSc).to.equal(orderHashJs);
  });
  it("validate maker bid order hash", async () => {
    const makerBid: Maker = {
      ...makerAskOrder,
      quoteType: QuoteType.Bid,
    };

    const { verifier } = mocks.contracts;
    const orderHashSc = await verifier.getMakerHash(makerBid);
    const orderHashJs = getMakerHash(makerBid);
    expect(orderHashSc).to.equal(orderHashJs);
  });
});
