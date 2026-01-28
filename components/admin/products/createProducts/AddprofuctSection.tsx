// "use client";

// import React, { useState, useRef } from "react";
// import Image from "next/image";

// import uploadIcon from "@/public/image/admin/products/upload.svg";
// import rightRoundedIcon from "@/public/image/admin/products/rightBorderIcon.svg";
// import DesignSelectorField from "./DesignSelectorField";
// import Title from "../../Title";
// import { ViewChangeHandler } from "../Products";
// import Card from "@/app/utils/shared/Card";
// import QualityAssuranceBox from "./QualityAssuranceBox";
// import ColorSelectorField from "./ColorSelectorField";
// import SizeSelectorField from "./SizeSelectorField";
// import { useGetProductCategoriesQuery } from "@/app/store/slices/services/product/productApi";

// // Input Field Component
// interface InputFieldProps {
//   label: string;
//   placeholder: string;
//   type?: string;
//   required?: boolean;
//   options?: { value: string; label: string }[];
//   value?: string;
//   onChange?: (e: any) => void;
// }

// const InputField = ({
//   label,
//   placeholder,
//   type = "text",
//   required = true,
//   options = [],
//   value,
//   onChange,
// }: InputFieldProps) => (
//   <div className="flex flex-col space-y-2">
//     <label className="text-sm font-medium text-gray-700">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>

//     {type === "select" ? (
//       <select
//         value={value || ""}
//         onChange={onChange}
//         className="w-full px-4 py-3 border border-[#E8E3DC] rounded-xl bg-gray-50 text-gray-600 focus:outline-none transition duration-200 appearance-none pr-10"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "right 0.75rem center",
//           backgroundSize: "1.25rem 1.25rem",
//           color: "#6B7280",
//         }}
//       >
//         <option value="" disabled>
//           {placeholder}
//         </option>
//         {options.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     ) : type === "textarea" ? (
//       <textarea
//         rows={4}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         className="w-full px-4 py-3 border border-[#E8E3DC] rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none transition duration-200"
//         required={required}
//       />
//     ) : (
//       <input
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         className="w-full px-4 py-3 border border-[#E8E3DC] rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none transition duration-200"
//         required={required}
//       />
//     )}
//   </div>
// );

// // Boolean select options
// const booleanOptions = [
//   { value: "true", label: "Yes" },
//   { value: "false", label: "No" },
// ];

// // --- Add New Product Screen ---
// const AddNewProductScreen = ({ onViewChange }: { onViewChange: ViewChangeHandler }) => {

//   const {data, isLoading} = useGetProductCategoriesQuery()
//   console.log(data, "cate data")







//    const categoryOptions =
//     data?.results?.map((category: any) => ({
//       value: String(category.id),
//       label: category.title,
//     })) || [];


//   const ageGroupOptions = [
//     { value: "adult", label: "Adult" },
//     { value: "kid", label: "Kids" },
//     { value: "toddler", label: "Toddlers" },
//   ];

//   const availableColors = [
//     { value: "black", label: "Black", hex: "#000000" },
//     { value: "white", label: "White", hex: "#FFFFFF" },
//     { value: "navy", label: "Navy", hex: "#000080" },
//     { value: "grey", label: "Grey", hex: "#808080" },
//     { value: "red", label: "Red", hex: "#FF0000" },
//     { value: "blue", label: "Blue", hex: "#0000FF" },
//     { value: "green", label: "Green", hex: "#008000" },
//     { value: "brown", label: "Brown", hex: "#A52A2A" },
//     { value: "pink", label: "Pink", hex: "#FFC0CB" },
//     { value: "yellow", label: "Yellow", hex: "#FFFF00" },
//     { value: "purple", label: "Purple", hex: "#800080" },
//     { value: "orange", label: "Orange", hex: "#FFA500" },
//   ];

//   // -------------------------
//   // Main product state
//   // -------------------------
//   const [productData, setProductData] = useState({
//     name: "",
//     category: "",
//     ageGroup: "",
//     description: "",
//     price: "",
//     discount_percentage: "",
//     stock: "",
//     sku: "",
//     is_universal_size: "false",
//     ai_gen: "false",
//     ai_letter: "false",
//     ai_upload: "false",
//     is_customize: "false",
//     is_active: "true",
//     images: [] as string[],
//     colors: [] as string[],
//     sizes: [] as string[],
//     designs: [] as string[],
//   });

