// "use client";
// import React from "react";
// import { ArrowLeftIcon, Edit, Trash2, Box, ShoppingCart } from "lucide-react";
// import Image from "next/image";

// // Assuming these paths are correct
// import calanderIcon from "@/public/image/admin/products/calanderIcon.svg";
// import productImage from "@/public/image/admin/products/productImage.jpg";
// import crossIcon from "@/public/image/admin/products/crossIcon.svg";
// import DesignSelectorField from "./DesignSelectorField";
// // ---------------- Types ----------------

// type ViewType = "list" | "add" | "view" | "edit";
// type ViewChangeHandler = (view: ViewType, id?: number) => void;

// interface Product {
//   id: number;
//   name: string;
//   category: string;
//   ageGroup: string;
//   price: string;
//   stock: number;
//   sales: number;
//   status: "Active" | "Out of Stock";
// }

// // ---------------- Dummy Data ----------------

// const initialProductData: Product[] = [
//   {
//     id: 1,
//     name: "Premium Custom T-Shirt",
//     category: "T-Shirts",
//     ageGroup: "Adults (18-35)",
//     price: "€34.99",
//     stock: 156,
//     sales: 234,
//     status: "Active",
//   },
//   {
//     id: 2,
//     name: "Premium Custom T-Shirt",
//     category: "T-Shirts",
//     ageGroup: "Adults (18-35)",
//     price: "€34.99",
//     stock: 156,
//     sales: 234,
//     status: "Active",
//   },
//   {
//     id: 3,
//     name: "Premium Custom T-Shirt",
//     category: "T-Shirts",
//     ageGroup: "Adults (18-35)",
//     price: "€34.99",
//     stock: 156,
//     sales: 234,
//     status: "Active",
//   },
//   {
//     id: 4,
//     name: "Premium Custom T-Shirt",
//     category: "T-Shirts",
//     ageGroup: "Adults (18-35)",
//     price: "€34.99",
//     stock: 156,
//     sales: 234,
//     status: "Active",
//   },
//   {
//     id: 5,
//     name: "Premium Custom T-Shirt",
//     category: "T-Shirts",
//     ageGroup: "Adults (18-35)",
//     price: "€34.99",
//     stock: 156,
//     sales: 234,
//     status: "Active",
//   },
//   {
//     id: 6,
//     name: "Premium Custom T-Shirt",
//     category: "T-Shirts",
//     ageGroup: "Adults (18-35)",
//     price: "€34.99",
//     stock: 156,
//     sales: 234,
//     status: "Active",
//   },
// ];

// const DetailedProductData = {
//   id: 1,
//   productID: "#0001",
//   name: "Premium Custom T-Shirt",
//   category: "T-Shirts",
//   ageGroup: "Adults (18-35)",
//   price: "€34.99",
//   stock: 156,
//   sales: 234,
//   status: "Active",
//   description:
//     "High-quality cotton t-shirt perfect for custom AI designs and letter printing.",
//   addedOn: "Oct 1, 2025",
//   availableColors: ["Black", "White", "Navy", "Grey"],
//   availableSizes: ["S", "M", "L", "XL", "XXL"],
//   totalRevenue: "€8187.66",
//   avgOrderValue: "€34.99",
//   returnRate: "2.1%",
//   revenueChange: "+12.5% vs last month",
//   aovChange: "+3.2% vs last month",
//   returnRateChange: "-0.8% vs last month",
// };

// // ---------------- Reusable Components ----------------

// const Title = ({ text, paragraph }: { text: string; paragraph?: string }) => (
//   <div className="flex flex-col text-center lg:text-left space-y-1">
//     <h2 className="text-xl font-semibold text-gray-800">{text}</h2>
//     {paragraph && <p className="text-sm text-gray-500">{paragraph}</p>}
//   </div>
// );

