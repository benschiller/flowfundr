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
        chainId: 11155111
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
      const request = await createRentalPackageRequest(
        pkg.annualRentalIncome,
        pkg.upfrontPrice,
        pkg.ownerAddress,
        process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS || '',
      );
      
      await mintReceivable(request, signer);
      await payReceivable(request, signer, pkg.upfrontPrice.toString());
      
      const res = await fetch(`/api/packages/${pkg._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'sold',
          requestId: request.requestId,
        })
      });

      if (!res.ok) throw new Error('Failed to update package');
      
      fetchPackages();
    } catch (error) {
      console.error('Error purchasing package:', error);
    }
  };

  if (isLoading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="text-center mb-4">
        <h1>Available Packages</h1>
      </div>

      <div className="text-center mb-4">
        <div className="row">
          {packages.map((pkg) => (
            <div className="col-md-4 mb-3" key={pkg._id}>
              <div className="card">
                <div className="card-body">
                  <div className="mb-3">
                    <h5 className="card-title">Annual Income</h5>
                    <p className="card-text">${pkg.annualRentalIncome.toLocaleString()}</p>
                  </div>
                  <div className="mb-3">
                    <h5 className="card-title">Discount Rate</h5>
                    <p className="card-text">{pkg.discountRate}%</p>
                  </div>
                  <div className="mb-3">
                    <h5 className="card-title">Your Investment</h5>
                    <p className="card-text">${pkg.upfrontPrice.toLocaleString()}</p>
                  </div>
                  <div className="mb-3">
                    <h5 className="card-title">Your Return</h5>
                    <p className="card-text">${(pkg.annualRentalIncome - pkg.upfrontPrice).toLocaleString()}</p>
                  </div>
                  
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => handlePurchase(pkg)}
                  >
                    Purchase Package
                  </button>
                </div>
              </div>
            </div>
          ))}

          {packages.length === 0 && (
            <div className="col-12 text-center">
              <p>No packages available</p>
              <p>Check back soon or list your property</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 