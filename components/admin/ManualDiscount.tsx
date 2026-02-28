import React, { useState } from "react";
import { Info } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

// SVG Imports (Ensure these paths are correct as per original file)
import warning from "@/public/image/admin/Discount/warningIcon.svg";
import tag from "@/public/image/admin/Discount/tagIcon.svg";
import calander from "@/public/image/admin/Discount/calanderIcon.svg";
import discount from "@/public/image/admin/Discount/discountIcon.svg";
import dropdownArrow from "@/public/image/admin/Discount/droupdown.svg";
import rightRounded from "@/public/image/admin/Discount/rightRounded.svg";
import DiscountTitle from "@/components/admin/DiscountTitle";

import { useGetAllCategoriesQuery } from "@/app/store/slices/services/adminService/products/productMetadata";
import { useGetAllProductsQuery } from "@/app/store/slices/services/adminService/products/productsApi";
import { useCreateDiscountCodesMutation, DiscountType } from "@/app/store/slices/services/adminService/adminPromos/adminPromoApi";

// --- Constants ---
const INITIAL_STATE = {
  series_name: "",
  code_prefix: "",
  number_of_codes: 100,
  code_length: 8,
  discount_type: "percentage" as DiscountType,
  amount: 10,
  min_purchase_amount: 0,
  max_discount_amount: 0,
  is_one_time: true,
  expiry_date: "",
  applicable_type: "All Products", // "All Products", "Specific Collections", "Specific Products"
  product_applicability: [] as number[],
  category_applicability: [] as number[],
  notes: "",
};

