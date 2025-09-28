import { Label } from "./ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,

} from '@/components/ui/dialog'
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "./context/AuthContext";
import { useMerchantSetup } from "./context/MerchantSetupContext";
import { useNavigate } from "react-router";

interface SetupModalProps {
  open: boolean;
  onClose: () => void;
}


export default function MerchantSetup({ open, onClose }: SetupModalProps) {
    const {id} = useAuth()
    const {createMerchant, loading, error} = useMerchantSetup()
    const navigate = useNavigate()
  const [bizName, setBizName] = useState("")
  const [email, setEmail] = useState<string|undefined>(undefined)
  const [phone, setPhone] = useState<string|undefined>(undefined)
  const [location, setLocation] = useState("")

  const handleCreateMerchant =  async (e: React.FormEvent) => { 
    e.preventDefault();
        await createMerchant(
                {
                    user_id: id,
                    business_name: bizName,
                    location: location,
                    phone: phone,
                    email: email,
                    status: "active"
                });

            setEmail(undefined)
            setPhone(undefined)
            if (!loading && !error){
                navigate('/dashboard')
            }
            else{
                navigate('/user-type')
            }
        
        }
        

 

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#fff7fb] border border-pink-300 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Setup your Merchant account and start accepting payments
right away.</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateMerchant}>

        <div className="flex flex-col gap-4 mt-2">
            
            <div className="flex flex-col gap-2 justify-center">
            <Label htmlFor="biz-name">Business name <span className="text-red">*</span></Label>
          <Input
          id="biz-name"
            type="text"
            placeholder="your business name"
            className="w-full p-2 rounded bg-inherit border border-pink-300"
            value={bizName}
            onChange={(e) => setBizName(e.target.value)}
          />
          </div>

          <div className="flex flex-col gap-2 justify-center">
            <Label htmlFor="email">Email</Label>
          <Input
          id="email"
            type="email"
            placeholder="@mail.com"
            className="w-full p-2 rounded bg-inherit border border-pink-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          </div>

          <div className="flex flex-col gap-2 justify-center">
            <Label htmlFor="phone">Phone </Label>
          <Input
          id="phone"
            type="tel"
            placeholder="your business name"
            className="w-full p-2 rounded bg-inherit border border-pink-300"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input type="p" />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <Label htmlFor="loc">Location <span className="text-red">*</span></Label>
          <Input
          id="loc"
            type="text"
            placeholder=""
            className="w-full p-2 rounded bg-inherit border border-pink-300"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input type="p" />
          </div>


          <div className="flex items-center flex-end gap-6">
          <Button
           type="submit"
            //disabled={loading || !title || !content}
            className="bg-inherit cursor-pointer text-[#C70CCE] border border-pink-300 font-semibold py-2 rounded-lg hover:opacity-90"
          >
            Setup
          </Button>
          <Button
            onClick={onClose}
            className="bg-inherit cursor-pointer text-[#C70CCE] border border-pink-300 font-semibold py-2 rounded-lg hover:opacity-90"
          >
            Cancel
          </Button>
          </div>
          
          </div>
          </form>

      </DialogContent>
    </Dialog>
  );
}