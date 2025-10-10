// src/App.tsx
import React, { useState } from "react";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from './components/context/AuthContext.tsx'
import Providers from "./components/providers/PrivyProvider";
import { MerchantSetupProvider } from "./components/context/MerchantSetupContext.tsx";
import { POSSetupProvider } from "./components/context/MerchantPOSContext.tsx";
import { MerchantPaymentProvider } from "./components/context/MerchantPaymentContext.tsx";

const App: React.FC = () => {
  function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white space-y-4">
      <div className="w-12 h-12 border-4 border-[#C70CCE] border-t-transparent rounded-full animate-spin"></div>
      <span className="text-[#C70CCE] font-semibold">Loading...</span>
    </div>
  );
}
 

  return (
    <Providers>
      <BrowserRouter>
        <AuthProvider>
          
          <MerchantSetupProvider>
            <MerchantPaymentProvider>
          <POSSetupProvider>
            
          
      
            <Suspense fallback={<LoadingScreen />}>
              <AppRoutes />
            </Suspense>
            
          
          </POSSetupProvider>
          </MerchantPaymentProvider>
          </MerchantSetupProvider>
          
        </AuthProvider>
        </BrowserRouter>
      </Providers>
    );
  }

export default App;
