import { Button } from "./ui/button";
import { useState } from "react";
import MerchantSetupModal from './MerchantSetupModal'

const SetupMerchantButton = () => {
    const [createOpen, setCreateOpen] = useState(false);
    return (
        <>
        <Button
        size={'sm'}
        onClick={()=>setCreateOpen(true)}
        className="w-full mt-4 bg-white border-[#C70CCE] border-b-[7px] border-t-[2px]
        border-l-[2px] border-r-[2px] text-[#C70CCE] hover:bg-purple-50"
        >
        Setup your store now

        </Button>
        <MerchantSetupModal open={createOpen} onClose={() => setCreateOpen(false)} />
        </>
    )
};

export default SetupMerchantButton


