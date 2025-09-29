import { createContext, useContext, useEffect, useState } from "react";
import { usePrivy, useLogin, useLogout } from "@privy-io/react-auth";
//import { ConnectedStandardSolanaWallet } from "@privy-io/react-auth/solana";


const backendUrl = import.meta.env.VITE_LUMO_BACKEND_URL || 'http://localhost:8000'

interface AuthContextType {
  id: Number|null;
  _user: string;
  userType: string;
  loading: boolean;
  _login: () => Promise<void>;
  _logout: () => void;
  token: string | null;
  accessToken: string | null;
  wallet: string;
  loggedin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  //const wallets: ConnectedStandardSolanaWallet[]
  

  const { connectWallet, user, ready, authenticated, getAccessToken } = usePrivy();
  const {login} = useLogin();
  const {logout} = useLogout();
  const [_user, setUser] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [id, setId] = useState<Number|null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string>('')
  const [loggedin, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 🔥 Sync Privy auth → backend → save token
  useEffect(() => {
    const syncAuth = async () => {
      if (ready && authenticated){
        try {
          
            // The first wallet in the array is the most recently used.
            if (user?.wallet?.address) {
                const address: string = user.wallet.address; 
                setWallet(address)
                console.log("Wallet:", address);
              }
          
            //console.log(_wallets)
          
          const privyToken = await getAccessToken();
          setAccessToken(privyToken)
          if (privyToken) {
            setLoggedIn(true)
            const res = await fetch(`${backendUrl}/api/login`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${privyToken}`,
                "Content-Type": "application/json",
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
          }
        } catch (err) {
          console.error("Auth sync error:", err);
        }
      } else {
        setUser('');
        setUserType('');
        setToken(null);
        setWallet('')
        localStorage.removeItem("authToken");
      }
    };
    syncAuth();
  }, [ready, authenticated]);

  const _login = async () => {
    //await connectWallet()
    await login(); // opens Privy modal
  };

  const _logout = () => {
    logout();
    setLoggedIn(false)
    setUser('');
    setUserType('');
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ id, _user, userType, loading, _login, _logout, token, accessToken, wallet, loggedin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
