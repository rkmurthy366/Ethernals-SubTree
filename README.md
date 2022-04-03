# SubTree

> A subscription based service for the web3 world.

## Description

Here the company who buys this service will have access to create, edit and delete plans which are suitable for them. Using this service they can provide token gated content very easily.

The plans can be created for various durations, for example 1 month, 3 months, 6 months, 1 year, etc. The Special plans can also be created such that the users can subscribe to it only for a certain duration of time, after that no user can subscribe to it.

The user will have to register by minting an NFT for free, this NFT will have all the details to the plan they subscribed and act as a ticket. Using this NFT they can access the token gated content as long as the subscription is active. Once the subscription runs out, they will have to re-subscribe to the plan again to access the content.

![DinoLabsNFT.svg](https://github.com/rkmurthy366/Ethernals-SubTree/blob/48a981e4f1cd86012d36dd4d287a56a2016d1547/DinoLabsNFT.svg)

The NFT can atmost be transferred 2 times, after that it is non-transferable. We have made this possible considering a possibility that the user change their primary wallet address and reduce the usage of the old one, this should not impact the users subscribing to the plans. This can also be used to transfer the subscription to anyone else.

## Features

1. Create, Edit & Delete Plans.
2. Assign only selective persons who can moderate the plans.
3. Very low transaction fees to subscribe and moderate plans.
4. Token gated access to content.
5. Registration completely free for anyone (max 1 NFT per address to prevent spamming).
6. Purely On-Chain NFT.
7. User can transfer the NFT atmost twice.

## Smart Contract Addresses

[Plan Contract](https://mumbai.polygonscan.com/address/0xFcadb7C74BAac2879a3287EbBb264714751809dE#code)

      Plan Contract Address = 0xFcadb7C74BAac2879a3287EbBb264714751809dE

[Ticket Contract](https://mumbai.polygonscan.com/address/0xCbd046DF53D98F3Fcf257654891381Cb5003F3C4#code)

      Ticket Contract Address = 0xCbd046DF53D98F3Fcf257654891381Cb5003F3C4

## Run Locally

Clone the project

```bash
  git clone https://github.com/rkmurthy366/Ethernals-SubTree.git
```

Go to the project directory

```bash
  cd Ethernals-SubTree
```

Install dependencies

```bash
  npm  install
```

Change `.env.example` to `.env`

```bash
  RINKEBY_RPC_URL = "YOUR_RINKEBY_RPC_URL"
  MUMBAI_RPC_URL = "YOUR_MUMBAI_RPC_URL"

  PRIVATE_KEY = "YOUR_PRIVATE_KEY"

  ETHERSCAN_API_KEY = "YOUR_ETHERSCAN_API_KEY"
  POLYSCAN_API_KEY = "YOUR_POLYSCAN_API_KEY"
```

Start the server

```bash
  npm run start
```

## Testing & Deploying

Starting a local hardhat node

```bash
  npx hardhat node
```

Testing or Deploying on localhost

```bash
  npx hardhat run scripts/run.js --network localhost
```

Deploying to a network

```bash
  npx hardhat run scripts/deploy.js --network networkName
```

## Creators

[![RadhaKrishna](https://img.shields.io/badge/github-Radha_Krishna-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rkmurthy366)
