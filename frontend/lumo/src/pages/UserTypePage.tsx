// src/pages/UserTypePage.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";
import { redirect, useNavigate } from "react-router";
import SetupMerchantButton from '../components/MerchantSetupButton'



const UserTypePage: React.FC = () => {
  const [openMerchantModal, setOpenMerchantModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const {_logout, loggedin } = useAuth();
  const [home, setHome] =useState(false);
  const navigate = useNavigate();
  useEffect(() => {
     if(home){navigate('/')}
     setHome(false)
  }, [loggedin])

  const merchantFeatures = [
    "Add and manage your products and services. Track inventory",
    "Generate QR codes or payment links. Send to the POS terminal or let your customers pay from your dashboard window",
    "Generate AI-driven insights and analytics for your business, and see how to scale and grow",
    "Setup your receiving or paying wallets",
    "Assign roles to your staff members and decide what access they have",
  ];

  const userFeatures = [
    "Earn loyalty points from doing business or buying from any Lumo merchants/vendors",
    "Qualify for airdrops and premium discounts",
    "Track and get insights into your spending and transactions with our AI-powered analytics",
    "Setup your receiving or paying wallets",
  ];

  if (loggedin){return (

    <div className="min-h-screen flex flex-col bg-[#fff]">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-[#FF7A00]">Lumo</h1>
        <Button
        onClick={() => {
            _logout();
            setHome(true)
        }}
          variant="outline"
          className="bg-white border-[#C70CCE] border-b-[7px] border-t-[2px]
        border-l-[2px] border-r-[2px] text-[#C70CCE] hover:bg-purple-100"
        >
          Log out
        </Button>
      </header>

      {/* Main Section */}
      <main className="flex flex-col items-center justify-center flex-grow py-16">
        <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl px-6">
          {/* Merchant Card */}
          <Card className="bg-[#FFA500] rounded-xl flex gap-4 pt-0 shadow-lg overflow-hidden">
            <div className="bg-[#C70CCE] rounded-md text-white text-center py-10  text-lg font-semibold">
              Continue as a Merchant
            </div>
            <CardContent className="   p-6 space-y-4 ">
              {merchantFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[#821E85]">
                  <span className="flex items-center justify-center w-7 h-7 flex shrink-0 rounded-full 
      bg-[#C70CCE40]"><Check size={35} className="w-5 h-5 text-[#FFA500]" /></span>
                  <p className=" text-sm">{feature}</p>
                </div>
              ))}

              <SetupMerchantButton />   
            </CardContent>
          </Card>

          {/* User Card */}
          <Card className="bg-[#FFA500]  rounded-xl pt-0 shadow-lg overflow-hidden">
            <div className="bg-[#C70CCE] rounded-md text-white text-center py-10 text-lg font-semibold">
              Continue as a User
            </div>
            <CardContent className="p-6 space-y-4">
              {userFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[#821E85]">
                  <span className="flex items-center justify-center w-7 h-7 flex shrink-0 rounded-full 
      bg-[#C70CCE40]"><Check strokeWidth={5} size={35} className="w-5 h-5 text-[#FFA500]" /></span>
                  <p className=" text-sm">{feature}</p>
                </div>
              ))}

              <Button
                onClick={() => setOpenUserModal(true)}
                className="w-full mt-22 bg-white border-[#C70CCE] border-b-[7px] border-t-[2px]
        border-l-[2px] border-r-[2px] text-[#C70CCE] hover:bg-purple-50"
              >
                Start collecting points
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-pink-100 text-center py-6 text-sm text-gray-600">
        <h1 className="text-lg font-bold text-[#FF7A00] mb-1">Lumo</h1>
        <p>© 2025 Lumo. All rights reserved</p>
      </footer>
      
    </div>
    
    
  );
}
else{navigate('/')}
};

export default UserTypePage;
