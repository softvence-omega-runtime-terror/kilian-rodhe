"use client";

import React, { useState, useRef } from "react";
import { Check } from "lucide-react";
import Image from "next/image";

import uploadIcon from "@/public/image/admin/products/upload.svg";
import rightRoundedIcon from "@/public/image/admin/products/rightBorderIcon.svg";
import qualityIcon from "@/public/image/admin/products/quality.svg";
import DesignSelectorField from "./DesignSelectorField";
import Title from "./Title";
import { ViewChangeHandler } from "./Products";

// Card wrapper
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#e8e3dc]">
    {children}
  </div>
);

// Input Field Component (Kept for completeness, not directly used in the list view)
interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

const InputField = ({
  label,
  placeholder,
  type = "text",
  required = true,
  options = [],
}: InputFieldProps) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    {type === "select" ? (
      <select
        defaultValue=""
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
        className="w-full px-4 py-3 border border-[#E8E3DC] rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none transition duration-200"
        required={required}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-[#E8E3DC] rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none transition duration-200"
        required={required}
      />
    )}
  </div>
);

// --- Add New Product Screen ---
const AddNewProductScreen = ({
  onViewChange,
}: {
   onViewChange: ViewChangeHandler;
}) => {
  const categoryOptions = [
    { value: "clothing", label: "Clothing" },
    { value: "accessories", label: "Accessories" },
    { value: "footwear", label: "Footwear" },
  ];

  const ageGroupOptions = [
    { value: "adult", label: "Adult" },
    { value: "kid", label: "Kids" },
    { value: "toddler", label: "Toddlers" },
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

  const handleSelectedColorsChange = (colors: string[]) =>
    console.log("Selected colors:", colors);
  const handleSelectedSizesChange = (sizes: string[]) =>
    console.log("Selected sizes:", sizes);

  const handleAction = (action: "cancel" | "add") => {
    if (action === "cancel") onViewChange("list");
    else {
      console.log("Product Added!");
      onViewChange("list");
    }
  };

  // --- IMAGE UPLOAD STATE ---
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const ColorSelectorField = ({
    label,
    description,
    colors,
    required = true,
    onColorChange,
  }: ColorSelectorFieldProps) => {
    const [selectedColors, setSelectedColors] = useState<string[]>([]);

    const handleColorClick = (value: string) => {
      setSelectedColors((prev) => {
        const newSelected = prev.includes(value)
          ? prev.filter((c) => c !== value)
          : [...prev, value];
        onColorChange?.(newSelected);
        return newSelected;
      });
    };

    return (
      <div className="flex flex-col space-y-2">
        <label className="text-lg font-semibold text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <p className="text-sm text-gray-500 mb-4">{description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {colors.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => handleColorClick(color.value)}
              className={`flex items-center justify-start p-3 border rounded-xl transition-all duration-200 ${
                selectedColors.includes(color.value)
                  ? "border-[#8B6F47] ring-2 ring-[#8B6F47]/50 bg-[#8B6F47]/10"
                  : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full mr-3 border border-gray-200 shadow-sm flex items-center justify-center ${
                  color.value === "white" ? "border-gray-400" : ""
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {selectedColors.includes(color.value) && (
                  <Check
                    className={`w-4 h-4 ${
                      color.value === "white" || color.value === "yellow"
                        ? "text-[#8B6F47]"
                        : "text-white"
                    }`}
                  />
                )}
              </span>
              <span
                className={`font-medium ${
                  selectedColors.includes(color.value)
                    ? "text-[#8B6F47]"
                    : "text-gray-700"
                }`}
              >
                {color.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  interface ColorSelectorFieldProps {
    label: string;
    description: string;
    colors: { value: string; label: string; hex: string }[];
    required?: boolean;
    onColorChange?: (colors: string[]) => void;
  }


  interface SizeSelectorFieldProps {
    label: string;
    description: string;
    required?: boolean;
    onSizeChange?: (sizes: string[]) => void;
  }

  const SizeSelectorField = ({
    label,
    description,
    required = true,
    onSizeChange,
  }: SizeSelectorFieldProps) => {
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    const sizeGroups = [
      {
        title: "Clothing Sizes",
        type: "clothing",
        sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      },
      {
        title: "Kids Sizes",
        type: "kids",
        sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
      },
      { title: "Mug Sizes", type: "mug", sizes: ["11oz", "15oz", "20oz"] },
    ];

    const universalSize = "One Size (Universal)";

    const handleSizeClick = (size: string) => {
      setSelectedSizes((prev) => {
        const isUniversal = size === universalSize;
        const newSelected = prev.includes(size)
          ? prev.filter((s) => s !== size)
          : isUniversal
          ? [size]
          : prev.includes(universalSize)
          ? [size]
          : [...prev, size];

        onSizeChange?.(newSelected);
        return newSelected;
      });
    };

    return (
      <div className="flex flex-col space-y-2">
        <label className="text-lg font-semibold text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <p className="text-sm text-gray-500 mb-4">{description}</p>

        {sizeGroups.map((group, idx) => (
          <div key={group.type}>
            <h4 className="text-base font-medium text-gray-700 mb-3 mt-4">
              {group.title}
            </h4>
            <div className="flex flex-wrap gap-3 mb-4">
              {group.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeClick(size)}
                  className={`px-4 py-2 border rounded-xl text-sm font-semibold transition-all duration-200 ${
                    selectedSizes.includes(size)
                      ? "border-[#8B6F47] bg-[#8B6F47] text-white"
                      : "border-gray-300 text-gray-700 bg-white hover:border-gray-400"
                  }`}
                  disabled={selectedSizes.includes(universalSize)}
                >
                  {size}
                </button>
              ))}
            </div>
            {idx < sizeGroups.length - 1 && (
              <hr className="border-gray-200 my-2" />
            )}
          </div>
        ))}

        <div className="pt-4">
          <button
            type="button"
            onClick={() => handleSizeClick(universalSize)}
            className={`px-6 py-2 border rounded-xl text-sm font-semibold transition-all duration-200 ${
              selectedSizes.includes(universalSize)
                ? "border-[#8B6F47] bg-[#8B6F47] text-white"
                : "border-gray-300 text-gray-700 bg-white hover:border-gray-400"
            }`}
          >
            {universalSize}
          </button>
        </div>
      </div>
    );
  };

  const QualityAssuranceBox = () => (
    <div className="flex flex-col  px-4 p-6 bg-[#ECF3FF] border border-[#BEDBFF] rounded-xl mt-6">
      <div className="flex items-center  mb-2">
        <Image src={qualityIcon} alt="quality" height={24} width={24} />
        <h4 className="text-lg font-semibold ml-3 text-gray-800">
          Quality Assurance
        </h4>
      </div>
      <p className="text-sm text-gray-700 mt-1">
        All products support <strong>300 DPI</strong> quality checks to ensure
        crisp, professional printing results. Customers will be notified if
        their uploaded designs don&apos;t meet quality standards.
      </p>
    </div>
  );

  return (
    <>
      <div className="p-4 sm:p-8 w-full min-h-screen bg-gray-50 font-sans">
        {/* Header + Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-gray-200">
          {/* Title and Back Button Section */}
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <button
              onClick={() => onViewChange("list")}
              className="p-3 bg-white rounded-xl border border-[#E8E3DC] hover:bg-gray-100 transition duration-200 text-gray-600"
            >
              {/* Replace with your actual icon component */}
              {/* <ArrowLeftIcon className="w-6 h-6" /> */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
            </button>
            <div className="flex flex-col">
              <Title
                text="Add New Product"
                paragraph=" Fill in the details below to add a new product to your catalog"
              />
            </div>
          </div>

          {/* Action Buttons Section - Made responsive */}
          <div className="flex flex-col w-full md:w-auto space-y-3 md:flex-row md:space-x-4 md:space-y-0">
            {/* Cancel Button */}
            <button
              onClick={() => handleAction("cancel")}
              className="flex items-center justify-center px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition duration-200 w-full md:w-auto"
            >
              {/* Replace with your actual icon component */}
              {/* <X className="w-4 h-4 mr-2" /> Cancel */}
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>{" "}
              Cancel
            </button>

            {/* Add Product Button */}
            <button
              onClick={() => handleAction("add")}
              className="flex items-center justify-center px-6 py-2 bg-[#8B6F47] text-white font-semibold rounded-xl hover:bg-[#A08169] transition duration-200 shadow-md w-full md:w-auto"
            >
              {/* Replace with your actual icon component */}
              {/* <Plus className="w-4 h-4 mr-2" /> Add Product */}
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>{" "}
              Add Product
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Left Column: Image */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Product Image
              </h3>
              <div
                onClick={handleImageClick}
                className="flex flex-col items-center justify-center p-8 rounded-[10px] border-2 border-[#E8E3DC] bg-gradient-to-br from-[#FAF9F7] to-[#E8E3DC]/30 h-96 cursor-pointer transition duration-200"
              >
                <div className="p-4 bg-white rounded-full border border-gray-200 mb-3">
                  <Image src={uploadIcon} alt="Upload" height={24} width={24} />
                </div>

                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    width={150}
                    height={150}
                    className="mb-3 rounded"
                  />
                ) : (
                  <>
                    <p className="text-base font-semibold text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG or WEBP (max. 5MB)
                    </p>
                    <p className="text-xs text-gray-400">
                      Recommended: 1200x1200px, 300 DPI
                    </p>
                  </>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
              />

              <div className="flex items-start p-4 mt-4 bg-white border border-[#BEDBFF] rounded-xl">
                <Image
                  src={rightRoundedIcon}
                  alt="Tip"
                  height={20}
                  width={20}
                />
                <p className="ml-3 text-sm text-gray-600">
                  High-quality images help customers make purchase decisions
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column: Product Info */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Basic Information
              </h3>

              <div className="space-y-6">
                <InputField
                  label="Product Name"
                  placeholder="e.g., Premium Custom T-Shirt"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    label="Category"
                    placeholder="Select category"
                    type="select"
                    required
                    options={categoryOptions}
                  />
                  <InputField
                    label="Age Group"
                    placeholder="Select age group"
                    type="select"
                    required
                    options={ageGroupOptions}
                  />
                </div>
                <InputField
                  label="Product Description"
                  placeholder="Describe your product in detail. Include material, fit, and special features..."
                  type="textarea"
                  required
                />
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Pricing & Inventory
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <InputField
                  label="Price (USD)"
                  placeholder="99.00"
                  type="number"
                />
                <InputField
                  label="Stock Quantity"
                  placeholder="100"
                  type="number"
                />
                <InputField
                  label="SKU (Stock Keeping Unit)"
                  placeholder="TSHIRT-BLK-L"
                  required={false}
                />
              </div>
            </Card>

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
              <DesignSelectorField />
              <QualityAssuranceBox />
            </Card>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNewProductScreen;
