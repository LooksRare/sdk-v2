// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "contracts-exchange-v2/contracts/LooksRareProtocol.sol";
import "contracts-exchange-v2/contracts/LooksRareProtocolHelpers.sol";
import "hardhat/console.sol";

contract Verifier is LooksRareProtocolHelpers {
    using OrderStructs for OrderStructs.MakerAsk;
    using OrderStructs for OrderStructs.MakerBid;
    using OrderStructs for bytes32;

    constructor(address _looksRareProtocol) LooksRareProtocolHelpers(_looksRareProtocol) {}

    function getMakerAskHash(OrderStructs.MakerAsk memory makerAsk) public pure returns (bytes32 orderHash) {
        return makerAsk.hash();
    }

    function getMakerBidHash(OrderStructs.MakerBid memory makerBid) public pure returns (bytes32 orderHash) {
        return makerBid.hash();
    }

    function getDomainSeparator() public view returns (bytes32) {
        (, , bytes32 domainSeparator, ) = looksRareProtocol.information();
        return domainSeparator;
    }

    function verifyAskOrders(OrderStructs.MakerAsk calldata makerAsk, bytes calldata signature) external view {
        bytes32 digest = computeDigestMakerAsk(makerAsk);
        _verify(digest, makerAsk.signer, signature);
    }

    function verifyBidOrders(OrderStructs.MakerBid calldata makerBid, bytes calldata signature) external view {
        bytes32 digest = computeDigestMakerBid(makerBid);
        _verify(digest, makerBid.signer, signature);
    }
}
