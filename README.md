# SatyaChain

Blockchain-powered "Made in India" verification system using Bill of Materials (BoM) analysis with automated risk assessment and on-chain audit logging.

## Tech Stack

- **Smart Contracts:** Solidity + Foundry
- **Web App:** Next.js 15 + TailwindCSS v4
- **Blockchain:** ethers.js + Arbitrum Sepolia / Polygon Mumbai

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/salonniiee/saloni.git
cd saloni
```

### 2. Foundry (Smart Contracts)

```bash
cd foundry
npm install
forge build
```

### 3. Next.js Web App

```bash
cd web
npm install
cp .env.example .env
```

### 4. Configure Environment

Edit `.env` with your settings:

```env
# Required for blockchain interaction
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

# Required for contract deployment
PRIVATE_KEY=0x...
```

### 5. Run Development Server

```bash
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy Smart Contract

### Get Testnet ETH

- **Arbitrum Sepolia:** https://faucet.quicknode.com/arbitrum/sepolia
- **Polygon Mumbai:** https://faucet.polygon.technology/

### Deploy

```bash
cd foundry
forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

Copy the deployed contract address to your `.env`.

---

## Project Structure

```
.
├── foundry/              # Solidity smart contracts
│   ├── src/
│   │   └── SatyaChain.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   └── foundry.toml
│
├── web/                  # Next.js web application
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── supplier/     # Supplier BoM submission
│   │   ├── dashboard/    # Buyer dashboard
│   │   └── product/[id]/ # Product detail view
│   └── lib/
│       ├── store.ts      # In-memory data store
│       └── blockchain.ts # Ethers.js integration
│
└── specs/                # Requirements & design docs
```

---

## Features

- **BoM Analysis:** Submit product components with origin (India/Imported)
- **Local Content Calculation:** Automatic % calculation
- **Classification:** Class I (50%+), Class II (20-50%), Non-local (<20%)
- **Risk Engine:** Automated risk assessment (HIGH/MEDIUM/LOW)
- **On-Chain Storage:** Verification records stored on blockchain
- **Neubrutalist UI:** Bold black-white design with thick borders

---

## License

MIT
