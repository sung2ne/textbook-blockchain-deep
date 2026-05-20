// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../contracts/MyToken.sol";

// Handler: 허용된 행동 시퀀스를 정의
contract TokenHandler is Test {
    MyToken public token;
    address[] public actors;
    uint256 public totalMinted;

    constructor(MyToken _token) {
        token = _token;
        // 테스트 행위자 생성
        for (uint256 i = 0; i < 5; i++) {
            actors.push(makeAddr(string(abi.encodePacked("actor", i))));
        }
    }

    function mint(uint256 amount) external {
        amount = bound(amount, 1, 1_000_000e18);
        token.mint(actors[0], amount);
        totalMinted += amount;
    }

    function transfer(uint256 actorIdx, uint256 recipientIdx, uint256 amount) external {
        actorIdx = bound(actorIdx, 0, actors.length - 1);
        recipientIdx = bound(recipientIdx, 0, actors.length - 1);
        address actor = actors[actorIdx];
        address recipient = actors[recipientIdx];

        amount = bound(amount, 0, token.balanceOf(actor));

        vm.prank(actor);
        token.transfer(recipient, amount);
    }

    function burn(uint256 actorIdx, uint256 amount) external {
        actorIdx = bound(actorIdx, 0, actors.length - 1);
        address actor = actors[actorIdx];
        amount = bound(amount, 0, token.balanceOf(actor));

        vm.prank(actor);
        token.burn(actor, amount);
    }

    function actorsLength() external view returns (uint256) {
        return actors.length;
    }
}

contract TokenInvariantTest is Test {
    MyToken token;
    TokenHandler handler;

    function setUp() public {
        token = new MyToken();
        handler = new TokenHandler(token);
        token.grantRole(token.MINTER_ROLE(), address(handler));

        // 불변식 테스트 대상 컨트랙트 설정
        targetContract(address(handler));
    }

    // 불변식: totalSupply == 모든 잔액의 합
    function invariant_totalSupplyEqualsSumOfBalances() public {
        uint256 sum = 0;
        for (uint256 i = 0; i < handler.actorsLength(); i++) {
            sum += token.balanceOf(handler.actors(i));
        }
        assertEq(token.totalSupply(), sum);
    }

    // 불변식: 잔액은 절대 음수가 되지 않는다 (uint256이므로 항상 참이지만 명시적 검증)
    function invariant_balancesNeverNegative() public {
        for (uint256 i = 0; i < handler.actorsLength(); i++) {
            assertGe(token.balanceOf(handler.actors(i)), 0);
        }
    }
}
