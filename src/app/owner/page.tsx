'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function OwnerPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();

  const [formData, setFormData] = useState({
    annualRentalIncome: '',
    discountRate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const calculateUpfrontPrice = () => {
    const income = parseFloat(formData.annualRentalIncome);
    const rate = parseFloat(formData.discountRate);
    if (!income || !rate) return null;
    return income / (1 + (rate / 100));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      await handleConnect();
      return;
    }

    setIsLoading(true);
    
    try {
      const upfrontPrice = calculateUpfrontPrice();
      if (!upfrontPrice) throw new Error('Invalid price calculation');

      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annualRentalIncome: Number(formData.annualRentalIncome),
          discountRate: Number(formData.discountRate),
          upfrontPrice,
          ownerAddress: address,
        })
      });

      if (!res.ok) throw new Error('Failed to create package');
      
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const upfrontPrice = calculateUpfrontPrice();

  return (
    <div>
      <div className="text-center mb-4">
        <h1>Create Rental Cash Flow Package</h1>
      </div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Annual Rental Income ($)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.annualRentalIncome}
                  onChange={(e) => setFormData(prev => ({ ...prev, annualRentalIncome: e.target.value }))}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Discount Rate (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.discountRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountRate: e.target.value }))}
                  required
                />
              </div>

              {upfrontPrice && (
                <div className="alert alert-info mb-3">
                  <p className="mb-0">You will receive: ${upfrontPrice.toFixed(2)}</p>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Package'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 