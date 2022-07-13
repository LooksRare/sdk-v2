// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "@rari-capital/solmate/src/tokens/ERC20.sol";

contract MockERC20 is ERC20("MockERC20", "MockERC20", 18) {
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
