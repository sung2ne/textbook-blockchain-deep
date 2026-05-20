// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract StorageExample {
    uint256[] public numbers;

    // calldata: 입력 배열을 복사 없이 읽기만 함 (가스 절약)
    function addNumbers(uint256[] calldata _numbers) external {
        for (uint i = 0; i < _numbers.length; i++) {
            numbers.push(_numbers[i]);
        }
    }

    // memory: 임시 배열 생성 후 반환
    function getDoubled() external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](numbers.length);
        for (uint i = 0; i < numbers.length; i++) {
            result[i] = numbers[i] * 2;
        }
        return result;
    }

    // storage 포인터: 상태 변수 직접 참조 (복사 없음)
    function updateFirst(uint256 newValue) external {
        uint256[] storage ref = numbers;  // storage 포인터
        ref[0] = newValue;               // 직접 storage 수정
    }
}
