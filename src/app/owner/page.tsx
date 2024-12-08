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
        chainId: 11155111 // Sepolia chain ID
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Create Rental Cash Flow Package</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div>
          <label className="block mb-2">Annual Rental Income ($)</label>
          <input
            type="number"
            value={formData.annualRentalIncome}
            onChange={(e) => setFormData(prev => ({ ...prev, annualRentalIncome: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Discount Rate (%)</label>
          <input
            type="number"
            value={formData.discountRate}
            onChange={(e) => setFormData(prev => ({ ...prev, discountRate: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {upfrontPrice && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p>You will receive: ${upfrontPrice.toFixed(2)}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Package'}
        </button>
      </form>
    </div>
  );
} 