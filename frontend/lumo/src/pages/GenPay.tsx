```tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, QrCode, Link as LinkIcon } from "lucide-react";

export default function PaymentsGenerateDashboard() {
  // State for forms
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [availability, setAvailability] = useState("");
  const [coin, setCoin] = useState("sol");
  const [wallet, setWallet] = useState("wallet1");

  const [customName, setCustomName] = useState("");
  const [customQuantity, setCustomQuantity] = useState("1");
  const [customMessage, setCustomMessage] = useState("");
  const [customCoin, setCustomCoin] = useState("sol");
  const [customWallet, setCustomWallet] = useState("wallet1");

  const handleGenerateQR = (type: "standard" | "custom") => {
    if (type === "standard") {
      console.log("Generate QR for:", { productName, quantity, message, availability, coin, wallet });
    } else {
      console.log("Generate QR for custom:", { customName, customQuantity, customMessage, customCoin, customWallet });
    }
  };

  const handleGenerateLink = (type: "standard" | "custom") => {
    if (type === "standard") {
      console.log("Generate Link for:", { productName, quantity, message, availability, coin, wallet });
    } else {
      console.log("Generate Link for custom:", { customName, customQuantity, customMessage, customCoin, customWallet });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F3F8]">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-pink-200 to-pink-300 p-4">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-pink-400 mr-2"></div>
          <span className="font-semibold">Business_name</span>
        </div>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-between">
            Products
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            POS terminals
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Transactions
          </Button>
          <Button className="w-full justify-between bg-pink-400 text-white">
            Payments
          </Button>
          <div className="ml-4">
            <Button className="w-full justify-start bg-pink-500 text-white">
              Generate payment
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              View payments
            </Button>
          </div>
          <Button variant="ghost" className="w-full justify-start">
            Inventory
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Staff management
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Account
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-500">
            Log out
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-lg font-semibold mb-8">
          Quickly generate payments links or QR codes. <br /> Pay from your dashboard or send to terminal
        </h1>

        {/* Payment Section */}
        <Card className="mb-12">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <Input
                  placeholder="search..."
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="pl-10 border border-pink-300"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Select value={quantity} onValueChange={setQuantity}>
                <SelectTrigger className="border border-pink-300">
                  <SelectValue placeholder="Quantity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Input
                placeholder="message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-pink-300"
              />
              <Input
                placeholder="product availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="border border-pink-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Select value={coin} onValueChange={setCoin}>
                <SelectTrigger className="border border-pink-300">
                  <SelectValue placeholder="Coin or token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sol">SOL</SelectItem>
                  <SelectItem value="usdc">USDC</SelectItem>
                </SelectContent>
              </Select>
              <Select value={wallet} onValueChange={setWallet}>
                <SelectTrigger className="border border-pink-300">
                  <SelectValue placeholder="Select preferred wallet address" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallet1">9Yi...VX88</SelectItem>
                  <SelectItem value="wallet2">4Fd...K92M</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="border-pink-400 text-pink-600 flex items-center gap-2"
                onClick={() => handleGenerateQR("standard")}
              >
                <QrCode className="h-4 w-4" /> Generate QR code
              </Button>
              <Button
                variant="outline"
                className="border-pink-400 text-pink-600 flex items-center gap-2"
                onClick={() => handleGenerateLink("standard")}
              >
                <LinkIcon className="h-4 w-4" /> Generate payment link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Payment Section */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input
                placeholder="Custom pay or product name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="border border-pink-300"
              />
              <Select value={customQuantity} onValueChange={setCustomQuantity}>
                <SelectTrigger className="border border-pink-300">
                  <SelectValue placeholder="Quantity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Input
                placeholder="message (optional)"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="border border-pink-300"
              />
              <Select value={customWallet} onValueChange={setCustomWallet}>
                <SelectTrigger className="border border-pink-300">
                  <SelectValue placeholder="Select preferred wallet address" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallet1">9Yi...VX88</SelectItem>
                  <SelectItem value="wallet2">4Fd...K92M</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-6">
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

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="border-pink-400 text-pink-600 flex items-center gap-2"
                onClick={() => handleGenerateQR("custom")}
              >
                <QrCode className="h-4 w-4" /> Generate QR code
              </Button>
              <Button
                variant="outline"
                className="border-pink-400 text-pink-600 flex items-center gap-2"
                onClick={() => handleGenerateLink("custom")}
              >
                <LinkIcon className="h-4 w-4" /> Generate payment link
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
```