//   // -------------------------
//   // IMAGE UPLOAD HANDLING
//   // -------------------------
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleImageClick = () => fileInputRef.current?.click();

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;
//     Array.from(files).forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setProductData((prev) => ({
//           ...prev,
//           images: [...prev.images, reader.result as string],
//         }));
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleSelectedColorsChange = (colors: string[]) =>
//     setProductData((prev) => ({ ...prev, colors }));
//   const handleSelectedSizesChange = (sizes: string[]) =>
//     setProductData((prev) => ({ ...prev, sizes }));
//   const handleSelectedDesignsChange = (designs: string[]) =>
//     setProductData((prev) => ({ ...prev, designs }));

//   // -------------------------
//   // ADD / CANCEL ACTION
//   // -------------------------
//   const handleAction = (action: "cancel" | "add") => {
//     if (action === "cancel") onViewChange("list");
//     else {
//       console.log("Full Product Data:", productData);
//       onViewChange("list");
//     }
//   };

//   return (
//     <div className="p-4 sm:p-8 w-full min-h-screen bg-gray-50 font-sans">
//       {/* Header + Actions */}
//       <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-gray-200">
//         <div className="flex items-center space-x-4 mb-4 md:mb-0">
//           <button
//             onClick={() => onViewChange("list")}
//             className="p-3 bg-white rounded-xl border border-[#E8E3DC] hover:bg-gray-100 transition duration-200 text-gray-600"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M10 19l-7-7m0 0l7-7m-7 7h18"
//               />
//             </svg>
//           </button>
//           <div className="flex flex-col">
//             <Title
//               text="Add New Product"
//               paragraph=" Fill in the details below to add a new product to your catalog"
//             />
//           </div>
//         </div>

//         <div className="flex flex-col w-full md:w-auto space-y-3 md:flex-row md:space-x-4 md:space-y-0">
//           <button
//             onClick={() => handleAction("cancel")}
//             className="flex items-center justify-center px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition duration-200 w-full md:w-auto"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => handleAction("add")}
//             className="flex items-center justify-center px-6 py-2 bg-[#8B6F47] text-white font-semibold rounded-xl hover:bg-[#A08169] transition duration-200 shadow-md w-full md:w-auto"
//           >
//             Add Product
//           </button>
//         </div>
//       </div>

//       {/* Form */}
//       <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={(e) => e.preventDefault()}>
//         {/* Left Column: Images */}
//         <div className="lg:col-span-1">
//           <Card>
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h3>
//             <div
//               onClick={handleImageClick}
//               className="flex flex-col items-center justify-center p-8 rounded-[10px] border-2 border-[#E8E3DC] bg-gradient-to-br from-[#FAF9F7] to-[#E8E3DC]/30 h-96 cursor-pointer transition duration-200"
//             >
//               <div className="p-4 bg-white rounded-full border border-gray-200 mb-3">
//                 <Image src={uploadIcon} alt="Upload" height={24} width={24} />
//               </div>

//               {productData.images.length > 0 ? (
//                 <div className="flex flex-wrap gap-2 justify-center">
//                   {productData.images.map((img, idx) => (
//                     <Image key={idx} src={img} alt={`Selected ${idx}`} width={100} height={100} className="rounded" />
//                   ))}
//                 </div>
//               ) : (
//                 <>
//                   <p className="text-base font-semibold text-gray-600">Click to upload or drag and drop</p>
//                   <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (max. 5MB)</p>
//                   <p className="text-xs text-gray-400">Recommended: 1200x1200px, 300 DPI</p>
//                 </>
//               )}
//             </div>

//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               className="hidden"
//               accept="image/png, image/jpeg, image/webp"
//               multiple
//             />