// -----------------------------------------------------------------
// 7. ManualDiscountForm (Main Component to Export)
// -----------------------------------------------------------------
const ManualDiscountForm: React.FC = () => {
  const { data: categories } = useGetAllCategoriesQuery();
  const { data: productsRes } = useGetAllProductsQuery();
  const [createDiscountCodes, { isLoading: isCreating }] = useCreateDiscountCodesMutation();

  // --- Form State ---
  const [formData, setFormData] = useState(INITIAL_STATE);

  // --- Search State for Multi-Select ---
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const toggleOneTimeUse = () => {
    setFormData((prev) => ({ ...prev, is_one_time: !prev.is_one_time }));
  };

  const handleApplicableTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      applicable_type: value,
      product_applicability: [],
      category_applicability: [],
    }));
    setSearchTerm("");
  };

  const toggleProductSelection = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      product_applicability: prev.product_applicability.includes(id)
        ? prev.product_applicability.filter((item) => item !== id)
        : [...prev.product_applicability, id],
    }));
  };

  const toggleCategorySelection = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      category_applicability: prev.category_applicability.includes(id)
        ? prev.category_applicability.filter((item) => item !== id)
        : [...prev.category_applicability, id],
    }));
  };

  const handleGenerate = async () => {
    if (!formData.series_name) {
      toast.error("Series name is required");
      return;
    }
    if (!formData.expiry_date) {
      toast.error("Expiry date is required");
      return;
    }

    try {
      const payload = {
        number_of_codes: formData.number_of_codes,
        code_length: formData.code_length,
        series_name: formData.series_name,
        code_prefix: formData.code_prefix || undefined,
        discount_type: formData.discount_type,
        amount: formData.amount,
        min_purchase_amount: formData.min_purchase_amount || 0,
        max_discount_amount: formData.max_discount_amount || undefined,
        product_applicability: formData.product_applicability,
        category_applicability: formData.category_applicability,
        is_one_time: formData.is_one_time,
        expiry_date: formData.expiry_date,
        is_active: true,
        notes: formData.notes || undefined,
      };

      await createDiscountCodes(payload).unwrap();

      // Reset Form on Success
      setFormData(INITIAL_STATE);
      setSearchTerm("");

      toast.success(`Generated ${formData.number_of_codes} codes Successfully!`, {
        position: "bottom-center",
        duration: 3000,
      });
    } catch (error: unknown) {
      console.error(error);
      const errMsg = (error as { data?: { message?: string } })?.data?.message || "Failed to generate codes";
      toast.error(errMsg);
    }
  };

  // Filter lists based on search
  const pRes: any = productsRes;
  const cRes: any = categories;

  const productsList = Array.isArray(pRes?.data)
    ? pRes.data
    : (pRes?.data?.categories || pRes?.data?.products || pRes?.categories || pRes?.products || pRes?.results?.categories || pRes?.results?.products || []);

  const categoriesList = Array.isArray(cRes?.data)
    ? cRes.data
    : (Array.isArray(cRes) ? cRes : cRes?.categories || cRes?.results?.categories || []);

  const filteredProducts = productsList.filter((p: any) =>
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredCategories = categoriesList.filter((c: any) =>
    c?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <>
      <DiscountTitle
        text="Create Discount Codes (Manual)"
        paragraph="Generate a new series of unique discount codes"
      />
      <div className="p-8 bg-white border border-gray-200 rounded-xl space-y-8">

        {/* Series Information */}
        <div className="mb-8 ">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Image src={tag} alt="icon" height={20} width={20} className="mr-2" />
            Series Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Series Name</label>
              <input
                type="text"
                name="series_name"
                value={formData.series_name}
                onChange={handleChange}
                placeholder="e.g., SUMMER2025"
                className="mt-1 block w-full rounded-md focus:outline-none border border-gray-300 bg-[#f3f3f5] p-2.5 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Internal name for tracking</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Code Prefix (Optional)</label>
              <input
                type="text"
                name="code_prefix"
                value={formData.code_prefix}
                onChange={handleChange}
                placeholder="e.g., SUMMER-"
                className="mt-1 block w-full rounded-md focus:outline-none border border-gray-300 bg-[#f3f3f5] p-2.5 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Prefix for all codes in this series</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Codes</label>
              <input
                type="number"
                name="number_of_codes"
                value={formData.number_of_codes}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md focus:outline-none border border-gray-300 bg-[#f3f3f5] p-2.5 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">How many unique codes to generate</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Code Length</label>
              <div className="relative mt-1">
                <select
                  name="code_length"
                  value={formData.code_length}
                  onChange={handleChange}
                  className="block w-full rounded-md focus:outline-none border border-gray-300 bg-[#f3f3f5] p-2.5 pr-10 text-sm appearance-none"
                >
                  <option value={8}>8 characters</option>
                  <option value={10}>10 characters</option>
                  <option value={12}>12 characters</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Image src={dropdownArrow} alt="dropdown arrow" height={16} width={16} className="text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Length of random code</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Discount Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Image src={discount} alt="icon" height={20} width={20} className="mr-2" />
            Discount Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Type</label>
              <div className="relative mt-1">
                <select
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 focus:outline-none p-2.5 pr-10 text-sm appearance-none bg-[#f3f3f5]"
                >
                  <option value="percentage">Percentage Off</option>
                  <option value="fixed">Fixed Amount Off</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Image src={dropdownArrow} alt="dropdown arrow" height={16} width={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            {formData.discount_type !== "free_shipping" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {formData.discount_type === "percentage" ? "Percentage (%)" : "Amount (€)"}
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border focus:outline-none border-gray-300 bg-[#f3f3f5] p-2.5 text-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Purchase (€)</label>
              <input
                type="number"
                name="min_purchase_amount"
                value={formData.min_purchase_amount}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border focus:outline-none border-gray-300 bg-[#f3f3f5] p-2.5 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Optional minimum order value</p>
            </div>
            {formData.discount_type === "percentage" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Maximum Discount (€)</label>
                <input
                  type="number"
                  name="max_discount_amount"
                  value={formData.max_discount_amount}
                  onChange={handleChange}
                  placeholder="No limit"
                  className="mt-1 block w-full rounded-md border focus:outline-none border-gray-300 bg-[#f3f3f5] p-2.5 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Cap the discount amount</p>
              </div>
            )}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Usage & Expiry */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Image src={calander} alt="icon" height={20} width={20} className="mr-2" />
            Usage & Expiry
          </h3>

          <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200 mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center text-sm font-medium text-gray-900">
                <Image src={warning} alt="icon" height={20} width={20} className="mr-2" />
                One-Time Use (Globally Unique)
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Each code can only be redeemed once by any account. After redemption, the code becomes permanently invalid for all users.
              </p>
            </div>
            <button
              onClick={toggleOneTimeUse}
              className={`relative inline-flex shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ${formData.is_one_time ? "bg-indigo-600" : "bg-gray-200"}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white transform ring-0 transition ease-in-out duration-200 ${formData.is_one_time ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md focus:outline-none border bg-[#f3f3f5] border-gray-300 p-2.5 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Codes expire at 23:59 on this date</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Applicable Products</label>
              <div className="relative mt-1">
                <select
                  value={formData.applicable_type}
                  onChange={(e) => handleApplicableTypeChange(e.target.value)}
                  className="block w-full rounded-md focus:outline-none border border-gray-300 bg-[#f3f3f5] p-2.5 pr-10 text-sm appearance-none"
                >
                  <option>All Products</option>
                  <option>Specific Collections</option>
                  <option>Specific Products</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Image src={dropdownArrow} alt="dropdown arrow" height={16} width={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Selection for Specific Products or Collections */}
          {formData.applicable_type !== "All Products" && (
            <div className="mt-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select {formData.applicable_type === "Specific Collections" ? "Collections" : "Products"}
              </label>
              <input
                type="text"
                placeholder={`Search ${formData.applicable_type === "Specific Collections" ? "collections" : "products"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 block w-full rounded-md focus:outline-none border border-gray-300 bg-white p-2.5 text-sm"
              />
              <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-2 bg-white">
                {formData.applicable_type === "Specific Products" ? (
                  filteredProducts.map((p: any) => (
                    <div key={p.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`prod-${p.id}`}
                        checked={formData.product_applicability.includes(p.id)}
                        onChange={() => toggleProductSelection(p.id)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor={`prod-${p.id}`} className="ml-2 text-sm text-gray-700">{p.name}</label>
                    </div>
                  ))
                ) : (
                  filteredCategories.map((c: any) => (
                    <div key={c.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cat-${c.id}`}
                        checked={formData.category_applicability.includes(c.id)}
                        onChange={() => toggleCategorySelection(c.id)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor={`cat-${c.id}`} className="ml-2 text-sm text-gray-700">{c.title}</label>
                    </div>
                  ))
                )}
                {((formData.applicable_type === "Specific Products" && filteredProducts.length === 0) ||
                  (formData.applicable_type === "Specific Collections" && filteredCategories.length === 0)) && (
                    <p className="text-sm text-gray-500 text-center py-2">No results found</p>
                  )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Selected: {formData.applicable_type === "Specific Products" ? formData.product_applicability.length : formData.category_applicability.length} items
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Internal Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Add any notes about this code series (internal use only)"
              className="mt-1 block resize-none w-full focus:outline-none rounded-md border border-gray-300 bg-[#f3f3f5] p-2.5 text-sm"
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Preview Section */}
        <div className="pt-2 w-full bg-[#f9fafb] rounded-lg p-4">
          <p className="text-sm font-medium text-[#4a5565] mb-2">Preview Example:</p>
          <div className="text-lg font-mono font-bold text-gray-900 bg-gray-50 py-3 rounded w-full ">
            {formData.code_prefix ? `${formData.code_prefix}` : ""}XXXXXXXX
          </div>
          <p className="text-xs text-[#4a5565] mt-2">Will generate {formData.number_of_codes} unique codes</p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            onClick={handleGenerate}
            disabled={isCreating}
            className={`w-full flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold transition-all bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 ${isCreating ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <Image src={rightRounded} alt="icon" height={20} width={20} className="mr-2" />
            {isCreating ? "Generating..." : `Generate ${formData.number_of_codes} Codes`}
          </button>

          <div className="p-6 rounded-xl border border-blue-200 mt-4 bg-blue-50">
            <div className="flex items-start mb-4">
              <Info className="w-5 h-5 text-[#193CB8] mr-3 mt-0.5 shrink-0" />
              <p className="text-base font-semibold text-blue-800">Important:</p>
            </div>
            <ul className="list-none space-y-2 pl-8">
              <li className="text-sm text-[#193CB8]">Generated codes are globally unique across your entire system</li>
              <li className="text-sm text-[#193CB8]">One-time codes become invalid immediately after redemption</li>
              <li className="text-sm text-[#193CB8]">You can download the code list as CSV after generation</li>
              <li className="text-sm text-[#193CB8]">Codes can be sent to customers via the Email Sending panel</li>
            </ul>
          </div>
          <Toaster position="bottom-center" />
        </div>
      </div>
    </>
  );
};

export default ManualDiscountForm;
