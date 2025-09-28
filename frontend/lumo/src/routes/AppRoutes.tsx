// src/routes/AppRoutes.tsx
import { useNavigate, useRoutes } from "react-router";
import { lazy } from "react";

// --- Lazy-loaded features/pages ---
const Home = lazy(() => import("../pages/Home")); // placeholder for landing page
const UserTypePage = lazy(() => import("../pages/UserTypePage")); // user type selection
const DashboardHome = lazy(() => import("../pages/DashboardHome")); // merchant dashboard
const DashboardProducts = lazy(() => import("../pages/DashboardProducts")); // merchant dashboard for products
const DashboardPOS = lazy(() => import("../pages/DashboardTerminal"));
const DashboardPayment = lazy(() => import("../pages/DashboardPayment"));
//const TransactionsPage = lazy(() => import("@/pages/TransactionsPage")); // POS transactions
//const ProfilePage = lazy(() => import("@/pages/ProfilePage")); // user/merchant profile
//const SettingsPage = lazy(() => import("@/pages/SettingsPage")); // app settings
//const NotFoundPage = lazy(() => import("@/pages/NotFoundPage")); // 404 fallback

export function AppRoutes() {
  const navigate = useNavigate();

  return useRoutes([
    // Home (landing page)
    { index: true, element: <Home /> },

    // UserType selection (new users)
    { path: "user-type", element: <UserTypePage /> },
    { path: "home", element: <Home /> },

    // Dashboard (for logged-in merchants/customers)
    { path: "dashboard", element: <DashboardHome /> },

    { path: "dashboard/products/add", element: <DashboardProducts /> },

    { path: "dashboard/pos-terminals", element: <DashboardPOS /> },


    { path: "dashboard/payment/generate", element: <DashboardPayment /> },

    // Transactions / POS flow
    //{ path: "transactions", element: <TransactionsPage /> },

    // Profile + Settings
    //{ path: "profile", element: <ProfilePage /> },
    //{ path: "settings", element: <SettingsPage /> },

    // Catch-all route (404)
    //{ path: "*", element: <NotFoundPage /> },
  ]);
}
