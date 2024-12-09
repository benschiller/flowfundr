'use client'

import dynamic from 'next/dynamic'

// Import WalletButton with no SSR
const WalletButton = dynamic(
  () => import('./WalletButton'),
  { ssr: false }
)

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">FlowFundr</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="ms-auto">
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
} 