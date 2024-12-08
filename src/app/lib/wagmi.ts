import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Configure chains and providers
export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected({
      shimDisconnect: true, // Allows us to display the connect button when injected provider is detected
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
}) 