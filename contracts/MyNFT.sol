// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721, ERC721URIStorage, ERC721Royalty, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public mintPrice = 0.05 ether;
    string public baseURI;
    bool public revealed;

    string private constant UNREVEALED_URI =
        "ipfs://QmUnrevealedMetadata/hidden.json";

    constructor(address initialOwner, address royaltyReceiver)
        ERC721("MyNFT", "MNFT")
        Ownable(initialOwner)
    {
        // 2.5% 로열티 설정 (EIP-2981)
        _setDefaultRoyalty(royaltyReceiver, 250);
    }

    function mint(uint256 quantity) external payable {
        require(quantity > 0 && quantity <= 10, "Invalid quantity");
        require(
            _tokenIds.current() + quantity <= MAX_SUPPLY,
            "Exceeds max supply"
        );
        require(msg.value >= mintPrice * quantity, "Insufficient payment");

        for (uint256 i = 0; i < quantity; i++) {
            _tokenIds.increment();
            uint256 newId = _tokenIds.current();
            _safeMint(msg.sender, newId);
        }
    }

    function reveal(string calldata _baseURI) external onlyOwner {
        baseURI = _baseURI;
        revealed = true;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        _requireOwned(tokenId);
        if (!revealed) {
            return UNREVEALED_URI;
        }
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721URIStorage)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }
}
