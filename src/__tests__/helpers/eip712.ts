import { utils } from "ethers";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { getMakerHash } from "../../constants/eip712";
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
  return utils.keccak256(utils.solidityPack(types, ["\x19\x01", domainSeparator, hash]));
};
