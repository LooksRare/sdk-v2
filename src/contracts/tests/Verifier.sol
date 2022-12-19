// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "contracts-exchange-v2/contracts/LooksRareProtocol.sol";
import "contracts-exchange-v2/contracts/helpers/ProtocolHelpers.sol";
import "hardhat/console.sol";

contract Verifier is ProtocolHelpers {
    using OrderStructs for OrderStructs.MakerAsk;
    using OrderStructs for OrderStructs.MakerBid;
    using OrderStructs for OrderStructs.MerkleTree;
    using OrderStructs for bytes32;

    constructor(address _looksRareProtocol) ProtocolHelpers(_looksRareProtocol) {}

    function getDomainSeparator() public view returns (bytes32) {
        bytes32 domainSeparator = looksRareProtocol.domainSeparator();
        return domainSeparator;
    }

    function getMakerAskHash(OrderStructs.MakerAsk memory makerAsk) public pure returns (bytes32 orderHash) {
        return makerAsk.hash();
    }

    function getMakerBidHash(OrderStructs.MakerBid memory makerBid) public pure returns (bytes32 orderHash) {
        return makerBid.hash();
    }

    function getMerkleTreeHash(OrderStructs.MerkleTree memory merkleTree) public pure returns (bytes32 orderHash) {
        return merkleTree.hash();
    }

    function verifyAskOrders(OrderStructs.MakerAsk calldata makerAsk, bytes calldata signature) external view {
        verifyMakerAskOrder(makerAsk, signature, makerAsk.signer);
    }

    function verifyBidOrders(OrderStructs.MakerBid calldata makerBid, bytes calldata signature) external view {
        verifyMakerBidOrder(makerBid, signature, makerBid.signer);
    }

    function verifyMerkleTreeOrders(
        OrderStructs.MerkleTree calldata merkleTree,
        bytes calldata signature,
        address signer
    ) external view {
        verifyMerkleTree(merkleTree, signature, signer);
    }
}
