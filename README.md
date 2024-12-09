# FlowFundr

Turn Future Rental Income Into Instant Capital

## Overview

FlowFundr is a hackathon project that enables property owners to sell their future rental income at a discount to investors. Built using Request Network's ERC20 Transferable Receivable standard on Sepolia testnet.

## How It Works

1. **Property Owners**
   - Connect wallet
   - Input annual rental income
   - Set discount rate
   - Create rental income package

2. **Investors**
   - Browse available packages
   - See potential returns
   - Purchase packages using Sepolia ETH
   - Receive NFT representing future rental payments

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Blockchain**: 
  - Request Network (ERC20 Transferable Receivable)
  - Wagmi v2 / Viem
  - Ethers.js
- **Database**: MongoDB
- **Styling**: Tailwind CSS

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```env
# .env.local
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS=your_contract_address
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Requirements

- MetaMask or other Web3 wallet
- Sepolia testnet ETH
- MongoDB database

## Development

This is a hackathon project demonstrating the use of Request Network for tokenizing and trading future rental income streams.

## License

MIT
