// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Mock is ERC721 {
    uint public tokenIdTracker;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(address to, uint tokenId) external {
        _mint(to, tokenId);
    }
}
