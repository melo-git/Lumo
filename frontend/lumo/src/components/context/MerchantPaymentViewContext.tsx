import { createContext, useContext, useState, } from "react";
import { useAuth } from "./AuthContext";

const backendUrl = import.meta.env.LUMO_BACKEND_URL || 'http://localhost:8000'


interface MerchantData {
  business_name: string;
  location: string;
  phone: string | undefined;
  email: string | undefined;
  status: string;
}

interface MerchantResponse {
  id: string;
  business_name: string;
  location: string;
  phone: string | null;
  email: string | null;
  status: string;
  // add other fields your API returns
}

interface MerchantSetupContextType {
  merchant: MerchantResponse | null;
  loading: boolean;
  error: string | null;
  createMerchant: (data: MerchantData) => Promise<void>;
}

const MerchantSetupContext = createContext<MerchantSetupContextType | undefined>(undefined);

export function MerchantSetupProvider({ children }: { children: React.ReactNode }) {

  const {token} = useAuth();
  const [merchant, setMerchant] = useState<MerchantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMerchant = async (data: MerchantData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${backendUrl}/api/merchants/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optionally add Authorization header if needed
          Authorization: `Token ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Failed to create merchant: ${res.status}`);
      }

      const responseData: MerchantResponse = await res.json();
      setMerchant(responseData);
    } catch (err: any) {
      console.error("Create merchant error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MerchantSetupContext.Provider value={{ merchant, loading, error, createMerchant }}>
      {children}
    </MerchantSetupContext.Provider>
  );
}

export const useMerchantSetup = () => {
  const ctx = useContext(MerchantSetupContext);
  if (!ctx) throw new Error("useMerchantSetup must be used within MerchantSetupProvider");
  return ctx;
};
