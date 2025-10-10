import { createContext, useContext, useEffect, useState, } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router";

const backendUrl = import.meta.env.VITE_LUMO_BACKEND_URL || 'http://localhost:8000'


interface MerchantData {
  user_id: Number|null;
  business_name: string;
  location: string;
  phone: string | undefined;
  email: string | undefined;
  status: string;
}

export interface MerchantResponse {
  id: string;
  business_name: string;
  location: string;
  phone: string | null;
  email: string | null;
  status: string;
  // add other fields your API returns
}

interface MerchantSetupContextType {
  merchant: any | null;
  loading: boolean;
  error: string | null;
  createMerchant: (data: MerchantData) => void;
}

const MerchantSetupContext = createContext<MerchantSetupContextType | undefined>(undefined);

export function MerchantSetupProvider({ children }: { children: React.ReactNode }) {
//const navigate = useNavigate()
  const {token, userType, id, loggedin} = useAuth();
  console.log(id, loggedin, userType)
  const [merchant, setMerchant] = useState<any|null>(JSON.parse(`${localStorage.getItem("merchant")? localStorage.getItem("merchant"):null }`));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //const navigate = useNavigate()

   useEffect(() => {
    if (!loggedin) return; 
    if (loggedin) {
      setMerchant(
        JSON.parse(`${localStorage.getItem("merchant")? localStorage.getItem("merchant"):null }`)
      )
      }
  }, [loggedin]);

 useEffect(() => {
    
 if (userType === 'Merchant' &&
   !JSON.parse(`${localStorage.getItem("merchant")? localStorage.getItem("merchant"):null }`))
   {
    const getMerchant = async ()=> {try {
      const res = await fetch(`${backendUrl}/api/merchant/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Optionally add Authorization header if needed
          Authorization: `Token ${token}`
        },

      });

      if (!res.ok) {
        throw new Error(`Failed to get merchant: ${res.status}`);
      }

      const responseData: MerchantResponse = await res.json();
      localStorage.setItem("merchant", JSON.stringify(responseData))
      setMerchant(JSON.parse(`${localStorage.getItem("merchant")? localStorage.getItem("merchant"):null }`));
      console.log(responseData);
    } catch (err: any) {
      console.error("Create merchant error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
}
getMerchant()
  };
 }, [
  userType,
  JSON.parse(`${localStorage.getItem("merchant")? localStorage.getItem("merchant"):null }`)

 ]);
  

  const createMerchant =  async (data: MerchantData) =>  {
        setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${backendUrl}/api/merchants`, {
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
      localStorage.setItem("merchant", JSON.stringify(responseData))
      setMerchant(JSON.parse(`${localStorage.getItem("merchant")? localStorage.getItem("merchant"):"{}" }`));
      console.log(responseData);
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
