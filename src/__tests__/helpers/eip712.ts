import { utils } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { MakerAsk } from "../../types";

export const getMakerOrderHash = (makerOrder: MakerAsk) => {
  const jsDigest = utils.keccak256(
    utils.defaultAbiCoder.encode(
      [
        "bytes32",
        "uint112",
        "uint112",
        "uint16",
        "uint8",
        "uint112",
        "uint16",
        "address",
        "address",
        "address",
        "address",
        "uint256",
        "uint256",
        "uint256",
        "bytes32",
        "bytes32",
        "bytes32",
      ],
      [
        "0x85fa30b2b848c94bd5f5b88383658126eb3a69201d0b539f4bf956996bdb6af1",
        makerOrder.askNonce,
        makerOrder.subsetNonce,
        makerOrder.strategyId,
        makerOrder.assetType,
        makerOrder.orderNonce,
        makerOrder.minNetRatio,
        makerOrder.collection,
        makerOrder.currency,
        makerOrder.recipient,
        makerOrder.signer,
        makerOrder.startTime,
        makerOrder.endTime,
        makerOrder.minPrice,
        utils.keccak256(utils.solidityPack(["uint256[]"], [makerOrder.itemIds])),
        utils.keccak256(utils.solidityPack(["uint256[]"], [makerOrder.amounts])),
        utils.keccak256(makerOrder.additionalParameters),
      ]
    )
  );
  return jsDigest;
};

export const getDomainSeparator = (domain: TypedDataDomain) => {
  return utils.keccak256(
    utils.defaultAbiCoder.encode(
      ["bytes32", "bytes32", "bytes32", "uint256", "address"],
      [
        utils.keccak256(
          utils.toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")
        ),
        utils.keccak256(utils.toUtf8Bytes(domain.name!)),
        utils.keccak256(utils.toUtf8Bytes(domain.version!)),
        domain.chainId!,
        domain.verifyingContract!,
      ]
    )
  );
};

export const computeDigestMakerAsk = (domain: TypedDataDomain, makerOrder: MakerAsk) => {
  const domainSeparator = getDomainSeparator(domain);
  const hash = getMakerOrderHash(makerOrder);
  return utils.keccak256(utils.solidityPack(["string", "bytes32", "bytes32"], ["\x19\x01", domainSeparator, hash]));
};
