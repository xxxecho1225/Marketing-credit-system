require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY} = process.env;
module.exports = {
   solidity: {
      version: "0.8.22",
      settings: {
         optimizer: {
           enabled: true,
           runs: 200  // 适当调整 runs 的值
         }
       }
    },
   defaultNetwork: "ganache",
   networks: {
      hardhat: {},
      ganache: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
      },
   },
}
