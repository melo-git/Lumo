import { createSolanaClient } from "gill";
import { SolanaProvider } from "@gillsdk/react";

const rpcUrl =
  import.meta.env.PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

if (!rpcUrl) {
  throw new Error(
    "NEXT_PUBLIC_SOLANA_RPC_URL environment variable is required"
  );
}

const client = createSolanaClient({
  urlOrMoniker: `${rpcUrl}`,
});

export function SolanaProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SolanaProvider client={client}>{children}</SolanaProvider>;
}
