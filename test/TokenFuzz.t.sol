// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../contracts/MyToken.sol";

contract TokenFuzzTest is Test {
    MyToken token;

    function setUp() public {
        token = new MyToken();
        token.mint(address(this), 1_000_000e18);
    }

    // amount가 무작위 값으로 256회 실행
    function testFuzz_transfer(uint256 amount) public {
        // bound: 테스트 범위 제한
        amount = bound(amount, 1, token.balanceOf(address(this)));

        address recipient = makeAddr("recipient");
        uint256 beforeBalance = token.balanceOf(address(this));

        token.transfer(recipient, amount);

        assertEq(token.balanceOf(address(this)), beforeBalance - amount);
        assertEq(token.balanceOf(recipient), amount);
    }

    // 두 개의 무작위 매개변수
    function testFuzz_approve_and_transferFrom(address spender, uint256 amount) public {
        vm.assume(spender != address(0));
        vm.assume(spender != address(this));
        amount = bound(amount, 1, 1000e18);

        token.approve(spender, amount);
        assertEq(token.allowance(address(this), spender), amount);

        vm.prank(spender);
        token.transferFrom(address(this), spender, amount);
        assertEq(token.balanceOf(spender), amount);
    }
}
