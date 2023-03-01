// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@looksrare/contracts-exchange-v2/contracts/LooksRareProtocol.sol";
import "@looksrare/contracts-exchange-v2/contracts/helpers/ProtocolHelpers.sol";

contract Verifier is ProtocolHelpers {
    using OrderStructs for OrderStructs.Maker;
    using OrderStructs for OrderStructs.MerkleTree;
    using OrderStructs for bytes32;

    constructor(address _looksRareProtocol) ProtocolHelpers(_looksRareProtocol) {}

    function getDomainSeparator() public view returns (bytes32) {
        bytes32 domainSeparator = looksRareProtocol.domainSeparator();
        return domainSeparator;
    }

    function getMakerHash(OrderStructs.Maker memory maker) public pure returns (bytes32 orderHash) {
        return maker.hash();
    }

    function verifySignature(OrderStructs.Maker calldata maker, bytes calldata signature) external view {
        verifyMakerSignature(maker, signature, maker.signer);
    }
}
