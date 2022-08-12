// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "contracts-exchange-v2/contracts/LooksRareProtocol.sol";

contract Verifier is SignatureChecker {
    using OrderStructs for OrderStructs.MultipleMakerAskOrders;
    using OrderStructs for OrderStructs.MultipleMakerBidOrders;
    LooksRareProtocol public immutable looksRareProtocol;

    constructor(address _looksRareProtocol) {
        looksRareProtocol = LooksRareProtocol(_looksRareProtocol);
    }

    function verifyAskOrders(OrderStructs.MultipleMakerAskOrders calldata multipleMakerAsk) external view {
        (, , bytes32 currentDomainSeparator, ) = looksRareProtocol.information();
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", currentDomainSeparator, multipleMakerAsk.hash()));
        _verify(digest, multipleMakerAsk.baseMakerOrder.signer, multipleMakerAsk.signature);
    }

    function verifyBidOrders(OrderStructs.MultipleMakerBidOrders calldata multipleMakerBid) external view {
        (, , bytes32 currentDomainSeparator, ) = looksRareProtocol.information();
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", currentDomainSeparator, multipleMakerBid.hash()));
        _verify(digest, multipleMakerBid.baseMakerOrder.signer, multipleMakerBid.signature);
    }
}
