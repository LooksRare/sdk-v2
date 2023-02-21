// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "solmate/src/tokens/ERC721.sol";

contract MockERC721 is ERC721 {
    uint256 public currentTokenId;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        currentTokenId = 0;
    }

    function mint(address to) public {
        _mint(to, currentTokenId++);
    }

    function tokenURI(uint256) public pure override returns (string memory) {
        return "tokenURI";
    }
}
