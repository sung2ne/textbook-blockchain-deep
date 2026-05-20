// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Marketplace is EIP712 {
    using ECDSA for bytes32;

    bytes32 private constant BID_TYPEHASH = keccak256(
        "Bid(uint256 tokenId,uint256 price,address bidder,uint256 expiry)"
    );

    constructor() EIP712("NFT Marketplace", "1") {}

    function acceptBid(
        uint256 tokenId,
        uint256 price,
        address bidder,
        uint256 expiry,
        bytes calldata signature
    ) external {
        require(block.timestamp < expiry, "Bid expired");

        bytes32 structHash = keccak256(
            abi.encode(BID_TYPEHASH, tokenId, price, bidder, expiry)
        );
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = digest.recover(signature);

        require(signer == bidder, "Invalid signature");

        // ... 낙찰 처리
    }
}
