"use client";
import React, { useState, useRef, ChangeEvent } from "react";
// FIX 1: Imported missing icons: Box and ShoppingCart (already present in the provided code)
import { X, Check, ArrowLeftIcon } from "lucide-react";
import Image from "next/image";

// Local image imports are correct
import uploadIcon from "@/public/image/admin/products/upload.svg";
import rightRoundedIcon from "@/public/image/admin/products/rightBorderIcon.svg";
import qualityIcon from "@/public/image/admin/products/quality.svg";
import productImage from "@/public/image/admin/products/productImage.jpg";
// FIX: Changed dollerIcon, increamentIcon, stockIcon to be passed as Image source strings
import dollerIcon from "@/public/image/admin/products/doller.svg";
import increamentIcon from "@/public/image/admin/products/increamentArrow.svg";
import stockIcon from "@/public/image/admin/products/stock.svg";
import FooterAdmin from "@/components/admin/FooterAdmin";
import Title from "./Title";
import { ViewChangeHandler } from "./Products";

// Card wrapper
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white p-6 md:p-8 mb-6 rounded-2xl border border-[#e8e3dc]">
    {children}
  </div>
);

// --- FIXED QuickStat Component ---
const QuickStat = ({
  icon,
  label,
  value,
  color,
  iconType = "icon",
}: {
  // icon can now be a Lucide Element, a string (for text/emoji), or an Image source string
  icon: React.ReactElement<{ className?: string }> | string;
  label: string;
  value: string;
  color: string;
  iconType?: "icon" | "text" | "image"; // Added 'image' type
}) => (
  <div className="flex items-center space-x-3">
    {/* FIX 3: Dynamically set the background color using the 'color' prop */}
    <div className={`p-3 rounded-xl ${color.replace("text-", "bg-")}/20`}>
      {iconType === "text" ? (
        <span className={`${color} text-lg font-bold`}>{icon}</span>
      ) : iconType === "image" && typeof icon === "string" ? (
        // Render local Image using the string source
        <Image
          src={icon}
          alt={label}
          width={20}
          height={20}
          className="w-5 h-5"
        />
      ) : React.isValidElement(icon) ? (
        // Render Lucide Icon
        React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
          className: `w-5 h-5 ${color}`,
        })
      ) : (
        // Fallback for missing/invalid icon
        <div className={`w-5 h-5 ${color}`} />
      )}
    </div>

    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-xl font-bold text-gray-800">{value}</span>
    </div>
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

