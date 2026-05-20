// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarketplace is Ownable, ReentrancyGuard {
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public platformFee = 250;  // 2.5%

    struct Listing {
        address seller;
        uint256 price;      // ETH 가격 (wei)
        bool active;
    }

    // nftContract => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    event Listed(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );

    event Sold(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed buyer,
        address seller,
        uint256 price
    );

    event Delisted(
        address indexed nftContract,
        uint256 indexed tokenId
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external {
        require(price > 0, "Price must be greater than zero");

        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(
            nft.isApprovedForAll(msg.sender, address(this)) ||
            nft.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listings[nftContract][tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });

        emit Listed(nftContract, tokenId, msg.sender, price);
    }

    function buyNFT(address nftContract, uint256 tokenId)
        external
        payable
        nonReentrant
    {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.active, "Not listed");
        require(msg.value >= listing.price, "Insufficient payment");

        address seller = listing.seller;
        uint256 price = listing.price;

        listing.active = false;

        uint256 fee = (price * platformFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = price - fee;

        // 이더 전송
        payable(seller).transfer(sellerAmount);

        // NFT 전송 (reentrancy 후 실행: checks-effects-interactions 패턴)
        IERC721(nftContract).safeTransferFrom(seller, msg.sender, tokenId);

        // 초과 지불 환불
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        emit Sold(nftContract, tokenId, msg.sender, seller, price);
    }

    function delistNFT(address nftContract, uint256 tokenId) external {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.active, "Not listed");

        listing.active = false;
        emit Delisted(nftContract, tokenId);
    }

    function updatePrice(
        address nftContract,
        uint256 tokenId,
        uint256 newPrice
    ) external {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.active, "Not listed");
        require(newPrice > 0, "Price must be greater than zero");

        listing.price = newPrice;
        emit Listed(nftContract, tokenId, msg.sender, newPrice);
    }

    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee too high");  // 최대 10%
        platformFee = _fee;
    }

    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
