import { createContext, useContext, useState, } from "react";
import { useAuth } from "./AuthContext";
import { useMerchantSetup } from "./MerchantSetupContext";

const backendUrl = import.meta.env.VITE_LUMO_BACKEND_URL || 'http://localhost:8000'


export interface POSQueryResponse {
  id: string;
  terminal: string;
  ip_addr_used: URL;
  model_type: string | undefined;
  user_agent: string;

  // add other fields your API returns
}

interface POSQueryContextType {
  POSQuery: POSQueryResponse | null;
  loading: boolean;
  error: string | null;
  createPOSQuery: () => Promise<void>;
}

const POSSetupContext = createContext<POSQueryContextType | undefined>(undefined);

export function MerchantPaymentProvider({ children }: { children: React.ReactNode }) {

  const {token} = useAuth();
  const{merchant} = useMerchantSetup()
  const [POSQuery, setPOSQuery] = useState<POSQueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const date = new Date().toISOString().split("T")[0];

  const createPOSQuery = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${backendUrl}/api/terminal/address-query?merchant_id=${merchant?.id}&date=${date}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Optionally add Authorization header if needed
          Authorization: `Token ${token}`
        },
        
        //body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Failed to get IP addr of POS: ${res.status}`);
      }

      const data = await res.json()
      const ip_addr_used: URL = new URL(data.ip_addr_used)

      const responseData: POSQueryResponse = {...data, ip_addr_used:ip_addr_used};
      setPOSQuery(responseData);
    } catch (err: any) {
      console.error("Getting POS query error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <POSSetupContext.Provider value={{ POSQuery, loading, error, createPOSQuery }}>
      {children}
    </POSSetupContext.Provider>
  );
}

export const usePayment = () => {
  const ctx = useContext(POSSetupContext);
  if (!ctx) throw new Error("useMerchantSetup must be used within MerchantSetupProvider");
  return ctx;
};
