// const HDWalletProvider = require("truffle-hdwallet-provider");
// require("dotenv").config();


// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
//   networks: {
//     development: {
//       host: '127.0.0.1',
//       port: 8545,
//       network_id: '*' // Match any network id
//     }
//   }

//   ropsten: {
//     provider: function() {
//       return new HDWalletProvider (
//         "game brief daring giraffe evoke sunny pair nice vicious garden asset drift",
//         "https://ropsten.infura.io/v3/88e84be7ecb64d008ae37bf95374cc45"
//       )
//     }
//   }
// };

const HDWalletProvider = require("truffle-hdwallet-provider")
require("dotenv").config()

const MNEMONIC = process.env.MNEMONIC
const INFURA = process.env.INFURA

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },

    ropsten: {
      provider: function() {
        return new HDWalletProvider (
          MNEMONIC,
          "https://ropsten.infura.io/v3/" + INFURA
        )
      },
      network_id: 3,
      gas: 4000000,
      gasPrice: 21,
    },
  }
};