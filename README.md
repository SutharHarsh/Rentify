# 🏠 NFT Rental Marketplace – Full Stack Blockchain Project

## 📘 Overview

The **NFT Rental Marketplace** is a decentralized application that allows users to list, rent, and manage NFTs on a temporary basis using smart contracts. It replicates real-world rental systems (like renting a bike or apartment) but applies them to NFTs on the Ethereum blockchain.

---

## 📚 Theoretical Background

- **ERC-721 Standard**: Foundation for unique NFT assets.
- **Smart Contracts**: Used to enforce rules and handle transactions.
- **Decentralized Architecture**: Eliminates trust issues by using blockchain.

**Rental Flow:**
1. **Owner lists NFT** with rent price and duration.
2. **User rents NFT** and gets temporary usage rights.
3. **Ownership reverts** or rental ends after set duration.

---

## ⚙ Technologies Used

| Tool         | Purpose                                      |
|--------------|----------------------------------------------|
| Hardhat      | Ethereum development environment             |
| Solidity     | Smart contract language                      |
| Ethers.js    | JavaScript library to interact with contracts|
| Mocha/Chai   | Testing framework                            |
| Node.js      | Backend runtime                              |
| Ganache      | Local Ethereum simulator (optional)          |

---

## 🚀 Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Rentify.git
cd Rentify

# 2. Install dependencies
npm install

# 3. Compile smart contracts
npx hardhat compile

# 4. Start local blockchain
npx hardhat node

# 5. Deploy smart contracts
npx hardhat run scripts/deploy.js --network localhost
````

---

## 🔑 Smart Contracts

### 📄 `NFTRentalMarketplace.sol`

| Function              | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `listNFTForRent()`    | Owner lists an NFT with rent price and duration       |
| `rentNFT()`           | Renter pays and gets temporary access to NFT          |
| `getRentalDetails()`  | Returns details like renter address and rent end time |
| `isCurrentlyRented()` | Checks if NFT is still under rent                     |
| `withdrawRent()`      | Allows owner to withdraw earnings (optional)          |

### 📄 `ERC721Mock.sol`

Mock NFT contract for testing: supports minting and approval operations.

---

## 📜 Deployment Script

`deploy.js` automates deployment of the marketplace contract.

```js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const Marketplace = await hre.ethers.getContractFactory("NFTRentalMarketplace");
  const marketplace = await Marketplace.deploy();

  await marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

---

## 🧪 Testing

Run all tests with:

```bash
npx hardhat test
```

Test cases include:

* ✅ Minting and listing NFTs
* ✅ Renting NFTs
* ✅ Validating rental periods
* ✅ Preventing double rentals
* ✅ Checking rental ownership transfer

Sample test case:

```js
it("should let a user rent an NFT", async function () {
  await nft.connect(owner).mint();
  await nft.connect(owner).approve(marketplace.address, 1);

  await marketplace.connect(owner).listNFTForRent(nft.address, 1, rentFee, rentDuration);
  await marketplace.connect(user).rentNFT(nft.address, 1, { value: rentFee });

  const details = await marketplace.getRentalDetails(nft.address, 1);
  expect(details.renter).to.equal(user.address);
});
```

---

## 🌐 Configuration

### Hardhat Setup (`hardhat.config.js`)

```js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: ["0xYOUR_PRIVATE_KEY"]
    }
  }
};
```

---

## ✅ Project Completion Summary

* ✅ Smart contracts written and compiled
* ✅ Contracts deployed on local blockchain
* ✅ Basic and advanced unit tests passed
* ✅ NFT mint → list → rent cycle tested
* ✅ README and documentation created

---

## 🔚 Conclusion

This project lays the foundation for a robust NFT rental ecosystem on Ethereum. With smart contracts ensuring security and automation, and a modular design ready for frontend integration, it is a perfect candidate for scaling into a full DApp.

> 💡 Pair this backend with a frontend and testnet deployment to turn it into a complete production-ready Web3 app.
