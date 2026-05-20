// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./MyTokenV1.sol";

contract MyTokenV2 is MyTokenV1 {
    // V2에 새 기능 추가
    uint256 public transferFee;  // 스토리지 슬롯은 V1 이후에 추가

    function setTransferFee(uint256 _fee) external onlyOwner {
        require(_fee <= 100, "Fee too high");  // 최대 1%
        transferFee = _fee;
    }

    // _update를 override하여 전송 수수료 추가
    function _update(address from, address to, uint256 value)
        internal
        override
    {
        if (transferFee > 0 && from != address(0) && to != address(0)) {
            uint256 fee = (value * transferFee) / 10000;
            super._update(from, owner(), fee);   // 수수료를 owner에게
            super._update(from, to, value - fee); // 나머지를 수신자에게
        } else {
            super._update(from, to, value);
        }
    }
}