//             <div className="flex items-start p-4 mt-4 bg-white border border-[#BEDBFF] rounded-xl">
//               <Image src={rightRoundedIcon} alt="Tip" height={20} width={20} />
//               <p className="ml-3 text-sm text-gray-600">
//                 High-quality images help customers make purchase decisions
//               </p>
//             </div>
//           </Card>
//         </div>

//         {/* Right Column: Product Info */}
//         <div className="lg:col-span-2 space-y-4">
//           {/* Basic Information */}
//           <Card>
//             <h3 className="text-lg font-semibold text-gray-800 mb-6">Basic Information</h3>
//             <div className="space-y-6">
//               <InputField
//                 label="Product Name"
//                 placeholder="e.g., Premium Custom T-Shirt"
//                 value={productData.name}
//                 onChange={(e) => setProductData({ ...productData, name: e.target.value })}
//               />
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <InputField
//                   label="Category"
//                   placeholder="Select category"
//                   type="select"
//                   value={productData.category}
//                   onChange={(e) => setProductData({ ...productData, category: e.target.value })}
//                   options={categoryOptions}
//                 />
//                 <InputField
//                   label="Age Group"
//                   placeholder="Select age group"
//                   type="select"
//                   value={productData.ageGroup}
//                   onChange={(e) => setProductData({ ...productData, ageGroup: e.target.value })}
//                   options={ageGroupOptions}
//                 />
//               </div>
//               <InputField
//                 label="Product Description"
//                 placeholder="Describe your product in detail..."
//                 type="textarea"
//                 value={productData.description}
//                 onChange={(e) => setProductData({ ...productData, description: e.target.value })}
//               />
//             </div>
//           </Card>

//           {/* Pricing & Inventory */}
//           <Card>
//             <h3 className="text-lg font-semibold text-gray-800 mb-6">Pricing & Inventory</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//               <InputField
//                 label="Price (USD)"
//                 type="number"
//                 value={productData.price}
//                 onChange={(e) => setProductData({ ...productData, price: e.target.value })} placeholder={""}              />
//               <InputField
//                 label="Stock Quantity"
//                 type="number"
//                 value={productData.stock}
//                 onChange={(e) => setProductData({ ...productData, stock: e.target.value })} placeholder={""}              />
//               <InputField
//                 label="SKU (Stock Keeping Unit)"
//                 value={productData.sku}
//                 onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
//                 required={false} placeholder={""}              />
//               <InputField
//                 label="Discount %"
//                 type="number"
//                 value={productData.discount_percentage}
//                 onChange={(e) => setProductData({ ...productData, discount_percentage: e.target.value })} placeholder={""}              />
//               <InputField
//                 label="Universal Size"
//                 type="select"
//                 value={productData.is_universal_size}
//                 onChange={(e) => setProductData({ ...productData, is_universal_size: e.target.value })}
//                 options={booleanOptions} placeholder={""}              />
//               <InputField
//                 label="AI Gen"
//                 type="select"
//                 value={productData.ai_gen}
//                 onChange={(e) => setProductData({ ...productData, ai_gen: e.target.value })}
//                 options={booleanOptions} placeholder={""}              />
//               <InputField
//                 label="AI Letter"
//                 type="select"
//                 value={productData.ai_letter}
//                 onChange={(e) => setProductData({ ...productData, ai_letter: e.target.value })}
//                 options={booleanOptions} placeholder={""}              />
//               <InputField
//                 label="AI Upload"
//                 type="select"
//                 value={productData.ai_upload}
//                 onChange={(e) => setProductData({ ...productData, ai_upload: e.target.value })}
//                 options={booleanOptions} placeholder={""}              />
//               <InputField
//                 label="Customizable"
//                 type="select"
//                 value={productData.is_customize}
//                 onChange={(e) => setProductData({ ...productData, is_customize: e.target.value })}
//                 options={booleanOptions} placeholder={""}              />
//               <InputField
//                 label="Active"
//                 type="select"
//                 value={productData.is_active}
//                 onChange={(e) => setProductData({ ...productData, is_active: e.target.value })}
//                 options={booleanOptions} placeholder={""}              />
//             </div>
//           </Card>

