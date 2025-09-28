import React, { useState } from "react";
import {
  Home,
  Box,
  Cpu,
  Repeat,
  Wallet,
  PackageCheck,
  FileText,
  Users,
  User,
  LogOut,
  ChevronRight,
  CreditCard,
  ShoppingCart,
  Archive,
  BarChart2,
  ImagePlus,
} from "lucide-react";
import SidePanel from '../components/SidePanel'
import { useMerchantSetup } from "@/components/context/MerchantSetupContext";

export default function MerchantDashboard() {
  const {merchant} = useMerchantSetup()
  const [product, setProduct] = useState({
    name: "",
    price: "",
    currency: "NGN",
    quantity: "",
    description: "",
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProduct((prev) => ({ ...prev, image: file }));
  };

  const handleSave = () => {
    console.log("Save product", product);
  };

  return (
    <div className="min-h-screen flex bg-[#fff7fb] text-slate-900">
      {/* Left Sidebar */}
      <SidePanel parentName="Products" childName={"Add product"} merchant={merchant} />

      {/* Main content */}
      <main className="flex-1 p-12">
        <header>
          <h1 className="text-2xl font-semibold mb-8">Add products to start selling and track inventory</h1>
        </header>

        <form className="space-y-8 max-w-4xl">
          {/* Upload image */}
          <div className="flex flex-col items-center">
            <label className="w-full max-w-md h-40 border-2 border-dashed border-pink-400 rounded-xl flex items-center justify-center cursor-pointer">
              {product.image ? (
                <img
                  src={URL.createObjectURL(product.image)}
                  alt="preview"
                  className="h-full object-contain rounded-xl"
                />
              ) : (
                <span className="text-slate-400">Upload image</span>
              )}
              <input type="file" className="hidden" onChange={handleImageUpload} />
            </label>
            <button
              type="button"
              className="mt-3 px-4 py-2 bg-pink-200 text-pink-700 rounded-lg text-sm"
            >
              Upload image
            </button>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1">Product name *</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 border-pink-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Price *</label>
              <input
                type="text"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 border-pink-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Base currency *</label>
              <select
                name="currency"
                value={product.currency}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 border-pink-400 focus:outline-none"
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Current quantity *</label>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 border-pink-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Product description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 border-pink-400 focus:outline-none h-32"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-6">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 border border-pink-400 text-pink-600 rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 border border-pink-400 text-pink-600 rounded-lg"
            >
              Save and add another
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
