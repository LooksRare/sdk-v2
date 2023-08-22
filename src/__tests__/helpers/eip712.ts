import { AbiCoder, keccak256, solidityPackedKeccak256, toUtf8Bytes } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { getMakerHash } from "../../utils/eip712";
import { Maker, SolidityType } from "../../types";

// Emulate contract cryptographic functions using JS. Used for testing purpose.

/**
 * Emulate the EIP-712 domain separator computation
 * @external LooksRareProtocol constructor
 * @param domain
 * @returns string (bytes32)
 */
export const getDomainSeparator = (domain: TypedDataDomain): string => {
  const types: SolidityType[] = ["bytes32", "bytes32", "bytes32", "uint256", "address"];
  const values = [
    keccak256(toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")),
    keccak256(toUtf8Bytes(domain.name!)),
    keccak256(toUtf8Bytes(domain.version!)),
    domain.chainId!,
    domain.verifyingContract!,
  ];
  return keccak256(AbiCoder.defaultAbiCoder().encode(types, values));
};

/**
 * Emulate digest computation
 * @external LooksRareProtocol _computeDigestAndVerify function
 * @param domain
 * @param makerOrder
 * @returns string (bytes32)
 */
export const computeDigestMaker = (domain: TypedDataDomain, makerOrder: Maker): string => {
  const domainSeparator = getDomainSeparator(domain);
  const hash = getMakerHash(makerOrder);
  const types: SolidityType[] = ["string", "bytes32", "bytes32"];
  return solidityPackedKeccak256(types, ["\x19\x01", domainSeparator, hash]);
};
