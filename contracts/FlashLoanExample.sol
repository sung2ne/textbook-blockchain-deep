// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FlashLoanExample is FlashLoanSimpleReceiverBase {
    constructor(IPoolAddressesProvider provider)
        FlashLoanSimpleReceiverBase(provider)
    {}

    // 1. Flash Loan 요청
    function requestFlashLoan(address asset, uint256 amount) external {
        POOL.flashLoanSimple(
            address(this),  // 이 컨트랙트가 수령
            asset,          // 빌릴 자산
            amount,         // 빌릴 수량
            "",             // params (선택적 데이터)
            0               // referralCode
        );
    }

    // 2. Aave가 자금 지급 후 이 함수 호출
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,        // 수수료 (0.05%)
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        // ===== 여기서 차익거래 로직 실행 =====
        // 예: DEX A에서 사서 DEX B에서 팔기
        // 예: 담보 교환 (ETH 담보 → WBTC 담보)

        // 3. 원금 + 수수료 상환 승인
        uint256 repayAmount = amount + premium;
        IERC20(asset).approve(address(POOL), repayAmount);

        return true;
    }
}
