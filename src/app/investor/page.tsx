'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { createRentalPackageRequest, mintReceivable, payReceivable } from '../lib/request';
import { useEthersSigner } from '../lib/ethers';
import type { Package } from '../types';

export default function InvestorPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const signer = useEthersSigner();

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleConnect = async () => {
    try {
      await connectAsync({ 
        connector: injected(),
        chainId: 11155111 // Sepolia chain ID
      });
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      if (!res.ok) throw new Error('Failed to fetch packages');
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (pkg: Package) => {
    if (!isConnected || !address || !signer) {
      await handleConnect();
      return;
    }

    try {
      // Create payment request with owner's address as payee
      const request = await createRentalPackageRequest(
        pkg.annualRentalIncome,
        pkg.upfrontPrice,
        pkg.ownerAddress,
        process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS || '',
      );
      
      // Mint the receivable
      await mintReceivable(request, signer);
      
      // Pay the receivable
      await payReceivable(request, signer, pkg.upfrontPrice.toString());
      
      // Update package status
      const res = await fetch(`/api/packages/${pkg._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'sold',
          requestId: request.requestId,
        })
      });

      if (!res.ok) throw new Error('Failed to update package');
      
      // Refresh packages list
      fetchPackages();
    } catch (error) {
      console.error('Error purchasing package:', error);
    }
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Packages</h1>
        {isConnected ? (
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 border rounded"
          >
            Disconnect {ensName ?? address?.slice(0, 6)}
          </button>
        ) : (
          <button
            onClick={handleConnect}
            className="px-4 py-2 bg-foreground text-background rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>
      
      <div className="max-w-4xl mx-auto grid gap-6">
        {packages.map((pkg) => (
          <div key={pkg._id} className="border rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Annual Income</p>
                <p className="text-xl font-semibold">${pkg.annualRentalIncome.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Discount Rate</p>
                <p className="text-xl font-semibold">{pkg.discountRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Investment</p>
                <p className="text-xl font-semibold">${pkg.upfrontPrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Return</p>
                <p className="text-xl font-semibold text-green-600">
                  ${(pkg.annualRentalIncome - pkg.upfrontPrice).toLocaleString()}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handlePurchase(pkg)}
              className="w-full py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
            >
              Purchase Package
            </button>
          </div>
        ))}

        {packages.length === 0 && (
          <p className="text-center text-gray-500">No packages available</p>
        )}
      </div>
    </div>
  );
} 