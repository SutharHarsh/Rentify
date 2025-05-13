require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.28",
//   networks: {
//     localhost: {
//       url: "http://127.0.0.1:8545",
//       accounts: [process.env.PRIVATE_KEY] // Make sure you have a valid private key
//     }
//   }
// };

// require("@nomiclabs/hardhat-ethers");
require("dotenv").config(); // Load .env file

console.log("Private Key:", process.env.PRIVATE_KEY);


module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.8.28",
      },
    ],
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

