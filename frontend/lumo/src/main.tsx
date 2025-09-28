import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Suspense } from "react";
import { BrowserRouter } from "react-router";
import { AppRoutes } from "./routes/AppRoutes";
import App from './App.tsx'
import Providers from './components/providers/PrivyProvider.tsx'
import { AuthProvider } from './components/context/AuthContext.tsx'

import { Buffer } from "buffer";
if (!(window as any).Buffer) (window as any).Buffer = Buffer;


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
