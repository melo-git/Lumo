import React, { useEffect } from "react";
import {
  Home,
  Boxes,
  Cpu,
  Wallet,
  WalletMinimal,
  Bot,
  QrCode,
  Package,
  PackagePlus,
  Users,
  UserCog,
  LogOut,
  ChevronRight,
  ArrowRightLeft,
  ArrowRight,
} from "lucide-react";
import SidePanel from '../components/SidePanel'
import { useMerchantSetup, } from "@/components/context/MerchantSetupContext";
import { Link, useNavigate } from "react-router";


// MerchantDashboard.tsx
// Single-file React + TypeScript component implementing the dashboard UI
// TailwindCSS is used for styling (assumes Tailwind is configured in the project).

export default function MerchantDashboard() {
    const {merchant} = useMerchantSetup()

  const cards = [
    {
      title: "Generate payment link or QR code",
      subtitle:
        "Quickly generate payments links or QR codes for your products or a custom sale. Pay from your dashboard or send to terminal",
      icon: QrCode,
      link:'/dashboard/payment/generate'
    },
    {
      title: "Add and setup wallets",
      subtitle:
        "Add wallets to receive payments from customers, or send payments to others. Connect additional wallets to your account.",
      icon: WalletMinimal,
      link:'/dashboard/account/wallets'
    },
    {
      title: "Add POS terminals",
      subtitle:
        "Add terminals to receive your generated payment links or QR codes. Add as many as you want to deploy to ramp up sales.",
      icon: Cpu,
      link:'/dashboard/pos-terminals'
    },
    {
      title: "Start adding products",
      subtitle:
        "Quickly generate payments links or QR codes. Pay from your dashboard or send to terminal",
      icon: PackagePlus,
      link:'/dashboard/products/add'
    },
    {
      title: "View your transactions",
      subtitle: "All your transactions in one place. Know which transaction has been confirmed, is pending or has failed",
      icon: ArrowRightLeft,
      link:'/dashboard/transactions'
    },
    {
      title: "Generate AI-driven insights",
      subtitle:
        "Quickly get insights from the Lumo AI assistant about your sales, transactions, payments and products. Make smart decisions effortlessly.",
      icon: Bot,
      link:'/dashboard/analytics'
    },
    {
      title: "Manage and track inventory",
      subtitle:
        "Quickly generate payments links or QR codes. Pay from your dashboard or send to terminal",
      icon: Boxes,
      link:'/dashboard/inventory/add'
    },
    {
      title: "Manage and add staff",
      subtitle:
        "Quickly generate payments links or QR codes. Pay from your dashboard or send to terminal",
      icon: Users,
      link:'/dashboard/staff/add'
    },
  ];

 

  return (
    
    <div className="min-h-screen flex bg-[#fff7fb] text-slate-900">
      {/* Left Sidebar */}
      <SidePanel parentName={"Home"} childName={null} merchant={merchant} />
      {/* Main content */}
      <main className="flex-1 p-12">
        <header>
          <h1 className="text-2xl font-semibold">Welcome, {merchant?.business_name||"business_name"}. Start generating sales quickly</h1>
        </header>

        <section className="mt-8 grid grid-cols-1 gap-12">
          {cards.map((c) => (
            <Link to={c.link} key={c.title}>
            <article
              key={c.title}
              className=" flex items-center justify-between border border-[#C70CCE]/30 rounded-xl p-6  hover:shadow-md shadow-[#C70CCE]/70"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-md flex items-center justify-center mt-2">
                  <c.icon strokeWidth={1} size={35} className=" text-[#FF0000]" />
                </div>
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 max-w-[56rem]">{c.subtitle}</p>
                </div>
              </div>

              <div>
                <ArrowRight className="w-6 h-6 text-[#C70CCE]" />
              </div>
            </article>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
