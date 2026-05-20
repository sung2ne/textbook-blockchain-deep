// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../contracts/MyToken.sol";

contract MyTokenTest is Test {
    MyToken token;
    address owner = makeAddr("owner");
    address alice = makeAddr("alice");
    address attacker = makeAddr("attacker");

    function setUp() public {
        vm.prank(owner);
        token = new MyToken(owner);
    }

    // 기본 테스트
    function test_InitialBalance() public view {
        assertEq(
            token.balanceOf(owner),
            100_000 * 10 ** 18
        );
    }

    // 실패 케이스 테스트
    function test_RevertWhen_NonOwnerMints() public {
        vm.prank(attacker);
        vm.expectRevert();
        token.mint(attacker, 1000);
    }

    // Fuzz 테스트: amount를 무작위로 테스트
    function testFuzz_Transfer(uint256 amount) public {
        amount = bound(amount, 1, 100_000 * 10 ** 18);

        vm.prank(owner);
        token.transfer(alice, amount);

        assertEq(token.balanceOf(alice), amount);
        assertEq(
            token.balanceOf(owner),
            100_000 * 10 ** 18 - amount
        );
    }

    // Invariant 테스트: totalSupply는 항상 일정해야 함
    function invariant_TotalSupplyIsConstant() public view {
        assertEq(token.totalSupply(), 1_000_000 * 10 ** 18 + 100_000 * 10 ** 18);
    }
}
