import { createAppKit } from '@reown/appkit/react'
import type { AppKitOptions } from '@reown/appkit'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ProductCatalog } from './components/ProductCatalog'
import { projectId, metadata, networks, wagmiAdapter } from './config'

//import { ReownAuthentication } from '@reown/appkit-siwx'

import "./App.css"

const queryClient = new QueryClient()

const generalConfig = {
  projectId,
  networks,
  metadata,
  // Add the following code line
  themeMode: 'light' as const,
  themeVariables: {
    '--w3m-accent': '#000000',
  }
}

// Create modal
const config: AppKitOptions = {
  adapters: [wagmiAdapter],
  ...generalConfig,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
 // siwx: new ReownAuthentication()
}

createAppKit(config)

export function App() {


  return (
    <div className={"app-container"}>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>     
        <QueryClientProvider client={queryClient}> 
          <ProductCatalog />
        </QueryClientProvider> 
      </WagmiProvider>

      <style>{`
        .app-container {
          min-height: 100vh;
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  )
}

export default App
