// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ModifierExample {
    address public owner;
    bool public paused;
    mapping(address => bool) public whitelist;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;  // 함수 본문이 여기 삽입됨
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Not whitelisted");
        _;
    }

    // 여러 modifier 조합
    function sensitiveAction() external onlyOwner whenNotPaused onlyWhitelisted {
        // 세 조건 모두 만족해야 실행
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }
}
