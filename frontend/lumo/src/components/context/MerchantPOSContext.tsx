import { createContext, useContext, useState, } from "react";
import { useAuth } from "./AuthContext";
import { usePayment } from "./MerchantPaymentContext";

const backendUrl = import.meta.env.VITE_LUMO_BACKEND_URL || 'http://localhost:8000'


export interface POSData {
  merchant: string;
  device_serial_id: string;
  model_type: string | undefined;

}



export interface POSResponse {
  merchant_id: Number;
  device_serial_id: string;
  model_type: string | undefined;
  registration_date: string;
  status: string;

  // add other fields your API returns
}

interface POSSetupContextType {
  POS: POSResponse | null;
  loading: boolean;
  error: string | null;
  createPOS: (data: POSData) => Promise<void>;
}

const POSSetupContext = createContext<POSSetupContextType | undefined>(undefined);

export function POSSetupProvider({ children }: { children: React.ReactNode }) {

  const {token,} = useAuth();
  //const {POSQuery} = usePayment()
  const [POS, setPOS] = useState<POSResponse | null>(null);
  //const [IP, setIP] = useState<URL | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  

  const createPOS = async (data: POSData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${backendUrl}api/terminal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optionally add Authorization header if needed
          Authorization: `Token ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Failed to create terminal: ${res.status}`);
      }
      //setIP(POSQuery?.ip_addr_used)

      

      const responseData: POSResponse = await res.json()

      // Fetch all available terminals
      if (responseData) {
        try {
          const res = await fetch(`${backendUrl}/api/terminal`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Optionally add Authorization header if needed
          Authorization: `Token ${token}`
        },

      });
      if (!res.ok) {
        throw new Error(`Failed to fetch terminals: ${res.status}`);
        }
        const POSData: POSResponse = await res.json()
        setPOS(POSData);

      }
        catch(err: any) {
      console.error("Create merchant error:", err);
      setError(err.message || "Something went wrong");
      }
    }
      console.log(responseData)
      
      
      console.log(responseData)
    } catch (err: any) {
      console.error("Create merchant error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <POSSetupContext.Provider value={{ POS, loading, error, createPOS }}>
      {children}
    </POSSetupContext.Provider>
  );
}

export const usePOSSetup = () => {
  const ctx = useContext(POSSetupContext);
  if (!ctx) throw new Error("usePOSSetup must be used within MerchantSetupProvider");
  return ctx;
};
