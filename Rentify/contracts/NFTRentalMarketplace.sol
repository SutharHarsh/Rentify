// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC721 {
    function transferFrom(address from, address to, uint tokenId) external;
    function ownerOf(uint tokenId) external view returns (address);
    function approve(address to, uint tokenId) external;
}

struct Rental {
    address renter;
    uint256 endTime;
}

struct RentalInfo {
    address nftAddress;
    uint256 tokenId;
    address owner;
    uint256 rentFee;
    uint256 duration;
    address renter;
    uint256 endTime;
}

contract NFTRentalMarketplace {
    mapping(address => mapping(uint256 => RentalInfo)) public rentals;
    RentalInfo[] public listedRentals;

    enum Status {
        Available,
        Rented
    }

    struct Listing {
        address owner;
        address nftContract;
        uint tokenId;
        uint rentalPricePerDay;
        uint maxRentDurationDays;
        Status status;
        uint rentalEnd;
        address renter;
    }

    uint public listingCounter;
    mapping(uint => Listing) public listings;

    // Add to RentalInfo array and mapping
    function listNFTForRent(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _fee,
        uint256 _duration
    ) public {
        RentalInfo memory info = RentalInfo({
            nftAddress: _nftAddress,
            tokenId: _tokenId,
            owner: msg.sender,
            rentFee: _fee,
            duration: _duration,
            renter: address(0),
            endTime: 0
        });

        rentals[_nftAddress][_tokenId] = info;
        listedRentals.push(info);
    }

    function getAllListedRentals() public view returns (RentalInfo[] memory) {
        return listedRentals;
    }

    // Listing NFTs on the platform
    function createListing(
        address nftContract,
        uint tokenId,
        uint rentalPricePerDay,
        uint maxRentDurationDays
    ) external {
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        listingCounter++;
        listings[listingCounter] = Listing({
            owner: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            rentalPricePerDay: rentalPricePerDay,
            maxRentDurationDays: maxRentDurationDays,
            status: Status.Available,
            rentalEnd: 0,
            renter: address(0)
        });
    }

    function rentNFT(uint listingId, uint numDays) external payable {
        Listing storage listing = listings[listingId];
        require(listing.status == Status.Available, "Not available");
        require(numDays <= listing.maxRentDurationDays, "Too many days");

        uint cost = listing.rentalPricePerDay * numDays;
        require(msg.value >= cost, "Not enough payment");

        listing.status = Status.Rented;
        listing.renter = msg.sender;
        listing.rentalEnd = block.timestamp + (numDays * 1 days);
    }

    function endRentalAndReclaimNFT(uint listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.status == Status.Rented, "Not rented");
        require(block.timestamp >= listing.rentalEnd, "Rental period not over");
        require(msg.sender == listing.owner, "Only owner can reclaim");

        listing.status = Status.Available;
        listing.renter = address(0);
        listing.rentalEnd = 0;

        IERC721(listing.nftContract).transferFrom(
            address(this),
            listing.owner,
            listing.tokenId
        );
    }

    function delistNFT(uint listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.status == Status.Available, "Cannot delist while rented");
        require(msg.sender == listing.owner, "Only owner can delist");

        listing.status = Status.Available;

        IERC721(listing.nftContract).transferFrom(
            address(this),
            listing.owner,
            listing.tokenId
        );
    }

    function getListingDetails(uint listingId) external view returns (Listing memory) {
        return listings[listingId];
    }

    function getRentalDetails(address nftAddress, uint256 tokenId) public view returns (Rental memory) {
        RentalInfo memory info = rentals[nftAddress][tokenId];
        return Rental(info.renter, info.endTime);
    }

    function getRentalStatus(uint listingId) external view returns (string memory) {
        if (listings[listingId].status == Status.Available) {
            return "Available";
        } else {
            return "Rented";
        }
    }
}
