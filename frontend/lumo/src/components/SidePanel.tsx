import { useEffect, useState } from "react";
import {
  Home,
  Boxes,
  Cpu,
  Wallet,
  WalletMinimal,
  QrCode,
  Package,
  PackagePlus,
  FileText,
  Users,
  UserCog,
  LogOut,
  ChevronRight,
  ArrowRightLeft,
  ChartNoAxesColumn,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";
import type { MerchantResponse } from "./context/MerchantSetupContext";
import { useAuth } from "./context/AuthContext";

// MerchantDashboard.tsx
// Single-file React + TypeScript component implementing the dashboard UI
// TailwindCSS is used for styling (assumes Tailwind is configured in the project).

export default function MerchantDashboard(
    {childName, parentName, merchant}:
    {childName:string|null, parentName:string, merchant:MerchantResponse|null}

) {
    const navigate = useNavigate()
    const {_logout, loggedin} = useAuth()
    const [loggedout, setLoggedout] = useState(false)

    useEffect(()=>{
        if(loggedout){
            navigate('/')
            setLoggedout(false)
        }
    }, [loggedin])


    
    const pageNavigator = (link:string) => {
        navigate("/"+ link)
    }
  const menu = [
      { label: "Home", icon: Home, active: parentName === "Home" || false, chevron: false, link:"dashboard" },

      {
            label: "Products",
            icon: Package,
            active: parentName === "Products" || false,
            chevron: true ,
            link: "dashboard/products/add",
            children: [
              { label: "Add product", icon: PackagePlus, childActive:childName === "Add product" || false,
                link:"dashboard/products/add"

              },

              { label: "View products", icon: FileText, childActive:childName === "View products" || false,
                link:"dashboard/products/view"
               },
            ],
          },
      
      { label: "POS terminals", icon: Cpu, active: parentName === "POS terminals" || false, chevron: false,
        link:"dashboard/pos-terminals"
       },
      { label: "Transactions", icon: ArrowRightLeft, active: parentName === "Transactions" || false, chevron: false,
        link:"dashboard/transactions"
       },

      {
            label: "Payments",
            icon: Wallet,
            active: parentName === "Payments" || false,
            chevron: true ,
            link: "dashboard/payment/generate",
            children: [
              { label: "Generate payment", icon: QrCode, childActive:childName === "Generate payment" || false,
                link:"dashboard/payment/generate"

              },

              { label: "View payments", icon: FileText, childActive:childName === "View payment" || false,
                link:"dashboard/payment/view"
               },
            ],
      },

      {
            label: "Inventory",
            icon: Boxes,
            active: parentName === "Inventory" || false,
            chevron: true ,
            link:"dashboard/inventory/add",
            children: [
              { label: "Add inventory", icon: PackagePlus, childActive:childName === "Add inventory" || false,
                link:"dashboard/inventory/add"
              },

              { label: "View inventory", icon: FileText, childActive:childName === "View inventory" || false,
                link:"dashboard/inventory/view"
               },
            ],
      },


      { label: "Analytics", icon: ChartNoAxesColumn, chevron: false, link:"dashboard/analytics" },


      {
            label: "Staff management",
            icon: Users,
            active: parentName === "Staff management" || false,
            chevron: true ,
            link:"dashboard/staff/add",
            children: [
              { label: "Add staff", icon: Users, childActive:childName === "Add staff" || false,
                link:"dashboard/staff/add",
              },

              { label: "View staff", icon: FileText, childActive:childName === "View staff" || false,
                link:"dashboard/staff/view",
               },
            ],
       },

       {
            label: "Account",
            icon: UserCog,
            active: parentName === "Account" || false,
            chevron: true ,
            link:"dashboard/account/profile",
            children: [
              { label: "Profile", icon: User, childActive:childName === "Profile" || false,
                link:"dashboard/account/profile",

              },

              { label: "Wallets", icon: WalletMinimal, childActive:childName === "Wallet" || false,
                link:"dashboard/account/wallets",
               },
            ],
          },
    ];

    return (
        <>
        {/* Left Sidebar */}

        <aside className="w-72 bg-gradient-to-b from-pink-200 to-pink-100 border-r border-pink-300 p-6 flex flex-col">
                <div className="flex items-center gap-4">
                  {/*Avater <div className="w-12 h-12 bg-black rounded-full" />*/}
                  <div>
                    <div className="text-lg font-mono">{merchant?.business_name||"business_name"}</div>
                  </div>
                </div>
        
                <nav className="mt-8 flex-1">
                  <ul className="space-y-3">
                    {menu.map((m) => (
                                  <li key={m.label}>
                                    <div>
                                      <button
                                      onClick={() => {pageNavigator(m.link)}}
                                        className={`w-full flex items-center gap-4 text-left cursor-pointer rounded-xl px-3 py-2 transition-all hover:bg-pink-100/60 ${
                                          m.active ? "bg-pink-300/50 shadow-sm" : ""
                                        }`}
                                      >
                                        <m.icon strokeWidth={1} className="w-5 h-5" />
                                        <span className="flex-1">{m.label}</span>
                                        {m.children && <ChevronRight className="w-4 h-4 opacity-60" />}
                                      </button>
                                      {m.children && m.label === parentName && m.active && (
                                        <ul className="ml-10 mt-2 space-y-2">
                                          {m.children.map((child) => (
                                            <li key={child.label}>
                                              <button
                                                className={`w-full flex items-center gap-3 text-left rounded-lg px-2 py-1 transition-all hover:bg-pink-100/60 ${
                                                  child.childActive ? "bg-pink-300/50 shadow-sm" : ""
                                                }`}
                                              >
                                                <child.icon strokeWidth={1} className="w-4 h-4" />
                                                <span>{child.label}</span>
                                              </button>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  </li>
                                ))}
                    
        
                    <li>
                      <button onClick={()=>{_logout(); setLoggedout(true) }} className="w-full cursor-pointer flex items-center gap-4 text-left rounded-xl px-3 py-2 text-rose-600">
                        <LogOut className="w-5 h-5" />
                        <span>Log out</span>
                      </button>
                    </li>
                  </ul>
                </nav>
        
                <div className="text-xs text-pink-700 mt-6">&nbsp;</div>
              </aside>
        </>
        
        );
}
