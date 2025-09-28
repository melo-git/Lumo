"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { SolanaProviderClient } from "./SolanaProvider";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "gill";
import {Connection} from '@solana/web3.js'

const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || "";

const privyClientId = import.meta.env.VITE_PRIVY_CLIENT_ID || "";

const rpcUrl =
  import.meta.env.PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

  const connection = new Connection(rpcUrl, "confirmed");

if (!privyAppId) {
  throw new Error("VITE_PRIVY_ID environment variable is required");
}

if (!rpcUrl) {
  throw new Error(
    "PUBLIC_SOLANA_RPC_URL environment variable is required"
  );
}





export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SolanaProviderClient>
      <PrivyProvider
        appId={privyAppId}
        clientId={privyClientId}
        config={{
           appearance: {
            theme: "#1a1a1a",
            walletChainType: "solana-only",
            walletList: ['detected_solana_wallets',],
          },
          
          externalWallets: {
            solana: { 
              connectors: toSolanaWalletConnectors(),
          
  

            },
          },
          embeddedWallets: {
            solana: {
              createOnLogin: "off",
            },
          },

           solana: {
      rpcs: {
        
        'solana:devnet': {
          rpc: createSolanaRpc('https://api.devnet.solana.com'),
          rpcSubscriptions: createSolanaRpcSubscriptions('wss://api.devnet.solana.com')
        }
      }
    },
         
        }}
      >
        {children}
      </PrivyProvider>
    </SolanaProviderClient>
  );
}
