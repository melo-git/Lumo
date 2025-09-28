// components/CustomLoginModal.tsx
import { useLoginModal } from "./hooks/useLoginModal";
import { usePrivy } from "@privy-io/react-auth";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

export default function CustomLoginModal() {
  const loginModal = useLoginModal();
  const { login: privyLogin, getAccessToken, authenticated } = usePrivy();
  const { loginBackend } = useAuth();

  // 🔥 Sync Privy auth → backend → close modal
  useEffect(() => {
    const syncAuth = async () => {
      if (authenticated && loginModal.isOpen) {
        try {
          const privyToken = await getAccessToken();
          if (privyToken) {
            await loginBackend(privyToken); // send token to backend
            loginModal.onClose();           // close modal once logged in
          }
        } catch (err) {
          console.error("Privy sync error:", err);
        }
      }
    };
    syncAuth();
  }, [authenticated]);

  // 🔥 Open Privy modal when our modal opens
  useEffect(() => {
    if (loginModal.isOpen) {
      privyLogin(); // this opens Privy’s native modal
    }
  }, [loginModal.isOpen]);

  // No UI needed because Privy handles it
  return null;
}