//           {/* Colors, Sizes, Designs */}
//           <Card>
//             <ColorSelectorField
//               label="Available Colors"
//               description="Select all colors available for this product"
//               colors={availableColors}
//               required
//               onColorChange={handleSelectedColorsChange}
//             />
//           </Card>
//           <Card>
//             <SizeSelectorField
//               label="Available Sizes"
//               description="Select all sizes available for this product"
//               required
//               onSizeChange={handleSelectedSizesChange}
//             />
//           </Card>
//           <Card>
//             <DesignSelectorField onDesignChange={handleSelectedDesignsChange} />
//             <QualityAssuranceBox />
//           </Card>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddNewProductScreen;


"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

import uploadIcon from "@/public/image/admin/products/upload.svg";
import rightRoundedIcon from "@/public/image/admin/products/rightBorderIcon.svg";
import DesignSelectorField from "./DesignSelectorField";
import Title from "../../Title";
import { ViewChangeHandler } from "../Products";
import Card from "@/app/utils/shared/Card";
import QualityAssuranceBox from "./QualityAssuranceBox";
import ColorSelectorField from "./ColorSelectorField";
import SizeSelectorField from "./SizeSelectorField";
import { useGetProductCategoriesQuery } from "@/app/store/slices/services/product/productApi";
import { useCreateProductMutation } from "@/app/store/slices/services/adminService/products/createProductApi";

// Input Field Component
interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (e: any) => void;
}

