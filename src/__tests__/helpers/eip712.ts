import { utils } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { MakerAsk } from "../../types";

// Emulate contract cryptographic functions using JS. Used for testing purpose.

/**
 * Emulate the EIP-712 domain separator computation
 * @external LooksRareProtocol constructor
 * @param domain
 * @returns string (bytes32)
 */
export const getDomainSeparator = (domain: TypedDataDomain): string => {
  const types = ["bytes32", "bytes32", "bytes32", "uint256", "address"];
  const values = [
    utils.keccak256(
      utils.toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")
    ),
    utils.keccak256(utils.toUtf8Bytes(domain.name!)),
    utils.keccak256(utils.toUtf8Bytes(domain.version!)),
    domain.chainId!,
    domain.verifyingContract!,
  ];
  return utils.keccak256(utils.defaultAbiCoder.encode(types, values));
};

/**
 * Emulate maker order hashing
 * @external OrderStruct hash function
 * @param makerOrder
 * @returns string (bytes32)
 */
export const getMakerOrderHash = (makerOrder: MakerAsk): string => {
  const types = [
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
  ];
  const values = [
    "0x85fa30b2b848c94bd5f5b88383658126eb3a69201d0b539f4bf956996bdb6af1", // _MAKER_ASK_HASH in OrderStruct.sol
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
  ];
  return utils.keccak256(utils.defaultAbiCoder.encode(types, values));
};

/**
 * Emulate digest computation
 * @external LooksRareProtocol _computeDigestAndVerify function
 * @param domain
 * @param makerOrder
 * @returns string (bytes32)
 */
export const computeDigestMakerAsk = (domain: TypedDataDomain, makerOrder: MakerAsk): string => {
  const domainSeparator = getDomainSeparator(domain);
  const hash = getMakerOrderHash(makerOrder);
  return utils.keccak256(utils.solidityPack(["string", "bytes32", "bytes32"], ["\x19\x01", domainSeparator, hash]));
};
