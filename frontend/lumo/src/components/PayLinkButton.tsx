import { useState } from "react";
import { PaymentLinkModal, type Productcustom, type ProductStandard } from "./PaymentModal";
import { Button } from "./ui/button";
import { LinkIcon } from "lucide-react";

export default function PayLinkButton({paymentData}:{paymentData:ProductStandard|Productcustom}) {
  const [linkOpen, setLinkOpen] = useState(false);

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
      onClick={() => setLinkOpen(true)}>
        <LinkIcon className="h-4 w-4" /> Generate payment link
        </Button>

      <PaymentLinkModal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        paymentData={paymentData}
      />
    </>
  );
}
