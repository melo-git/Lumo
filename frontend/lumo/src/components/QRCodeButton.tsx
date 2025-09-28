import { useState } from "react";
import { Button } from "./ui/button";
import { QRCodeModal, type Productcustom, type ProductStandard } from "./PaymentModal";
import { QrCode } from "lucide-react";


export default function QRCodeButton({paymentData}:{paymentData:ProductStandard|Productcustom}) {
  const [qrOpen, setQrOpen] = useState(false);

  /*const handleSendToPOS = async (type: "qr" | "link") => {
    await fetch("/api/payments/send-to-pos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    alert("Sent to POS successfully!");
  };*/

  return (
    <>
      <Button 
      variant="outline"
      className="border-pink-400 text-pink-600 flex items-center gap-2"
      onClick={() => setQrOpen(true)}>
        <QrCode className="h-4 w-4" />Generate QR Code
        </Button>

      <QRCodeModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        paymentData={paymentData}
      />

      
    </>
  );
}
