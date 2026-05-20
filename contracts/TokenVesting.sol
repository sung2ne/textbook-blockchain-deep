// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenVesting {
    IERC20 public token;
    address public beneficiary;
    uint256 public startTime;
    uint256 public cliffDuration;    // 클리프 기간 (초)
    uint256 public vestingDuration;  // 총 베스팅 기간 (초)
    uint256 public totalAmount;
    uint256 public released;

    constructor(
        IERC20 _token,
        address _beneficiary,
        uint256 _cliffDuration,
        uint256 _vestingDuration,
        uint256 _totalAmount
    ) {
        token = _token;
        beneficiary = _beneficiary;
        startTime = block.timestamp;
        cliffDuration = _cliffDuration;
        vestingDuration = _vestingDuration;
        totalAmount = _totalAmount;
    }

    function vestedAmount() public view returns (uint256) {
        if (block.timestamp < startTime + cliffDuration) {
            return 0;  // 클리프 기간: 지급 없음
        }
        if (block.timestamp >= startTime + vestingDuration) {
            return totalAmount;  // 베스팅 완료
        }
        // 선형 베스팅
        uint256 elapsed = block.timestamp - startTime;
        return (totalAmount * elapsed) / vestingDuration;
    }

    function release() external {
        uint256 releasable = vestedAmount() - released;
        require(releasable > 0, "Nothing to release");
        released += releasable;
        token.transfer(beneficiary, releasable);
    }
}
