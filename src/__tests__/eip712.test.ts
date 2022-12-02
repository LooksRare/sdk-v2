import { expect } from "chai";
import { utils } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { setUpContracts, Mocks, getSigners, Signers } from "./helpers/setup";
import { computeDigestMakerAsk, getDomainSeparator } from "./helpers/eip712";
import { contractName, version } from "../constants/eip712";
import { SupportedChainId, MakerAsk, AssetType } from "../types";

describe("EIP-712", () => {
  let contracts: Mocks;
  let signers: Signers;
  let domain: TypedDataDomain;
  let makerOrder: MakerAsk;

  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();

    domain = {
      name: contractName,
      version: version.toString(),
      chainId: SupportedChainId.HARDHAT,
      verifyingContract: contracts.looksRareProtocol.address,
    };

    makerOrder = {
      askNonce: 1,
      subsetNonce: 1,
      strategyId: 1,
      assetType: AssetType.ERC721,
      orderNonce: 1,
      collection: contracts.collection1.address,
      currency: contracts.weth.address,
      signer: signers.user1.address,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000 + 3600),
      minPrice: utils.parseEther("1").toString(),
      itemIds: [1],
      amounts: [1],
      additionalParameters: utils.defaultAbiCoder.encode([], []),
    };
  });
  it("validate domain data", async () => {
    const { verifier } = contracts;
    const domainSc = await verifier.getDomainSeparator();
    const domainJs = getDomainSeparator(domain);
    expect(domainSc === domainJs);
  });
  it("validate maker order digest", async () => {
    const { verifier } = contracts;
    const digestSc = await verifier.computeDigestMakerAsk(makerOrder);
    const digestJs = computeDigestMakerAsk(domain, makerOrder);
    expect(digestSc === digestJs);
  });
});
