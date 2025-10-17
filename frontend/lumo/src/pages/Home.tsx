import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Cpu, CreditCard, Wallet, CircleCheckBig, Brain, BanknoteArrowDown } from "lucide-react";
import SolanaLogo from '../assets/solanaLogoMark.svg'
import P2P from '../assets/people-arrows-solid-full.svg'
import { useAuth } from "../components/context/AuthContext";
import { useNavigate } from "react-router";
//import Providers from "../components/providers/PrivyProvider";




const Home: React.FC = () => {
  const {_user, _login, _logout, token, accessToken, loggedin, userType, syncAuth } = useAuth();
  //console.log("token: ", accessToken)
  const navigate = useNavigate()
  const [btn, setBtn] = useState(false)


useEffect(() => {
    if(loggedin) {
        syncAuth()
  }

}, [loggedin])


  useEffect(() => {
    if(btn) {
        setBtn(false)
        switch (userType) {
            case 'Merchant':
                navigate('/dashboard');
                break;
            case 'User':
                navigate('/user/dashboard')
                break;
            case 'new':
                navigate('/user-type')
                break;
            default:
                navigate('/')
        }
        
        
  }

}, [userType])

const goToDashboard = ()=> {
  navigate('/dashboard')
}

  return (
    
    <div className="min-h-screen w-full flex flex-col bg-[rgba(255, 255, 255, 1)] bg-[rgba(199,12,206,0.04)] text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 shadow-md shadow-fuchsia-600/6">
        <h1 className="text-2xl font-bold text-gradient">Lumo</h1>
        {loggedin ? (<div className="flex gap-2">
          <Button onClick={goToDashboard} variant="outline" className="border-[#C70CCE] text-[#C70CCE] hover:shadow-md shadow-[#C70CCE] hover:border-white hover:bg-[#C70CCE] hover:cursor-pointer hover:text-white">
          Dashboard
        </Button>
          <Button onClick={_logout} variant="outline" className="border-[#C70CCE] border-b-[7px] border-t-[2px]
        border-l-[2px] border-r-[2px] text-[#C70CCE] hover:shadow-md hover:shadow-[#C70CCE] hover:bg-[#C70CCE] hover:text-white hover:cursor-pointer">
          Log out
        </Button> 
        </div>): 
        (<Button onClick={() =>{_login(); setBtn(true)}} variant="outline" className="border-[#C70CCE] border-b-[7px] border-t-[2px]
        border-l-[2px] border-r-[2px] text-[#C70CCE] hover:bg-[#C70CCE] hover:shadow-md hover:shadow-[#C70CCE] hover:text-white hover:cursor-pointer">
          Login/Sign up
        </Button>)}
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 py-16 
      bg-[radial-gradient(circle_at_bottom_left,rgba(228, 135, 231, 0.01), rgba(199, 12, 206, 0.01),
       rgba(255, 255, 255, 0.3)), radial-gradient(circle_at_top_right,rgba(228, 135, 231, 0.02), rgba(199, 12, 206, 0.01),
       rgba(255, 255, 255, 1))] border-b-[0.1px] border-fuchsia-600/6">
        <p className="text-gray-400">Introducing Lumo</p>
        <h2 className="text-3xl font-bold mt-2">
          Your Crypto POS System
        </h2>
        <h3 className="text-xl font-bold text-red-600 mt-2">
          For Everyday Physical Business and Spending.
        </h3>
        <p className="text-gray-500 mt-4">With No Fear. No Trust Issues.</p>

        <Button onClick={_login} className="mt-6 bg-[#C70CCE] hover:bg-[#C70CCE] text-white px-20 py-3 rounded-xl shadow">
          Login/Sign up
        </Button>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 ">
          <span className="px-4 py-0.5 rounded-full bg-[#FFC0CB] text-[#C70CCE] text-sm font-medium 
          shadow-[0_2px_3.4px_0.1px_#C70CCE] flex items-center gap-2">
            <CircleCheckBig size={16}/>Near-zero transaction fees
          </span>
          <span className="px-4 py-0.5 rounded-full bg-[#FFC0CB] text-[#C70CCE] text-sm font-medium
          shadow-[0_2px_3.4px_0.1px_#C70CCE] flex items-center gap-2">
            <Brain size={16}/> AI analytics ready
          </span>
          <span className="px-4 py-0.5 rounded-full bg-[#FFC0CB] text-[#C70CCE] text-sm font-medium
          shadow-[0_2px_3.4px_0.1px_#C70CCE] flex items-center gap-2">
             Powered by <img src={SolanaLogo} height={14} width={14} alt="" /> Pay
          </span>
        </div>
      </section>

      {/* Features */}
      <main className="mt-16 grid gap-10 max-w-3xl mx-auto px-6">
        <FeatureCard
          icon={<BanknoteArrowDown className="w-8 h-8 text-[#C70CCE]" />}
          title="Everyday Essential And Common Expenses"
          text="Pay for your common and everyday goods and services using your non-custodial Solana wallet. With Lumo you can buy food, books, clothes, phones and other items just like with cash. Earn redeemable points as you do so."
          button="Find merchants"
          login = {_login}
        />

        <FeatureCard
          icon={<img src={P2P} className="w-8 h-8 color-[#C70CCE] text-[#C70CCE]" />}
          title="P2P POS system For Cash, Coin Or Token Transactions"
          text="Need cash for expenses? Transfer tokens to a Lumo vendor and get instant cash. Or swap coins/tokens quickly for fiat."
          button="Start making P2P transactions"
          login = {_login}
        />

        <FeatureCard
          icon={<Brain className="w-8 h-8 text-[#C70CCE]" />}
          title="AI-Powered Business And Spending Analytics"
          text="Leverage AI to generate insights and track expenses. Merchants get analytics to grow, users get spending insights."
          button="Login/Sign up"
          login = {_login}
        />

        <FeatureCard
          icon={<Cpu className="w-8 h-8 text-[#C70CCE]" />}
          title="Payment-Ready POS Terminals"
          text="Vendors can enter payment amounts directly on Lumo terminals, generate QR codes or NFC links, and accept mobile wallet payments instantly."
          button="Get a POS terminal"
          login = {_login}
        />
      </main>

      {/* Footer */}
      <footer className="text-center py-10 text-sm text-gray-500 mt-auto">
        © 2025 Lumo. All rights reserved
      </footer>
    </div>
    
    
  );
};

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
  button: string;
  login: () => void;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, text, button, login }) => (
  <Card className="bg-[rgba(255, 255, 255, 1)] bg-[rgba(199,12,206,0.01)] border-[#C70CCE]/30
  shadow-[0_2px_3.4px_0.1px_#C70CCE]/70 px-6 pt-5 pb-8 rounded-sm"  >
    <CardContent className="flex flex-col gap-4">
      <div className="flex items-center justify-center w-15 h-15 rounded-full 
      bg-[rgba(199,12,206,0.06)]  ">
        {icon}
        
      </div>
      <h3 className="text-xl font-bold font-inconsolata text-gray-600">{title}</h3>
      <p className="text-gray-500">{text}</p>
      <Button onClick={login} className="w-50 bg-white-300 border-[#C70CCE] border-b-[7px] border-t-[2px]
        border-l-[2px] border-r-[2px] text-[#C70CCE]
       px-30 py-2 rounded-lg">
        {button}
      </Button>
    </CardContent>
  </Card>
);

export default Home;
