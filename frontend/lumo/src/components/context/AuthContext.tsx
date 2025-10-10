import { createContext, useContext, useEffect, useState } from "react";
import { usePrivy, useLogin, useLogout } from "@privy-io/react-auth";
import { useNavigate } from "react-router";

//import { ConnectedStandardSolanaWallet } from "@privy-io/react-auth/solana";


const backendUrl = import.meta.env.VITE_LUMO_BACKEND_URL || 'http://localhost:8000'

interface AuthContextType {
  id: string|null;
  _user: string;
  userType: string|null;
  loading: boolean;
  _login: () => void;
  _logout: () => void;
  syncAuth: () => void;
  token: string | null;
  accessToken: string | null;
  wallet: string|null;
  loggedin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  //const wallets: ConnectedStandardSolanaWallet[]
  const navigate = useNavigate()

  const { user, ready, authenticated, getAccessToken, } = usePrivy();
  const {login} = useLogin();
  const {logout} = useLogout();
  const [_user, setUser] = useState<string>("");
  const [userType, setUserType] = useState<string|null>(localStorage.getItem("userType"));
  const [id, setId] = useState<string|null>(localStorage.getItem("merchantId"));
  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string|null>(localStorage.getItem("wallet"))
  const [loggedin, setLoggedIn] = useState<boolean>(localStorage.getItem("loggedIn")==='True');
  const [loading, setLoading] = useState(true);

  // Restore session on app load
 

   // Auto-retrieve Privy token whenever authenticated
  useEffect(() => {
    if (!ready) return; // wait for SDK initialization
    if (!authenticated) {
      localStorage.clear()
      navigate("/");

    }
    const syncWithPrivy = async () => {
      if (ready && authenticated) {
        const privyToken = await getAccessToken();
        if (!privyToken) return;
        setAccessToken(privyToken);
        if (!localStorage.getItem("loggedIn")) localStorage.setItem("loggedIn", "True");

      } else {
        setAccessToken(null);
        //setLoggedIn(false);
      }
    };

    syncWithPrivy();
  }, [ready, authenticated, getAccessToken]);


  useEffect(() => {
     
    if (localStorage.getItem("loggedIn")) {
      
      setLoggedIn(localStorage.getItem("loggedIn")==='True')
    }
    setLoading(false);
  }, [localStorage.getItem("loggedIn")]);

 useEffect(() => {
    
    if (
      localStorage.getItem("authToken") &&
       localStorage.getItem("merchantId") &&
         localStorage.getItem("wallet")
    ) 
    
    {
      setToken(localStorage.getItem("authToken"));
      //setUser(JSON.parse(localStorage.getItem("merchantId")));
      setId(localStorage.getItem("merchantId"))
      setWallet(localStorage.getItem("wallet"))
      setUserType(localStorage.getItem("userType"))
  
    }
    //setLoading(false);
  }, [
    localStorage.getItem("authToken"),
       localStorage.getItem("merchantId"),
       localStorage.getItem("userType"),
         localStorage.getItem("wallet")
  ]);

   

  // 🔥 Sync Privy auth → backend → save token
    const syncAuth = async () => {
      
      if (loggedin){
        try {
          
            // The first wallet in the array is the most recently used.
            if (user?.wallet?.address) {
                const address: string = user.wallet.address; 
                setWallet(address)
                console.log("Wallet:", address);
                localStorage.setItem("wallet", address);
              }
          
            //console.log(_wallets)
          
          //const privyToken = await getAccessToken();
          //console.log(privyToken)
          //setAccessToken(privyToken)
          if (accessToken) {
            
            const res = await fetch(`${backendUrl}/api/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
              },
              //body: JSON.stringify({'wallet_address':wallet})
            });

            if (!res.ok) throw new Error("Backend login failed");

            const data = await res.json();
            console.log(data)


            // Assume backend returns { token: "...", user: {...} }
            setToken(data.auth_token);
            setUser(data.display_name);
            setUserType(data.user_type);
            setId(data.user_id);

            localStorage.setItem("authToken", data.auth_token);
             localStorage.setItem("userType", data.user_type);
            localStorage.setItem("merchantId", data.user_id);
          }
        } catch (err) {
          console.error("Auth sync error:", err);
        }
      } /*else {
        setUser('');
        setUserType('');
        setToken(null);
        setWallet('')
        localStorage.removeItem("authToken");
      }*/
    };
    


  const _login = async () => {
    //await connectWallet()
   login(); // opens Privy modal
   //await syncAuth();
  };

  const _logout = () => {
    logout();
    setLoggedIn(false)
    setUser('');
    setUserType(null);
    setToken(null);
    setId(null)
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ id, _user, userType, loading, _login, _logout, syncAuth, token, accessToken, wallet, loggedin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
