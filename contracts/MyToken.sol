// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, ERC20Burnable, ERC20Capped, Ownable {

    constructor(address initialOwner)
        ERC20("MyToken", "MTK")
        ERC20Capped(1_000_000 * 10 ** 18)
        Ownable(initialOwner)
    {
        _mint(initialOwner, 100_000 * 10 ** 18);  // 초기 발행
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);  // ERC20Capped가 최대 발행량을 자동 체크
    }

    // ERC20Burnable과 ERC20Capped 모두 _update를 override하므로
    // 명시적으로 해결
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped)
    {
        super._update(from, to, value);
    }
}
