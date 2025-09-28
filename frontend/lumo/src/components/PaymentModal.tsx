import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import {  encodeURL, type TransferRequestURLFields, findReference, validateTransfer, type TransactionRequestURL, type TransactionRequestURLFields } from "@solana/pay";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { usePayment } from "./context/MerchantPaymentContext";


export interface ProductStandard {
  name: string;
  price: number;
  quantity: number;
   message:string|null;
  coin: string;
  wallet:string;
  type:string;

  //imageUrl: string;
}

export interface Productcustom {
  name: string;
  price: number;
  quantity: number;
  message: string|null;
  coin: string;
  wallet:string|string;
  type:string;

  //imageUrl: string;
}

/**
 * Type shape for the lazily imported `qr-code-styling` constructor.
 * We only need the `append` method here to render the QR into the DOM.
 */
type QRCodeStylingType = new (options: any) => {
  append: (element: HTMLElement) => void;
};


// RPC connection (devnet by default). Swap to mainnet RPC for production.
const connection = new Connection("https://api.devnet.solana.com", "confirmed");



const txDetails = (product: ProductStandard|Productcustom) => {

  if (product.type === 'standard'){
    const recipient = new PublicKey(product.wallet);
    const amount = new BigNumber(product.price);
    const reference = new Keypair().publicKey;
    const label = product.name;
    const message = product.message||`${product.name} purchase`;

    return {
      recipient,
      amount,
      reference,
      label,
      message,
    }
    
  }
  else if (product.type==='custom'){
    const recipient = new PublicKey(product.wallet);
    const amount = new BigNumber(product.price*product.quantity);
    const reference = new Keypair().publicKey;
    const label = product.name;
    const message = product.message||`${product.name} purchase`;

    return {
      recipient,
      amount,
      reference,
      label,
      message,
    }
  }
  
 
  }



interface QRModalProps {
  open: boolean;
  onClose: () => void;
  paymentData: ProductStandard|Productcustom;
}

export const QRCodeModal: React.FC<QRModalProps> = ({ open, onClose, paymentData }) => { 

  //const [products, setProducts] = useState<Product[]>([]);
  //const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [QRCodeStylingComponent, setQRCodeStylingComponent] =
    useState<QRCodeStylingType | null>(null);

    

const product = paymentData
const recipient = new PublicKey(product.wallet);
  let txxDetails:TransferRequestURLFields = {recipient};
  
  if (product.type === 'standard'){
    const recipient = new PublicKey((product.wallet));
    const amount = new BigNumber(product.price);
    const reference = new Keypair().publicKey;
    const label = product.name;
    const message = product.message||`${product.name} purchase`;
    

     txxDetails= {
      recipient,
      amount,
      reference,
      label,
      message,
    }
  }
  else if (product.type==='custom'){
    const recipient = new PublicKey(product.wallet);
    const amount = new BigNumber(product.price*product.quantity);
    const reference = new Keypair().publicKey;
    const label = product.name;
    const message = product.message||`${product.name} purchase`;

    txxDetails = {
      recipient,
      amount,
      reference,
      label,
      message,
    }
  }

  const txDetails: TransferRequestURLFields = txxDetails
  const encodedUrl = encodeURL(txDetails)

  const data = {"pay_link":encodedUrl.href}

  const {POSQuery} = usePayment()


  const qrServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(encodedUrl.href)}&format=png&margin=2`;
  
  const toPOS = async() => {
  try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10 seconds

  const res = await fetch(`http://${POSQuery?.ip_addr_used}/api/code-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Optionally add Authorization header if needed
      //Authorization: `Token ${token}`
    },
    body: JSON.stringify(data),
    signal: controller.signal, // attach AbortController
  });

  clearTimeout(timeoutId); // cancel timeout if request finishes in time

  if (!res.ok) {
    throw new Error(`Failed to send payment data to POS: ${res.status}`);
  }

  const responseData = await res.json();
  //setPOS(responseData);
} catch (err: any) {
  if (err.name === "AbortError") {
    console.error("Request timed out after 10 seconds");
  } else {
    console.error("Create merchant error:", err);
  }
  //setError(err.message || "Something went wrong");
}
  }

 

  

  return (<Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="  rounded-2xl p-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Scan QR Code</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-4">
        <img 
        src={qrServiceUrl}
         alt="QR Code" 
         className={` border ${open? "display-block":"display-hidden"} `}
         /></div>
        <div className="flex gap-3">
          <Button onClick={toPOS} className="bg-green-600 hover:bg-green-700">
            Send to Terminal/POS
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-1" /> Close
          </Button>
        </div>
      
    </DialogContent>
  </Dialog>
);}