// const Card = ({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => (
//   <div
//     className={`bg-white p-6 md:p-8 rounded-2xl border border-[#e8e3dc] ${className}`}
//   >
//     {children}
//   </div>
// );

// const StatusBadge = ({ status }: { status: "Active" | "Out of Stock" }) => (
//   <span
//     className={`px-4 py-2 flex justify-end rounded-xl text-xs gap-1 bg-[#8B6F47]/10 border border-transparent font-semibold ${
//       status === "Active"
//         ? "bg-[#dcfce7] text-[#008236]"
//         : "bg-[#fde2e8] text-[#9b002c]"
//     }`}
//   >
//     <Image src={crossIcon} alt="icon" height={15} width={15} /> {status}
//   </span>
// );

// // --- FIXED QuickStat Component ---
// const QuickStat = ({
//   icon,
//   label,
//   value,
//   color,
//   iconType = "icon",
// }: {
//   icon: React.ReactElement<{ className?: string }> | string;
//   label: string;
//   value: string;
//   color: string;
//   iconType?: "icon" | "text";
// }) => (
//   <div className="flex items-center space-x-3">
//     <div className="p-3 rounded-xl bg-opacity-20">
//       {iconType === "text" ? (
//         <span className={`${color} text-lg font-bold`}>{icon}</span>
//       ) : React.isValidElement(icon) ? (
//         React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
//           className: `w-5 h-5 ${color}`,
//         })
//       ) : (
//         <div className={`w-5 h-5 ${color}`} />
//       )}
//     </div>

//     <div className="flex flex-col">
//       <span className="text-sm text-gray-500">{label}</span>
//       <span className="text-xl font-bold text-gray-800">{value}</span>
//     </div>
//   </div>
// );

// const SalesStat = ({
//   label,
//   value,
//   change,
// }: {
//   label: string;
//   value: string;
//   change: string;
// }) => (
//   <div className="flex flex-col p-4">
//     <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
//     <p className="text-xl font-semibold text-gray-800">{value}</p>
//     <span
//       className={`text-xs mt-1 ${
//         change.startsWith("+")
//           ? "text-green-600"
//           : change.startsWith("-")
//           ? "text-red-600"
//           : "text-gray-500"
//       }`}
//     >
//       {change}
//     </span>
//   </div>
// );

// const getColorSwatchClass = (color: string) => {
//   switch (color.toLowerCase()) {
//     case "black":
//       return "bg-black";
//     case "white":
//       return "bg-white border border-gray-300";
//     case "navy":
//       return "bg-blue-900";
//     case "grey":
//       return "bg-gray-500";
//     default:
//       return "bg-transparent border border-dashed border-gray-400";
//   }
// };

// // ---------------- Main Component ----------------

// const ProductDetailScreen = ({
//   onViewChange,
//   productId,
// }: {
//   onViewChange: ViewChangeHandler;
//   productId: number;
// }) => {
//   const product = initialProductData.find((p) => p.id === productId);
//   const detail = DetailedProductData;

//   if (!product) {
//     return (
//       <div className="p-4 px-4 sm:p-8 w-full bg-gray-50 font-sans">
//         <div className="flex items-center space-x-4 mb-8 pb-4 border-b border-[#e8e3dc]">
//           <button
//             onClick={() => onViewChange("list")}
//             className="p-3 bg-white rounded-xl border border-[#E8E3DC] hover:bg-gray-100 transition text-gray-600"
//           >
//             <ArrowLeftIcon className="w-6 h-6" />
//           </button>

//           <Title
//             text="Product Not Found"
//             paragraph={`Could not load product ID: ${productId}`}
//           />
//         </div>

//         <Card>
//           <p className="text-red-500">
//             Error: The requested product could not be loaded.
//           </p>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="p-4 px-4 sm:p-8 w-full bg-gray-50 font-sans">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-[#e8e3dc] space-y-4 sm:space-y-0">
//           {/* Left Section: Back Button and Title */}
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => onViewChange("list")}
//               className="p-3 bg-white rounded-xl border border-[#E8E3DC] hover:bg-gray-100 transition text-gray-600"
//             >
//               <ArrowLeftIcon className="w-6 h-6" />
//             </button>

