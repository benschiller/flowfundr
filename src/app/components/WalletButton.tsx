'use client'

import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { data: ensName } = useEnsName({ address });

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

  return isConnected ? (
    <button className="btn btn-outline-danger" onClick={handleDisconnect}>
      {ensName ?? address?.slice(0, 6)}...
    </button>
  ) : (
    <button className="btn btn-outline-primary" onClick={handleConnect}>
      Connect Wallet
    </button>
  );
} 