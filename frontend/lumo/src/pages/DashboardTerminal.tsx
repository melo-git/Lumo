import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SidePanel from '../components/SidePanel'
import { useMerchantSetup } from "@/components/context/MerchantSetupContext";
import { usePOSSetup, type POSData, type POSResponse } from "@/components/context/MerchantPOSContext";

export default function MerchantDashboard() {
  const {merchant} = useMerchantSetup()
  const {POS, createPOS,} = usePOSSetup()
  //const {POSQuery, createPOSQuery} = usePayment()

  const [terminals, setTerminals] = useState<[POSResponse|null]>([POS]);
  

  const [form, setForm] = useState({
    device_serial_id: "",
    model_type: "",
  });

  


  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (merchant?.id){
      const id = merchant.id
      const data: POSData = {merchant:id, ...form}
    createPOS(data);
    }
    
  };

  useEffect(()=>{
    setTerminals([POS])
    
  },[createPOS])

  return (
    <div className="min-h-screen flex bg-[#fff7fb] text-slate-900">
      {/* Sidebar */}
      <SidePanel parentName={"POS terminals"} childName={null} merchant={merchant}/>
      {/* Main content */}
      <main className="flex-1 p-12">
        <header>
          <h1 className="text-2xl font-semibold mb-8">Register terminals to accept payments</h1>
        </header>

        {/* Form */}
        <form className="grid grid-cols-2 gap-6 max-w-2xl mb-6">
          <div>
            <label className="block text-sm mb-1">Device serial ID *</label>
            <input
              type="text"
              name="device_serial_id"
              value={form.device_serial_id}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 border-pink-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Model type</label>
            <input
              type="text"
              name="model_type"
              value={form.model_type}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 border-pink-400 focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <Button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 border border-pink-400 text-pink-600 rounded-lg bg-inherit cursor-pointer"
            >
              Save
            </Button>
          </div>
        </form>

        {/* Table */}
        <section className="mt-12">
          <h2 className="text-lg font-medium mb-4">Available terminals</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-pink-300 text-sm bg-white">
              <thead>
                <tr className="bg-pink-100">
                  <th className="border border-pink-300 px-4 py-2 text-left">Terminal</th>
                  <th className="border border-pink-300 px-4 py-2 text-left">Model</th>
                  <th className="border border-pink-300 px-4 py-2 text-left">Reg. date</th>
                  <th className="border border-pink-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-pink-300 px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                
                {terminals.map((t, idx) => (
                  <tr key={idx}>
                    <td className="border border-pink-300 px-4 py-2">{t?.device_serial_id}</td>
                    <td className="border border-pink-300 px-4 py-2">{t?.model_type}</td>
                    <td className="border border-pink-300 px-4 py-2">{t?.registration_date.toString()}</td>
                    <td className="border border-pink-300 px-4 py-2">{t?.status}</td>
                    <td className="border border-pink-300 px-4 py-2">
                      {t?.status === "Active" ? (
                        <span className="text-green-600 flex items-center gap-1">
                          {t.status} <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        </span>
                      ) : t?.status ==="Inactive" ?(
                        <span className="text-red-600 flex items-center gap-1">
                          {t?.status} <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                        </span>
                      ): null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer button */}
        <div className="mt-8">
          <button className="px-6 py-2 border border-pink-400 text-pink-600 rounded-lg bg-inherit cursor-pointer">
            Get a terminal
          </button>
        </div>
      </main>
    </div>
  );
}
