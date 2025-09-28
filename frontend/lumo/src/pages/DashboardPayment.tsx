
import {useEffect, useState} from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card,
     CardContent,
     CardHeader,
     CardDescription,
     CardTitle,
     } from "@/components/ui/card";
import { Search, } from "lucide-react";
import SidePanel from '../components/SidePanel'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Label } from "@/components/ui/label"
import { useMerchantSetup } from "@/components/context/MerchantSetupContext";

import QRCodeButton from "@/components/QRCodeButton";
import PayLinkButton from "@/components/PayLinkButton";
import { useAuth } from "@/components/context/AuthContext";
import type { Productcustom, ProductStandard } from "@/components/PaymentModal";
import { useNavigate } from "react-router";



export default function PaymentsGenerateDashboard() {
    const {merchant} = useMerchantSetup()
    const {wallet, loggedin} = useAuth()
    console.log(wallet)
    const navigate = useNavigate()
  // State for forms
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [availability, setAvailability] = useState("");
  const [coin, setCoin] = useState("sol");
  const [paywallet, setPayWallet] = useState("");

  const [customName, setCustomName] = useState("");
  const [customQuantity, setCustomQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState("");
  const [customCoin, setCustomCoin] = useState("sol");
  const [customWallet, setCustomWallet] = useState("");
   const [itemPrice, setItemPrice] = useState(10);
   
   const customPaymentData: Productcustom ={
            name:customName,
            price:itemPrice,
            quantity:customQuantity,
            message:customMessage,
            coin:customCoin,
            wallet:wallet,
            type:'custom'
        }
    const paymentData: ProductStandard ={
            name:productName,
            price:itemPrice, // an API call to pull the price of stored products
            quantity:quantity,
            message:message,
            coin:coin,
            wallet:wallet,
            type:'standard'
        }

 useEffect(()=>{
    if (!loggedin){
        navigate('/')
    }
 },[loggedin, navigate])

  return (
    <div className="flex min-h-screen bg-[#F8F3F8]">
      {/* Sidebar */}
      <SidePanel parentName={"Payments"} childName={"Generate payment"} merchant={merchant}/>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-lg font-semibold mb-8">
          Quickly generate payments links or QR codes. Pay from your dashboard or send to terminal
        </h1>

        
        <div className="flex w-full flex-col gap-6">
      <Tabs className="" defaultValue="payment">
        <TabsList >
          <TabsTrigger className="bg-inherit cursor-pointer" value="payment">Payment</TabsTrigger>
          <TabsTrigger className="bg-inherit cursor-pointer" value="custom-payment">Custom payment</TabsTrigger>
        </TabsList>
        {/* Payment Section */}
        <TabsContent value="payment">
        <Card className="mb-12 bg-inherit">
             <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>
                Generate payment links or QR codes for your products here. 
              </CardDescription>
            </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 justify-center">
                <Label htmlFor="search">Product name</Label>
              <div className="relative">
                <Input
                id="search"
                type="search"
                  placeholder="search..."
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="pl-10 border border-pink-300"
                />
                
                <Search  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <Label htmlFor="quantity">Quantity</Label>
              <Input 
              id="quantity" 
              type="number"
                value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-pink-300"
                />
                </div>
              
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 justify-center">
                <Label htmlFor="message">Message (optional)</Label>
              <Input
              id="message"
                placeholder="your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-pink-300"
              />
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <Label htmlFor="product">Product availability</Label>
              <Input
                id="product"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="border border-pink-300"
              />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 justify-center">
              <Label htmlFor="coin">Coin or token</Label>
              <Select value={coin} onValueChange={setCoin}>
                <SelectTrigger className="border border-pink-300">
                  <SelectValue placeholder="Coin or token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sol">SOL</SelectItem>
                  <SelectItem value="usdc">USDC</SelectItem>
                </SelectContent>
              </Select>
              </div>
              <div className="flex flex-col gap-2 justify-center">
              <Label htmlFor="wallet">Select preferred wallet address</Label>
              <Select value={paywallet} onValueChange={setPayWallet}>
                <SelectTrigger className="border border-pink-300">
                  <SelectValue placeholder="Select preferred wallet address" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={wallet}>{wallet}</SelectItem>
                  {/*<SelectItem value="wallet2">4Fd...K92M</SelectItem>*/}
                </SelectContent>
              </Select>
              </div>
            </div>

            <div className="flex gap-4">
                <QRCodeButton paymentData={paymentData} />
              <PayLinkButton paymentData={paymentData} />
            </div>
          </CardContent>
        </Card>
        </TabsContent>


            {/* Custom Payment Section */}
        <TabsContent value="custom-payment">
            
        <Card className="mb-12 bg-inherit">
            <CardHeader>
              <CardTitle>Custom payment</CardTitle>
              <CardDescription>
                Generate custom payment here. Custom payment allows to for anything that may or may
                not be in products database 
              </CardDescription>
            </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 justify-center">
                <Label htmlFor="product-custom">Custom pay or product name</Label>
              <Input
              id="product-custom"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="border border-pink-300"
              />
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <Label htmlFor="quantity">Quantity</Label>
              <Input 
              id="quantity" 
              type="number"
                value={customQuantity} onChange={(e) => setCustomQuantity(Number(e.target.value))}
                className="border border-pink-300"
                />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
             <div className="flex flex-col gap-2 justify-center">
                <Label htmlFor="message">Message (optional)</Label>
              <Input
              id="message"
                placeholder="your message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="border border-pink-300"
              />
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <Label htmlFor="item-price">Item price (USD)</Label>
              <Input 
              id="item-price" 
              type="text"
                value={itemPrice} onChange={(e) => setItemPrice(Number(e.target.value))}
                className="border border-pink-300"
                />
                </div>
              
            </div>

            <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 justify-center">
              <Label htmlFor="coin">Coin or token</Label>
              <Select value={customCoin} onValueChange={setCustomCoin}>
                <SelectTrigger className="border border-pink-300">
                  <SelectValue placeholder="Coin or token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sol">SOL</SelectItem>
                  <SelectItem value="usdc">USDC</SelectItem>
                </SelectContent>
              </Select>
              </div>
              <div className="flex flex-col gap-2 justify-center">
              <Label htmlFor="wallet">Select preferred wallet address</Label>
              <Select value={customWallet} onValueChange={setCustomWallet}>
                <SelectTrigger className="border border-pink-300">
                  <SelectValue placeholder="Select preferred wallet address" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={wallet}>{wallet}</SelectItem>
                  {/*<SelectItem value="wallet2">4Fd...K92M</SelectItem>*/}
                </SelectContent>
              </Select>
              </div>
            </div>


            <div className="flex gap-4">
              <QRCodeButton paymentData={customPaymentData} />
              <PayLinkButton paymentData={customPaymentData} />
            </div>
          </CardContent>
        </Card>
        </TabsContent>
        </Tabs>
        </div>
        

        
      </main>
    </div>
  );
}
