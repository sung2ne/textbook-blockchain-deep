// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HelloToken is ERC20 {
    constructor() ERC20("HelloToken", "HLO") {
        _mint(msg.sender, 100 * 10 ** decimals());
    }
}