interface DesignOption {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

// --- Add/Edit Product Screen ---
const EditProduct = ({
  onViewChange,
}: {
   productId: number;   
   onViewChange: ViewChangeHandler;
}) => {
  // FIX 2: Define mock 'product' object for QuickStats to work
  const product = {
    price: "€34.99",
    stock: 156,
    sales: 234,
  };

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
      console.log("Product Changes Saved!");
      onViewChange("list");
    }
  };

  // --- IMAGE UPLOAD STATE ---

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

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
        const isCurrentlySelected = prev.includes(size);

        let newSelected: string[];

        if (isUniversal) {
          // If Universal is clicked, it becomes the only selection (or deselected)
          newSelected = isCurrentlySelected ? [] : [size];
        } else {
          // If a standard size is clicked:
          if (isCurrentlySelected) {
            // Deselect it
            newSelected = prev.filter((s) => s !== size);
          } else {
            // Select it, but first clear Universal if it was selected
            newSelected = prev.includes(universalSize)
              ? [size] // Selecting a standard size overrides universal
              : [...prev, size];
          }
        }

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
                  // Disable standard sizes if universal is selected
                  disabled={
                    selectedSizes.includes(universalSize) &&
                    !selectedSizes.includes(size)
                  }
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

  const DesignSelectorField = () => {
    const designOptions: DesignOption[] = [
      {
        key: "ai",
        title: "AI Generated",
        subtitle: "Adobe Firefly designs",
        icon: <span className="text-xl font-bold text-purple-600">AI</span>,
      },
      {
        key: "letter",
        title: "Letter/Number",
        subtitle: "Manual creator tool",
        icon: <span className="text-xl font-bold text-blue-600">Aa</span>,
      },
      {
        key: "custom",
        title: "Custom Upload",
        subtitle: "User image upload",
        icon: (
          <Image src={uploadIcon} alt="Custom Upload" width={20} height={20} />
        ),
      },
    ];

    const [selectedDesigns, setSelectedDesigns] = useState<string[]>([
      "ai",
      "letter",
      "custom",
    ]);

    const handleDesignClick = (key: string) => {
      setSelectedDesigns((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    };

    return (
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Supported Design Options
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Select which design methods are available for this product
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {designOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => handleDesignClick(option.key)}
              className={`p-4 border rounded-xl text-left transition-all duration-200 ${
                selectedDesigns.includes(option.key)
                  ? "border-[#8b6f47] ring-2 ring-[#8B6F47] bg-[#8B6F47]/10"
                  : "border-gray-300 hover:border-gray-400 bg-white"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                  option.key === "ai"
                    ? "bg-purple-100 border-2 border-purple-200"
                    : option.key === "letter"
                    ? "bg-blue-100 border-2 border-blue-200"
                    : "bg-green-100 border-2 border-green-200"
                }`}
              >
                {option.icon}
              </div>
              <p className="font-semibold text-gray-800">{option.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{option.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const QualityAssuranceBox = () => (
    <div className="flex flex-col p-6 bg-[#ECF3FF] border border-[#BEDBFF] rounded-xl mt-6">
      <div className="flex items-center  mb-2">
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
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <button
              onClick={() => onViewChange("list")}
              className="p-3 bg-white rounded-xl border border-[#E8E3DC] hover:bg-gray-100 transition duration-200 text-gray-600"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <Title
                text=" Edit Product"
                paragraph=" Update product information and settings"
              />
            </div>
          </div>
          {/* The main change is here: flex-col on mobile, space-y-2 on mobile, no full-width on md/larger */}
          <div className="flex flex-col w-full space-y-2 md:flex-row md:space-x-4 md:space-y-0 md:w-auto">
            {/* Cancel Button - w-full on mobile (default) */}
            <button
              onClick={() => handleAction("cancel")}
              className="flex items-center justify-center w-full px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition duration-200 md:w-auto"
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </button>
            {/* Save Changes Button - w-full on mobile (default) */}
            <button
              onClick={() => handleAction("add")}
              className="flex items-center justify-center w-full px-6 py-2 bg-[#8B6F47] text-white font-semibold rounded-xl hover:bg-[#A08169] transition duration-200 shadow-md md:w-auto"
            >
              <Check className="w-4 h-4 mr-2" /> Save Changes
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
              {/* 🖼️ Main Image Display Area (Matches Screenshot Design) */}
              <div className="relative w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <div className="aspect-square relative">
                  <Image
                    src={productImage}
                    alt="Product Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
              {/* 🔗 Clickable Upload Prompt (Matches Screenshot Design) */}
              <div
                onClick={handleImageClick}
                className="flex items-start p-4 mt-6 gap-2 bg-white border border-blue-200 rounded-xl cursor-pointer hover:bg-gray-50 transition"
              >
                <Image
                  src={rightRoundedIcon}
                  alt="image"
                  height={20}
                  width={20}
                />
                <p className="text-sm text-gray-700  font-medium">
                  Click image to upload a new photo{" "}
                  <span className="text-gray-500 font-normal">
                    (max 5MB, 1200x1200px recommended)
                  </span>
                </p>
              </div>
              {/* 📥 Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
              />
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Current Stats
              </h3>

              <div className="space-y-5">
                <QuickStat
                  icon={dollerIcon.src} // Pass string source for Image type
                  label="Price"
                  value={product.price}
                  color="text-[#8B6F47]"
                  iconType="image" // Use 'image' type for local SVG/Image
                />

                <div className="h-px bg-gray-100 w-11/12 mx-auto" />

                <QuickStat
                  icon={stockIcon.src} // Pass string source for Image type
                  label="Stock"
                  value={`${product.stock} units`}
                  color="text-[#f6921e]"
                  iconType="image" // Use 'image' type for local SVG/Image
                />

                <div className="h-px bg-gray-100 w-11/12 mx-auto" />

                <QuickStat
                  icon={increamentIcon.src} // Pass string source for Image type
                  label="Total Sales"
                  value={`${product.sales} sold`}
                  color="text-[#00a86b]"
                  iconType="image" // Use 'image' type for local SVG/Image
                />
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
      <FooterAdmin />
    </>
  );
};

export default EditProduct;
