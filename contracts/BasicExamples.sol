// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BasicExamples {
    uint256 public counter;
    address public owner;

    constructor() {
        owner = msg.sender;
        counter = 0;
    }

    // 상태 변경 함수 (트랜잭션 필요)
    function increment() public {
        counter += 1;
    }

    // 읽기 전용 함수 (트랜잭션 불필요)
    function getCounter() public view returns (uint256) {
        return counter;
    }

    // 이더를 받는 함수
    function deposit() public payable {
        // msg.value: 이 호출로 전송된 이더 (wei)
    }

    // 파라미터를 받는 함수
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;  // pure: 상태도 읽지 않음
    }
}