//             <Title
//               text="Product Details"
//               paragraph="Complete information about this product"
//             />
//           </div>

//           {/* Right Section: Action Buttons */}
//           <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-3">
//             {/* Edit Product Button */}
//             <button className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-white text-gray-700 font-semibold rounded-xl border border-[#E8E3DC] hover:bg-gray-50 transition ">
//               <Edit className="w-4 h-4 mr-2" /> Edit Product
//             </button>

//             {/* Delete Button */}
//             <button
//               onClick={() => alert(`Deleting product ${product.id}`)}
//               className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-white text-red-500 font-semibold rounded-xl border border-red-200 hover:bg-red-50 transition"
//             >
//               <Trash2 className="w-4 h-4 mr-2" /> Delete
//             </button>
//           </div>
//         </div>

//         {/* Layout Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left column */}
//           <div className="lg:col-span-1 space-y-8">
//             <Card className="p-4 space-y-5">
//               <div className="relative w-full aspect-square rounded-xl overflow-hidden ">
//                 <Image
//                   src={productImage}
//                   alt={product.name}
//                   fill
//                   className="object-cover"
//                 />
//               </div>

//               {/* Status & Info */}
//               <div className="space-y-3">
//                 <div className="flex w-full justify-between items-center border-b pb-2 border-[#e8e3dc] ">
//                   <div>
//                     <span className="text-sm text-gray-500 font-medium">
//                       Status
//                     </span>
//                   </div>
//                   <div className="flex justify-center items-center gap-1.5 ">
//                     <StatusBadge status={product.status} />
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center border-b pb-2 border-[#e8e3dc] ">
//                   <span className="text-sm text-gray-500 font-medium">
//                     Category
//                   </span>
//                   <span className="text-sm font-semibold text-gray-700 py-1 px-3 rounded-xl bg-[#8B6F47]/10 border border-transparent ">
//                     {product.category}
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500 font-medium">
//                     Age Group
//                   </span>
//                   <span className="text-sm font-semibold border border-[#e8e3dc] text-gray-700 py-1 px-3 rounded-xl bg-gray-100">
//                     {product.ageGroup}
//                   </span>
//                 </div>
//               </div>
//             </Card>

//             {/* Quick Stats */}
//             <Card>
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Quick Stats
//               </h3>

//               <div className="space-y-5">
//                 <QuickStat
//                   icon="€"
//                   label="Price"
//                   value={product.price}
//                   color="text-[#8B6F47]"
//                   iconType="text"
//                 />

//                 <div className="h-px bg-gray-100 w-11/12 mx-auto" />

//                 <QuickStat
//                   icon={<Box />}
//                   label="Stock"
//                   value={`${product.stock} units`}
//                   color="text-[#f6921e]"
//                 />

//                 <div className="h-px bg-gray-100 w-11/12 mx-auto" />

//                 <QuickStat
//                   icon={<ShoppingCart />}
//                   label="Total Sales"
//                   value={`${product.sales} sold`}
//                   color="text-[#00a86b]"
//                 />
//               </div>
//             </Card>
//           </div>

//           {/* Right Column */}
//           <div className="lg:col-span-2 space-y-8">
//             <Card>
//               {/* Header */}
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h1 className="text-[20px] font-normal text-[#1a1410]">
//                     {detail.name}
//                   </h1>
//                   <span className="font-medium text-[#6b6560]">
//                     Product ID: {detail.productID}
//                   </span>
//                 </div>

//                 <div className="flex flex-col text-right items-end text-sm text-gray-500">
//                   <span>
//                     Added on <br />
//                     <div className="flex justify-center items-center gap-1.5">
//                       <Image
//                         src={calanderIcon}
//                         alt="date"
//                         height={18}
//                         width={18}
//                       />
//                       <span className="font-medium text-gray-700">
//                         {detail.addedOn}
//                       </span>
//                     </div>
//                   </span>
//                 </div>
//               </div>

//               {/* Description */}
//               <h2 className="text-[20px] text-[#1a1410] mb-2">Description</h2>
//               <p className="text-[#6B6560] font-sans mb-6">
//                 {detail.description}
//               </p>

//               <div className="h-px bg-gray-200 mb-6" />

//               {/* Colors */}
//               <h2 className="text-[20px] text-[#1a1410] mb-3">
//                 Available Colors
//               </h2>

//               <div className="flex flex-wrap gap-3 mb-6">
//                 {detail.availableColors.map((color) => (
//                   <div
//                     key={color}
//                     className={`px-4 py-2 text-sm font-medium border rounded-xl cursor-pointer transition ${
//                       color === "Black" || color === "White"
//                         ? "bg-[#faf9f7] text-[#1A1410] border-gray-300 "
//                         : "bg-[#FAF7F3] text-gray-700 border-[#E8E3DC] hover:bg-gray-100"
//                     }`}
//                   >
//                     <div className="flex items-center gap-1.5">
//                       <div
//                         className={`h-5 w-5 rounded-full ${getColorSwatchClass(
//                           color
//                         )}`}
//                       />
//                       {color}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="h-px bg-gray-200 mb-6" />

//               {/* Sizes */}
//               <h2 className="text-lg font-semibold text-gray-800 mb-3">
//                 Available Sizes
//               </h2>

//               <div className="flex flex-wrap border-b mb-6 border-[#e8e3dc] pb-6 gap-3">
//                 {detail.availableSizes.map((size) => (
//                   <div
//                     key={size}
//                     className={`w-12 h-12 flex items-center justify-center text-base font-medium rounded-xl  cursor-pointer transition ${
//                       size !== "XXL"
//                         ? "bg-[#8B6F47] text-white"
//                         : "bg-[#FAF7F3] text-gray-700 border border-[#E8E3DC] hover:bg-gray-100"
//                     }`}
//                   >
//                     {size}
//                   </div>
//                 ))}
//               </div>

//               <DesignSelectorField />
//             </Card>

//             {/* Sales Performance */}
//             <Card>
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Sales Performance
//               </h2>

//               <div className="grid grid-cols-3 divide-x divide-gray-200">
//                 <SalesStat
//                   label="Total Revenue"
//                   value={detail.totalRevenue}
//                   change={detail.revenueChange}
//                 />
//                 <SalesStat
//                   label="Avg. Order Value"
//                   value={detail.avgOrderValue}
//                   change={detail.aovChange}
//                 />
//                 <SalesStat
//                   label="Return Rate"
//                   value={detail.returnRate}
//                   change={detail.returnRateChange}
//                 />
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProductDetailScreen;

"use client";

import React, { useState } from "react";
import { ArrowLeftIcon, Edit, Trash2, Box, ShoppingCart } from "lucide-react";
import Image from "next/image";
import productImage from "@/public/image/admin/products/productImage.jpg";
import calanderIcon from "@/public/image/admin/products/calanderIcon.svg";
import crossIcon from "@/public/image/admin/products/crossIcon.svg";
import { useGetSingleProductQuery } from "@/app/store/slices/services/adminService/products/productsApi";
import { ViewChangeHandler } from "./Products";

/* ================= Interfaces ================= */

interface ProductImage {
  id: number;
  image: string;
}

interface Product {
  id: number;
  name: string;
  sku?: string;
  description?: string;
  is_active: boolean;
  category?: { title: string };
  age_range?: { start: number; end: number };
  color_code?: string;
  cloth_size?: string[];
  kids_size?: string[];
  mug_size?: string[];
  stock_quantity?: number | null;
  total_sold?: number | null;
  price?: string | number | null;
  discounted_price?: string | number | null;
  created_at?: string;
  images?: ProductImage[];
}

/* ================= Reusable Components ================= */

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white p-6 md:p-8 rounded-2xl border border-[#e8e3dc] ${className}`}>{children}</div>
);

const StatusBadge = ({ active }: { active: boolean }) => (
  <span
    className={`px-4 py-2 flex items-center gap-1 rounded-xl text-xs font-semibold ${
      active ? "bg-[#dcfce7] text-[#008236]" : "bg-[#fde2e8] text-[#9b002c]"
    }`}
  >
    <Image src={crossIcon} alt="status" width={15} height={15} />
    {active ? "Active" : "Inactive"}
  </span>
);

const QuickStat = ({
  icon,
  label,
  value,
  color,
  iconType = "icon",
}: {
  icon: React.ReactElement | string;
  label: string;
  value: string;
  color: string;
  iconType?: "icon" | "text";
}) => (
  <div className="flex items-center space-x-3">
    <div className="p-3 rounded-xl bg-opacity-20">
      {iconType === "text" ? (
        <span className={`${color} text-lg font-bold`}>{icon}</span>
      ) : React.isValidElement(icon) ? (
        React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-5 h-5 ${color}` })
      ) : (
        <div className={`w-5 h-5 ${color}`} />
      )}
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-xl font-bold text-gray-800">{value}</span>
    </div>
  </div>
);

const SalesStat = ({ label, value, change }: { label: string; value: string; change: string }) => (
  <div className="flex flex-col p-4">
    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
    <p className="text-xl font-semibold text-gray-800">{value}</p>
    <span
      className={`text-xs mt-1 ${
        change.startsWith("+") ? "text-green-600" : change.startsWith("-") ? "text-red-600" : "text-gray-500"
      }`}
    >
      {change}
    </span>
  </div>
);

const getColorSwatchClass = (color: string) => {
  switch (color.toLowerCase()) {
    case "black":
      return "bg-black";
    case "white":
      return "bg-white border border-gray-300";
    case "navy":
      return "bg-blue-900";
    case "grey":
      return "bg-gray-500";
    case "blue":
      return "bg-blue-500";
    case "red":
      return "bg-red-500";
    default:
      return "bg-transparent border border-dashed border-gray-400";
  }
};

/* ================= Main Component ================= */

const ProductDetailScreen = ({
  productId,
  onViewChange,
}: {
  productId: number;
  onViewChange: ViewChangeHandler;
}) => {
  const { data, isLoading } = useGetSingleProductQuery(productId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) return <div className="p-8">Loading product details…</div>;

  const rawApiProduct = data?.data;

  if (!rawApiProduct) return <div className="p-8 text-red-500">Product data not available.</div>;

  /* ================= SAFE NORMALIZATION ================= */
  const p: Product = {
  ...rawApiProduct,
  cloth_size: Array.isArray(rawApiProduct.cloth_size) ? rawApiProduct.cloth_size : [],
  kids_size: Array.isArray(rawApiProduct.kids_size) ? rawApiProduct.kids_size : [],
  mug_size: Array.isArray(rawApiProduct.mug_size) ? rawApiProduct.mug_size : [],
  images, // <- use TS-safe images here
  stock_quantity: rawApiProduct.stock_quantity ?? null,
  total_sold: rawApiProduct.total_sold ?? 0,
  price: rawApiProduct.price ?? null,
  discounted_price: rawApiProduct.discounted_price ?? null,
  color_code: rawApiProduct.color_code?.trim() || "",
  description: rawApiProduct.description?.trim() || "",
};

  /* ============================================================ */

  const images = p.images || [];
  const allSizes = [...(p.cloth_size || []), ...(p.kids_size || []), ...(p.mug_size || [])];
  const selectedImage = images[selectedImageIndex] || { id: 0, image: productImage };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-[#e8e3dc] space-y-4 sm:space-y-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onViewChange("list")}
            className="p-3 bg-white rounded-xl border hover:bg-gray-100 transition"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-semibold">Product Details</h2>
            <p className="text-sm text-gray-500">Complete information about this product</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button className="flex items-center justify-center px-4 py-2 bg-white border rounded-xl hover:bg-gray-50 transition gap-2">
            <Edit className="w-4 h-4" /> Edit Product
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-white text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition gap-2">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Product Images */}
          <Card className="space-y-4">
            {images.length > 0 ? (
              <>
                <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={selectedImage.image || productImage}
                    alt={p.name || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {images.map((img, index) => (
                      <div
                        key={img.id}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 ${
                          index === selectedImageIndex ? "border-[#8B6F47]" : "border-transparent"
                        } cursor-pointer`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image src={img.image || productImage} alt={`Variant ${index + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">No images available</div>
            )}

            {/* Basic Info */}
            <div className="space-y-3 mt-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <StatusBadge active={p.is_active} />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Category</span>
                <span className="text-sm font-semibold">{p.category?.title || "Not available"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Age Group</span>
                <span className="text-sm font-semibold">
                  {p.age_range ? `${p.age_range.start}-${p.age_range.end}` : "Not available"}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <QuickStat
                icon="€"
                label="Price"
                value={`€${p.discounted_price ?? p.price ?? "N/A"}`}
                color="text-[#8B6F47]"
                iconType="text"
              />
              <QuickStat
                icon={<Box />}
                label="Stock"
                value={`${p.stock_quantity ?? "N/A"} units`}
                color="text-[#f6921e]"
              />
              <QuickStat
                icon={<ShoppingCart />}
                label="Total Sales"
                value={`${p.total_sold ?? 0} sold`}
                color="text-[#00a86b]"
              />
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-normal text-[#1a1410]">{p.name || "Not available"}</h1>
                <span className="text-sm text-gray-500">SKU: {p.sku || "Not available"}</span>
              </div>

              <div className="flex flex-col text-sm text-gray-500 text-right">
                <span>Added on:</span>
                <div className="flex items-center gap-1">
                  <Image src={calanderIcon} alt="Added date" width={18} height={18} />
                  <span>{p.created_at ? new Date(p.created_at).toLocaleDateString() : "Not available"}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <h2 className="text-lg font-semibold text-gray-800">Description</h2>
            <p className="text-gray-600">{p.description || "No description available"}</p>

            {/* Colors */}
            <h2 className="text-lg font-semibold mt-4">Available Colors</h2>
            <div className="flex flex-wrap gap-3">
              {p.color_code ? (
                <div className="flex items-center gap-2 px-4 py-2 border rounded-xl cursor-pointer">
                  <div className={`w-5 h-5 rounded-full ${getColorSwatchClass(p.color_code)}`} />
                  {p.color_code}
                </div>
              ) : (
                <p>Not available</p>
              )}
            </div>

            {/* Sizes */}
            <h2 className="text-lg font-semibold mt-4">Available Sizes</h2>
            <div className="flex flex-wrap gap-3 border-b pb-4">
              {allSizes.length > 0 ? (
                allSizes.map((size) => (
                  <div
                    key={size}
                    className="w-12 h-12 flex items-center justify-center text-base font-medium rounded-xl bg-[#8B6F47] text-white"
                  >
                    {size}
                  </div>
                ))
              ) : (
                <p>Not available</p>
              )}
            </div>
          </Card>

          {/* Sales Performance */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Sales Performance</h2>
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              <SalesStat label="Total Revenue" value="€0" change="N/A" />
              <SalesStat label="Avg. Order Value" value={`€${p.discounted_price ?? p.price ?? "N/A"}`} change="N/A" />
              <SalesStat label="Return Rate" value="0%" change="N/A" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;