const InputField = ({
  label,
  placeholder,
  type = "text",
  required = true,
  options = [],
  value,
  onChange,
}: InputFieldProps) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    {type === "select" ? (
      <select
        value={value || ""}
        onChange={onChange}
        className="w-full px-4 py-3 border border-[#E8E3DC] rounded-xl bg-gray-50 text-gray-600 focus:outline-none transition duration-200 appearance-none pr-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1.25rem 1.25rem",
          color: "#6B7280",
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : type === "textarea" ? (
      <textarea
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-[#E8E3DC] rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none transition duration-200"
        required={required}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-[#E8E3DC] rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none transition duration-200"
        required={required}
      />
    )}
  </div>
);

// Boolean select options
const booleanOptions = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

// --- Add New Product Screen ---
const AddNewProductScreen = ({ onViewChange }: { onViewChange: ViewChangeHandler }) => {

  const { data: categoriesData } = useGetProductCategoriesQuery();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const categoryOptions =
    categoriesData?.results?.map((category: any) => ({
      value: String(category.id),
      label: category.title,
    })) || [];

  const subCategoryOptions: { value: string; label: string }[] = []; // populate dynamically if needed
  const classificationOptions: { value: string; label: string }[] = []; // populate dynamically if needed

  const ageGroupOptions = [
    { value: "1", label: "Adult" },
    { value: "2", label: "Kids" },
    { value: "3", label: "Toddlers" },
  ];

  const availableColors = [
    { value: "black", label: "Black", hex: "#000000" },
    { value: "white", label: "White", hex: "#FFFFFF" },
    { value: "navy", label: "Navy", hex: "#000080" },
    { value: "grey", label: "Grey", hex: "#808080" },
    { value: "red", label: "Red", hex: "#FF0000" },
    { value: "blue", label: "Blue", hex: "#0000FF" },
    { value: "green", label: "Green", hex: "#008000" },
    { value: "brown", label: "Brown", hex: "#A52A2A" },
    { value: "pink", label: "Pink", hex: "#FFC0CB" },
    { value: "yellow", label: "Yellow", hex: "#FFFF00" },
    { value: "purple", label: "Purple", hex: "#800080" },
    { value: "orange", label: "Orange", hex: "#FFA500" },
  ];

  // -------------------------
  // Main product state
  // -------------------------
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    sub_category: "",
    classification: "",
    ageGroup: "",
    description: "",
    price: "",
    discount_percentage: "",
    stock: "",
    sku: "",
    is_universal_size: "false",
    ai_gen: "false",
    ai_letter: "false",
    ai_upload: "false",
    is_customize: "false",
    is_active: "true",
    images: [] as File[], // store actual File objects
    colors: [] as string[],
    sizes: [] as string[],
    designs: [] as string[],
  });

  // -------------------------
  // IMAGE UPLOAD HANDLING
  // -------------------------
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...Array.from(files)],
    }));
  };

  const handleSelectedColorsChange = (colors: string[]) =>
    setProductData((prev) => ({ ...prev, colors }));
  const handleSelectedSizesChange = (sizes: string[]) =>
    setProductData((prev) => ({ ...prev, sizes }));
  const handleSelectedDesignsChange = (designs: string[]) =>
    setProductData((prev) => ({ ...prev, designs }));

  // -------------------------
  // MAP UI DATA TO BACKEND FORMAT
  // -------------------------
  const mapUIToRequest = () => {
    const clothSizes: Record<string, number> = {};
    const kidsSizes: Record<string, number> = {};
    const mugSizes: Record<string, number> = {};

    productData.sizes.forEach((size) => {
      if (size.includes("kid")) kidsSizes[size] = 1;
      else if (size.includes("mug")) mugSizes[size] = 1;
      else clothSizes[size] = 1;
    });

    return {
      name: productData.name,
      images: productData.images,
      category: Number(productData.category),
      sub_category: Number(productData.sub_category),
      classification: Number(productData.classification),
      age_range: Number(productData.ageGroup),
      description: productData.description,
      price: Number(productData.price),
      discount_percentage: Number(productData.discount_percentage || 0),
      stock_quantity: Number(productData.stock),
      sku: productData.sku,
      colors: productData.colors.join(","),

      is_universal_size: productData.is_universal_size === "true",
      cloth_size: Object.keys(clothSizes).length > 0 ? clothSizes : undefined,
      kids_size: Object.keys(kidsSizes).length > 0 ? kidsSizes : undefined,
      mug_size: Object.keys(mugSizes).length > 0 ? mugSizes : undefined,

      ai_gen: productData.designs.includes("ai") || productData.ai_gen === "true",
      ai_letter: productData.designs.includes("letter") || productData.ai_letter === "true",
      ai_upload: productData.designs.includes("custom") || productData.ai_upload === "true",
      is_customize: productData.is_customize === "true",
      is_active: productData.is_active === "true",
    };
  };

  // -------------------------
  // ADD / CANCEL ACTION
  // -------------------------
  const handleAction = async (action: "cancel" | "add") => {
    if (action === "cancel") return onViewChange("list");

    try {
      const payload = mapUIToRequest();
      await createProduct(payload).unwrap();
      onViewChange("list");
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to create product. Check console for details.");
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full min-h-screen bg-gray-50 font-sans">
      {/* Header + Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => onViewChange("list")}
            className="p-3 bg-white rounded-xl border border-[#E8E3DC] hover:bg-gray-100 transition duration-200 text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div className="flex flex-col">
            <Title
              text="Add New Product"
              paragraph=" Fill in the details below to add a new product to your catalog"
            />
          </div>
        </div>

        <div className="flex flex-col w-full md:w-auto space-y-3 md:flex-row md:space-x-4 md:space-y-0">
          <button
            onClick={() => handleAction("cancel")}
            className="flex items-center justify-center px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition duration-200 w-full md:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={() => handleAction("add")}
            className="flex items-center justify-center px-6 py-2 bg-[#8B6F47] text-white font-semibold rounded-xl hover:bg-[#A08169] transition duration-200 shadow-md w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={(e) => e.preventDefault()}>
        {/* Left Column: Images */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h3>
            <div
              onClick={handleImageClick}
              className="flex flex-col items-center justify-center p-8 rounded-[10px] border-2 border-[#E8E3DC] bg-gradient-to-br from-[#FAF9F7] to-[#E8E3DC]/30 h-96 cursor-pointer transition duration-200"
            >
              <div className="p-4 bg-white rounded-full border border-gray-200 mb-3">
                <Image src={uploadIcon} alt="Upload" height={24} width={24} />
              </div>

              {productData.images.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-center">
                  {productData.images.map((file, idx) => (
                    <p key={idx} className="text-xs text-gray-500">{file.name}</p>
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-base font-semibold text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (max. 5MB)</p>
                  <p className="text-xs text-gray-400">Recommended: 1200x1200px, 300 DPI</p>
                </>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              multiple
            />

            <div className="flex items-start p-4 mt-4 bg-white border border-[#BEDBFF] rounded-xl">
              <Image src={rightRoundedIcon} alt="Tip" height={20} width={20} />
              <p className="ml-3 text-sm text-gray-600">
                High-quality images help customers make purchase decisions
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column: Product Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Basic Information</h3>
            <div className="space-y-6">
              <InputField
                label="Product Name"
                placeholder="e.g., Premium Custom T-Shirt"
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <InputField
                  label="Category"
                  placeholder="Select category"
                  type="select"
                  value={productData.category}
                  onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                  options={categoryOptions}
                />
                <InputField
                  label="Sub Category"
                  placeholder="Select sub-category"
                  type="select"
                  value={productData.sub_category}
                  onChange={(e) => setProductData({ ...productData, sub_category: e.target.value })}
                  options={subCategoryOptions}
                />
                <InputField
                  label="Classification"
                  placeholder="Select classification"
                  type="select"
                  value={productData.classification}
                  onChange={(e) => setProductData({ ...productData, classification: e.target.value })}
                  options={classificationOptions}
                />
              </div>
              <InputField
                label="Age Group"
                placeholder="Select age group"
                type="select"
                value={productData.ageGroup}
                onChange={(e) => setProductData({ ...productData, ageGroup: e.target.value })}
                options={ageGroupOptions}
              />
              <InputField
                label="Product Description"
                placeholder="Describe your product in detail..."
                type="textarea"
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              />
            </div>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <InputField
                label="Price (USD)"
                type="number"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: e.target.value })} placeholder={""}              />
              <InputField
                label="Stock Quantity"
                type="number"
                value={productData.stock}
                onChange={(e) => setProductData({ ...productData, stock: e.target.value })} placeholder={""}              />
              <InputField
                label="SKU (Stock Keeping Unit)"
                value={productData.sku}
                onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
                required={false} placeholder={""}              />
              <InputField
                label="Discount %"
                type="number"
                value={productData.discount_percentage}
                onChange={(e) => setProductData({ ...productData, discount_percentage: e.target.value })} placeholder={""}              />
              <InputField
                label="Universal Size"
                type="select"
                value={productData.is_universal_size}
                onChange={(e) => setProductData({ ...productData, is_universal_size: e.target.value })}
                options={booleanOptions} placeholder={""}              />
              <InputField
                label="AI Gen"
                type="select"
                value={productData.ai_gen}
                onChange={(e) => setProductData({ ...productData, ai_gen: e.target.value })}
                options={booleanOptions} placeholder={""}              />
              <InputField
                label="AI Letter"
                type="select"
                value={productData.ai_letter}
                onChange={(e) => setProductData({ ...productData, ai_letter: e.target.value })}
                options={booleanOptions} placeholder={""}              />
              <InputField
                label="AI Upload"
                type="select"
                value={productData.ai_upload}
                onChange={(e) => setProductData({ ...productData, ai_upload: e.target.value })}
                options={booleanOptions} placeholder={""}              />
              <InputField
                label="Customizable"
                type="select"
                value={productData.is_customize}
                onChange={(e) => setProductData({ ...productData, is_customize: e.target.value })}
                options={booleanOptions} placeholder={""}              />
              <InputField
                label="Active"
                type="select"
                value={productData.is_active}
                onChange={(e) => setProductData({ ...productData, is_active: e.target.value })}
                options={booleanOptions} placeholder={""}              />
            </div>
          </Card>

          {/* Colors, Sizes, Designs */}
          <Card>
            <ColorSelectorField
              label="Available Colors"
              description="Select all colors available for this product"
              colors={availableColors}
              required
              onColorChange={handleSelectedColorsChange}
            />
          </Card>
          <Card>
            <SizeSelectorField
              label="Available Sizes"
              description="Select all sizes available for this product"
              required
              onSizeChange={handleSelectedSizesChange}
            />
          </Card>
          <Card>
            <DesignSelectorField onDesignChange={handleSelectedDesignsChange} />
            <QualityAssuranceBox />
          </Card>
        </div>
      </form>
    </div>
  );
};

export default AddNewProductScreen;
