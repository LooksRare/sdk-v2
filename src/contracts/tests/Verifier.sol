// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "contracts-exchange-v2/contracts/LooksRareProtocol.sol";

import "hardhat/console.sol";

contract Verifier is SignatureChecker {
    using OrderStructs for OrderStructs.MakerAsk;
    using OrderStructs for OrderStructs.MakerBid;
    using OrderStructs for bytes32;

    LooksRareProtocol public immutable looksRareProtocol;

    string internal constant _ENCODING_PREFIX = "\x19\x01";

    constructor(address _looksRareProtocol) {
        looksRareProtocol = LooksRareProtocol(_looksRareProtocol);
    }

    function getMakerOrderHash(OrderStructs.MakerAsk memory makerAsk) public view returns (bytes32 orderHash) {
        return makerAsk.hash();
    }

    function getDomainSeparator() public view returns (bytes32) {
        (, , bytes32 domainSeparator, ) = looksRareProtocol.information();
        return domainSeparator;
    }

    function computeDigestMakerAsk(OrderStructs.MakerAsk memory makerAsk) public view returns (bytes32 digest) {
        (, , bytes32 domainSeparator, ) = looksRareProtocol.information();
        return keccak256(abi.encodePacked(_ENCODING_PREFIX, domainSeparator, makerAsk.hash()));
    }

    function verifyAskOrders(OrderStructs.MakerAsk calldata makerAsk, bytes calldata signature) external view {
        bytes32 digest = computeDigestMakerAsk(makerAsk);
        _verify(digest, makerAsk.signer, signature);
    }

    function verifyBidOrders(OrderStructs.MakerBid calldata makerBid, bytes calldata signature) external view {
        (, , bytes32 domainSeparator, ) = looksRareProtocol.information();
        bytes32 digest = keccak256(abi.encodePacked(_ENCODING_PREFIX, domainSeparator, makerBid.hash()));
        _verify(digest, makerBid.signer, signature);
    }
}
