import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
})

// Create QueryClient instance
export const queryClient = new QueryClient()

// Create wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  wagmiConfig,
  queryClient
} as any) // TODO: Remove 'as any' once type definitions are fixed

// Create Reown AppKit config
export const appKitConfig = createAppKit({
  adapters: [wagmiAdapter],
  networks: [
    {
      id: mainnet.id,
      name: mainnet.name,
      nativeCurrency: mainnet.nativeCurrency,
      rpcUrls: {
        default: { http: [mainnet.rpcUrls.default.http[0]] }
      }
    }
  ],
  projectId: '3fe7945bc3c3b26cf3052d9d111db227' // You'll need to replace this with your actual project ID
}) 