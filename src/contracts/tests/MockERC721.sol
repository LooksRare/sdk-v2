// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "solmate/src/tokens/ERC721.sol";

contract MockERC721 is ERC721 {
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function tokenURI(uint256) public pure override returns (string memory) {
        return "tokenURI";
    }
}
