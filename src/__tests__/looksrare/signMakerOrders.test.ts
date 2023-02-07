import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { LooksRare } from "../../LooksRare";
import { setUpContracts, SetupMocks, getSigners, Signers } from "../helpers/setup";
import { contractName, version, makerAskTypes, makerBidTypes, merkleTreeTypes } from "../../constants/eip712";
import { MAX_ORDERS_PER_TREE } from "../../constants";
import { encodeParams, getMakerParamsTypes, getTakerParamsTypes } from "../../utils/encodeOrderParams";
import { SupportedChainId, MakerAsk, MakerBid, AssetType, StrategyType, MerkleTree } from "../../types";

const faultySignature =
  "0xcafe829116da9a4b31a958aa790682228b85e5d03b1ae7bb15f8ce4c8432a20813934991833da8e913894c9f35f1f018948c58d68fb61bbca0e07bd43c4492fa2b";

describe("Sign maker orders", () => {
  let mocks: SetupMocks;
  let signers: Signers;
  let domain: TypedDataDomain;
  beforeEach(async () => {
    mocks = await setUpContracts();
    signers = await getSigners();

    domain = {
      name: contractName,
      version: version.toString(),
      chainId: SupportedChainId.HARDHAT,
      verifyingContract: mocks.addresses.EXCHANGE_V2,
    };
  });
  // describe("Sign single maker orders", () => {
  //   it("sign maker ask order", async () => {
  //     const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
  //     const { collection1, verifier } = mocks.contracts;

  //     const makerOrder: MakerAsk = {
  //       askNonce: 1,
  //       subsetNonce: 1,
  //       strategyId: 1,
  //       assetType: AssetType.ERC721,
  //       orderNonce: 1,
  //       collection: collection1.address,
  //       currency: mocks.addresses.WETH,
  //       signer: signers.user1.address,
  //       startTime: Math.floor(Date.now() / 1000),
  //       endTime: Math.floor(Date.now() / 1000 + 3600),
  //       minPrice: utils.parseEther("1").toString(),
  //       itemIds: [1],
  //       amounts: [1],
  //       additionalParameters: encodeParams([], getMakerParamsTypes(StrategyType.standard)),
  //     };

  //     const signature = await lr.signMakerAsk(makerOrder);

  //     expect(utils.verifyTypedData(domain, makerAskTypes, makerOrder, signature)).to.equal(signers.user1.address);
  //     await expect(verifier.verifyAskOrders(makerOrder, signature)).to.eventually.be.fulfilled;
  //     await expect(verifier.verifyAskOrders(makerOrder, faultySignature)).to.eventually.be.rejectedWith(
  //       "call revert exception"
  //     );
  //   });
  //   it("sign maker bid order", async () => {
  //     const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
  //     const { collection1, verifier } = mocks.contracts;

  //     const makerOrder: MakerBid = {
  //       bidNonce: 1,
  //       subsetNonce: 1,
  //       strategyId: 1,
  //       assetType: AssetType.ERC721,
  //       orderNonce: 1,
  //       collection: collection1.address,
  //       currency: mocks.addresses.WETH,
  //       signer: signers.user1.address,
  //       startTime: Math.floor(Date.now() / 1000),
  //       endTime: Math.floor(Date.now() / 1000 + 3600),
  //       maxPrice: utils.parseEther("1").toString(),
  //       itemIds: [1],
  //       amounts: [1],
  //       additionalParameters: encodeParams([], getTakerParamsTypes(StrategyType.standard)),
  //     };

  //     const signature = await lr.signMakerBid(makerOrder);

  //     expect(utils.verifyTypedData(domain, makerBidTypes, makerOrder, signature)).to.equal(signers.user1.address);
  //     await expect(verifier.verifyBidOrders(makerOrder, signature)).to.eventually.be.fulfilled;
  //     await expect(verifier.verifyBidOrders(makerOrder, faultySignature)).to.eventually.be.rejectedWith(
  //       "call revert exception"
  //     );
  //   });
  // });
  // describe("Sign multiple maker orders", () => {
  //   it("sign multiple maker bid order (merkle tree)", async () => {
  //     const { collection1, verifier } = mocks.contracts;
  //     const makerOrders: MakerBid[] = [
  //       {
  //         bidNonce: 1,
  //         subsetNonce: 1,
  //         strategyId: 1,
  //         assetType: AssetType.ERC721,
  //         orderNonce: 1,
  //         collection: collection1.address,
  //         currency: mocks.addresses.WETH,
  //         signer: signers.user1.address,
  //         startTime: Math.floor(Date.now() / 1000),
  //         endTime: Math.floor(Date.now() / 1000 + 3600),
  //         maxPrice: utils.parseEther("1").toString(),
  //         itemIds: [1],
  //         amounts: [1],
  //         additionalParameters: utils.defaultAbiCoder.encode([], []),
  //       },
  //       {
  //         bidNonce: 1,
  //         subsetNonce: 1,
  //         strategyId: 1,
  //         assetType: AssetType.ERC721,
  //         orderNonce: 1,
  //         collection: collection1.address,
  //         currency: mocks.addresses.WETH,
  //         signer: signers.user1.address,
  //         startTime: Math.floor(Date.now() / 1000),
  //         endTime: Math.floor(Date.now() / 1000 + 3600),
  //         maxPrice: utils.parseEther("1").toString(),
  //         itemIds: [1],
  //         amounts: [1],
  //         additionalParameters: utils.defaultAbiCoder.encode([], []),
  //       },
  //     ];
  //     const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);

  //     const { signature, root, orders } = await lr.signMultipleMakers(makerOrders);
  //     const merkleTree: MerkleTree = { root, proof: orders[0].proof };

  //     expect(utils.verifyTypedData(domain, merkleTreeTypes, merkleTree, signature)).to.equal(signers.user1.address);
  //     await expect(verifier.verifyMerkleTreeOrders(merkleTree, signature, signers.user1.address)).to.eventually.be
  //       .fulfilled;
  //     await expect(
  //       verifier.verifyMerkleTreeOrders(merkleTree, faultySignature, signers.user1.address)
  //     ).to.eventually.be.rejectedWith("call revert exception");
  //   });
  //   it("sign orders when number of orders = MAX_ORDERS_PER_TREE", async () => {
  //     const { collection1 } = mocks.contracts;
  //     const makerOrders: MakerBid[] = [...Array(MAX_ORDERS_PER_TREE)].map(() => ({
  //       bidNonce: 1,
  //       subsetNonce: 1,
  //       strategyId: 1,
  //       assetType: AssetType.ERC721,
  //       orderNonce: 1,
  //       collection: collection1.address,
  //       currency: mocks.addresses.WETH,
  //       signer: signers.user1.address,
  //       startTime: Math.floor(Date.now() / 1000),
  //       endTime: Math.floor(Date.now() / 1000 + 3600),
  //       maxPrice: utils.parseEther("1").toString(),
  //       itemIds: [1],
  //       amounts: [1],
  //       additionalParameters: utils.defaultAbiCoder.encode([], []),
  //     }));

  //     const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
  //     await expect(lr.signMultipleMakers(makerOrders)).to.eventually.be.fulfilled;
  //   });
  //   it("revert if number of orders > MAX_ORDERS_PER_TREE", async () => {
  //     const { collection1 } = mocks.contracts;
  //     const makerOrders: MakerBid[] = [...Array(MAX_ORDERS_PER_TREE + 1)].map(() => ({
  //       bidNonce: 1,
  //       subsetNonce: 1,
  //       strategyId: 1,
  //       assetType: AssetType.ERC721,
  //       orderNonce: 1,
  //       collection: collection1.address,
  //       currency: mocks.addresses.WETH,
  //       signer: signers.user1.address,
  //       startTime: Math.floor(Date.now() / 1000),
  //       endTime: Math.floor(Date.now() / 1000 + 3600),
  //       maxPrice: utils.parseEther("1").toString(),
  //       itemIds: [1],
  //       amounts: [1],
  //       additionalParameters: utils.defaultAbiCoder.encode([], []),
  //     }));

  //     const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
  //     await expect(lr.signMultipleMakers(makerOrders)).to.eventually.be.rejectedWith(lr.ERROR_MERKLE_TREE_DEPTH);
  //   });
  // });

  describe("Sign multiple maker ask orders", () => {
    it("sign multiple maker ask orders (merkle tree)", async () => {
      const { collection1, verifier } = mocks.contracts;
      const nft = "0x2c9e4b1a356dd6387b5ff6992cf55cc188e54402";
      const currency = "0x5f4e4ccff0a2553b2bde30e1fc8531b287db9087";
      const makerOrders: MakerAsk[] = [
        {
          askNonce: 0,
          subsetNonce: 0,
          strategyId: 0,
          assetType: AssetType.ERC721,
          orderNonce: 0,
          collection: nft,
          currency: currency,
          signer: signers.user1.address,
          startTime: 1675788113,
          endTime: 1677602513,
          minPrice: utils.parseEther("1").toString(),
          itemIds: [1],
          amounts: [1],
          additionalParameters: utils.defaultAbiCoder.encode([], []),
        },
        {
          askNonce: 0,
          subsetNonce: 0,
          strategyId: 0,
          assetType: AssetType.ERC721,
          orderNonce: 0,
          collection: nft,
          currency: currency,
          signer: signers.user1.address,
          startTime: 1675788113,
          endTime: 1677602513,
          minPrice: utils.parseEther("1").toString(),
          itemIds: [2],
          amounts: [1],
          additionalParameters: utils.defaultAbiCoder.encode([], []),
        },
      ];
      const lr = new LooksRare(SupportedChainId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);

      const { signature, root } = await lr.signMultipleMakersV2(makerOrders);
      console.log("root is ", root);
      console.log("signature is ", signature);
      // const merkleTree: MerkleTree = { root, proof: orders[0].proof };

      // expect(utils.verifyTypedData(domain, merkleTreeTypes, merkleTree, signature)).to.equal(signers.user1.address);
      // await expect(verifier.verifyMerkleTreeOrders(merkleTree, signature, signers.user1.address)).to.eventually.be
      //   .fulfilled;
      // await expect(
      //   verifier.verifyMerkleTreeOrders(merkleTree, faultySignature, signers.user1.address)
      // ).to.eventually.be.rejectedWith("call revert exception");
    });
  });
});