/* Link */

interface LinkModalProps {
  open: boolean;
  onClose: () => void;
  paymentData: ProductStandard|Productcustom;
  
}

export const PaymentLinkModal: React.FC<LinkModalProps> = ({ open, onClose, paymentData, }) => {
  
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [QRCodeStylingComponent, setQRCodeStylingComponent] =
    useState<QRCodeStylingType | null>(null);

const product = paymentData
const recipient = new PublicKey(product.wallet);
  let txxDetails:TransferRequestURLFields = {recipient};
  
  if (product.type === 'standard'){
    const recipient = new PublicKey(product.wallet);
    const amount = new BigNumber(product.price);
    const reference = new Keypair().publicKey;
    const label = product.name;
    const message = product.message||`${product.name} purchase`;
    

     txxDetails= {
      recipient,
      amount,
      reference,
      label,
      message,
    }
  }
  else if (product.type==='custom'){
    const recipient = new PublicKey(product.wallet);
    const amount = new BigNumber(product.price*product.quantity);
    const reference = new Keypair().publicKey;
    const label = product.name;
    const message = product.message||`${product.name} purchase`;

    txxDetails = {
      recipient,
      amount,
      reference,
      label,
      message,
    }
  }

  const txDetails: TransferRequestURLFields = txxDetails
  const encodedUrl = encodeURL(txDetails)

  const data = {"pay_link":encodedUrl}

  const {POSQuery} = usePayment()




  const [sent, setSent] = useState(false)


  const toPOS = async() => {
try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10 seconds

  const res = await fetch(`http://${POSQuery?.ip_addr_used}/api/code-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Optionally add Authorization header if needed
      //Authorization: `Token ${token}`
    },
    body: JSON.stringify(data),
    signal: controller.signal, // attach AbortController
  });

  clearTimeout(timeoutId); // cancel timeout if request finishes in time

  if (!res.ok) {
    throw new Error(`Failed to send payment data to POS: ${res.status}`);
  }

  const responseData = await res.json();

  setSent(true);
  //setPOS(responseData);
} catch (err: any) {
  if (err.name === "AbortError") {
    console.error("Request timed out after 10 seconds");
  } else {
    console.error("Create merchant error:", err);
  }
  //setError(err.message || "Something went wrong");
}

  }
 const [copied, setCopied] = useState(false);
 
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(encodedUrl.toString());
      setCopied(true);
    } catch (err) {
      console.error("Copy failed", err);
      // optionally set a different error toast state
    }
  };

  // Auto-dismiss toast after 2.5s
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    if ( !sent) return;
    const t = setTimeout(() => setSent(false), 2500);
    return () => clearTimeout(t);
  }, [sent]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" rounded-2xl p-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Payment Link</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className=" flex justify-start gap-2 bg-gray-100 rounded-lg px-3 py-3">
            <span className="wrap-anywhere text-sm text-gray-700">{encodedUrl.toString()}</span>
            <Button size="icon" className="cursor-pointer" variant="ghost" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 " />
            </Button>
          </div>
          <div className="flex gap-10 py-2 mt-4">
            <Button onClick={toPOS} className="cursor-pointer bg-green-600 hover:bg-green-700">
              Send to Terminal/POS
            </Button>
            <Button variant="outline" onClick={onClose} className="">
              <X className="cursor-pointer w-4 h-4 mr-1" /> Close
            </Button>
          </div>


          <div
            aria-live="polite"
            className="pointer-events-none fixed inset-0 flex items-end justify-center p-6"
          >
            <div
              className={`pointer-events-auto transform transition-all duration-200 ${
                copied? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ maxWidth: 360 }}
            >
              <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
                <span className="text-sm">Copied!</span>
              </div>
            </div>
          </div>

           <div
            aria-live="polite"
            className="pointer-events-none fixed inset-0 flex items-end justify-center p-6"
          >
            <div
              className={`pointer-events-auto transform transition-all duration-200 ${
                sent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ maxWidth: 360 }}
            >
              <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
                <span className="text-sm">Sent to POS</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

