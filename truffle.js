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