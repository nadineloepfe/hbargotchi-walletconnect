# Hbargotchi dApp with WalletConnect

Welcome to Hbargotchi, a decentralised, virtual pet project built on Hedera Hashgraph. Users can create, mint, and take care of their own digital pets, combining the nostalgia of virtual pets with modern web3 technology, while experiencing the Mirror Node API & Hedera Token Service (HTS).

tbc: Hedera Consensus Service (HCS) as well as Hedera Smart Contract Service (HSCS)

This project uses React, Material UI, Ethers, and TypeScript and uses the [Create React App (CRA) Hedera DApp template](https://github.com/hedera-dev/cra-hedera-dapp-template) template as a base.
Fully integrated with walletconnect, streamlining your development process.


## Completed Branch Usage

1. Execute ```npm i```
2. Execute ```npm run start``` to start the project

## Prerequisites

### Hedera Testnet account

Don't have one? Create one by going to [portal.hedera.com](https://portal.hedera.com/register). The daily limit is 1000 test HBAR and users will be able to request for a refill every 24 hours!

### Hashpack Wallet
* Install the [Hashpack extension](https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk).  

### Blade Wallet
* Install the [Blade extension](https://chrome.google.com/webstore/detail/blade-%E2%80%93-hedera-web3-digit/abogmiocnneedmmepnohnhlijcjpcifd).  

### Metamask Wallet
* Install the [MetaMask extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn).
* Import a Hedera ECDSA based testnet account into MetaMask.  

### Kabila Wallet
* Install the [Kabila extension](https://www.kabila.app/wallet).

#### How to activate your account on Hedera Testnet

* Activate it by transferring any 100 test HBAR to your EVM address using our faucet at https://portal.hedera.com/faucet

-----

## Configuration
This project uses a configuration file located `src/config/networks.ts`.

```TypeScript
export const networkConfig: NetworkConfigs = {
  testnet: {
    network: "testnet",
    jsonRpcUrl: "https://testnet.hashio.io/api", // check out the readme for alternative RPC Relay urls
    mirrorNodeUrl: "https://testnet.mirrornode.hedera.com",
    chainId: "0x128",
  }
}
```

---

## JSON RPC Relay Endpoint Alternatives
This DApp utilizes [Hashio](https://swirldslabs.com/hashio/) to connect to Hedera Testnet over RPC.
There are three options available to establish a connection to Hedera Networks:
* Hashio
* Arkhia
* Hedera JSON RPC Relay

Follow the guide [how to connect to Hedera Networks over RPC](https://docs.hedera.com/hedera/tutorials/more-tutorials/json-rpc-connections) to connect using Arkhia or a local version of the Hedera JSON RPC Relay.

## Links
* [The Hedera DApp CRA Template](https://github.com/hedera-dev/cra-hedera-dapp-template)
* Need to quickly create Hedera Testnet accounts to act as Sender/Receiver? Check out [Create Hedera Accounts with Tokens Helper](https://github.com/hedera-dev/hedera-create-account-and-token-helper)
* [Hashscan](https://hashscan.io/testnet/dashboard) network explorer


## License
Apache 2.0
