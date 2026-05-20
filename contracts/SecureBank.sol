// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SecureBank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        // 1. Checks: 조건 확인
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Nothing to withdraw");

        // 2. Effects: 상태 먼저 변경
        balances[msg.sender] = 0;

        // 3. Interactions: 외부 호출 마지막
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
