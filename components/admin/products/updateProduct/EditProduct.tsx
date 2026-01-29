"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { X, Check, ArrowLeftIcon } from "lucide-react";

// Local icons
import uploadIcon from "@/public/image/admin/products/upload.svg";
import rightRoundedIcon from "@/public/image/admin/products/rightBorderIcon.svg";
import qualityIcon from "@/public/image/admin/products/quality.svg";
import dollerIcon from "@/public/image/admin/products/doller.svg";
import increamentIcon from "@/public/image/admin/products/increamentArrow.svg";
import stockIcon from "@/public/image/admin/products/stock.svg";

// Components
import FooterAdmin from "@/components/admin/FooterAdmin";
import Title from "../../Title";
import { ViewChangeHandler } from "../Products";
import { toast } from "sonner";

// APIs
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
  UpdateProductRequest,
} from "@/app/store/slices/services/adminService/products/productsApi";
import {
  useGetAllCategoriesQuery,
  useGetAllSubCategoriesQuery,
  useGetAllClassificationsQuery,
  useGetAllAgeRangesQuery,
} from "@/app/store/slices/services/adminService/products/productMetadata";

// Card wrapper
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white p-6 md:p-8 mb-6 rounded-2xl border border-[#e8e3dc]">
    {children}
  </div>
);

// QuickStat Component
const QuickStat = ({
  icon,
  label,
  value,
  color,
  iconType = "icon",
}: {
  icon: React.ReactElement<{ className?: string }> | string;
  label: string;
  value: string;
  color: string;
  iconType?: "icon" | "text" | "image";
}) => (
  <div className="flex items-center space-x-3">
    <div className={`p-3 rounded-xl ${color.replace("text-", "bg-")}/20`}>
      {iconType === "text" ? (
        <span className={`${color} text-lg font-bold`}>{icon}</span>
      ) : iconType === "image" && typeof icon === "string" ? (
        <Image
          src={icon}
          alt={label}
          width={20}
          height={20}
          className="w-5 h-5"
        />
      ) : React.isValidElement(icon) ? (
        React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
          className: `w-5 h-5 ${color}`,
        })
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

// Input Field Component
interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  value?: string | number;
  onChange?: (e: any) => void;
  disabled?: boolean;
}

const InputField = ({
  label,
  placeholder,
  type = "text",
  required = true,
  options = [],
  value,
  onChange,
  disabled,
}: InputFieldProps) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    {type === "select" ? (
      <select
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 border border-[#E8E3DC] rounded-xl bg-gray-50 text-gray-600 focus:outline-none transition duration-200 appearance-none pr-10 disabled:opacity-50"
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
        className="w-full px-4 py-3 border border-[#E8E3DC] rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none transition duration-200 disabled:opacity-50"
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-[#E8E3DC] rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none transition duration-200 disabled:opacity-50"
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    )}
  </div>
);

// Selectors Interfaces
interface ColorSelectorFieldProps {
  label: string;
  description: string;
  colors: { value: string; label: string; hex: string }[];
  required?: boolean;
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
}

interface SizeSelectorFieldProps {
  label: string;
  description: string;
  required?: boolean;
  selectedSizes: string[];
  onSizeChange: (sizes: string[]) => void;
}

// Boolean select options
const booleanOptions = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

interface DesignOption {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

// --- Edit Product Screen ---
const EditProduct = ({
  productId,
  onViewChange,
}: {
  productId: number;
  onViewChange: ViewChangeHandler;
}) => {
  // 1. Fetch Product Data
  const { data: productResponse, isLoading: isFetching } = useGetSingleProductQuery(productId);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // 2. Fetch Metadata
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: subCategoriesData } = useGetAllSubCategoriesQuery();
  const { data: classificationsData } = useGetAllClassificationsQuery();
  const { data: ageRangesData } = useGetAllAgeRangesQuery();

  // 3. Metadata Options
  const categoryOptions =
    categoriesData?.map((cat) => ({ value: String(cat.id), label: cat.title })) || [];
  const subCategoryOptions =
    subCategoriesData?.map((sub) => ({ value: String(sub.id), label: sub.title })) || [];
  const classificationOptions =
    classificationsData?.map((cls) => ({ value: String(cls.id), label: cls.title })) || [];
  const ageGroupOptions =
    ageRangesData?.map((age) => ({
      value: String(age.id),
      label: `${age.start} - ${age.end}`,
    })) || [];

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

  // 4. Form State
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

    // Collections
    colors: [] as string[],
    sizes: [] as string[],
    designs: [] as string[],

    // Images
    existingImages: [] as { id: number; image: string }[],
    newImages: [] as File[],
  });

  // 5. Populate Form on Load
  useEffect(() => {
    if (productResponse?.data) {
      const p = productResponse.data;

      // Parse relations safely
      const catId = typeof p.category === 'object' ? p.category.id : p.category;
      const subId = typeof p.sub_category === 'object' ? p.sub_category.id : p.sub_category;
      const classId = typeof p.classification === 'object' ? p.classification.id : p.classification;
      const ageId = typeof p.age_range === 'object' ? p.age_range.id : p.age_range;

      // Parse Sizes
      let sizesList: string[] = [];
      if (p.cloth_size && !Array.isArray(p.cloth_size)) {
        sizesList = [...sizesList, ...Object.keys(p.cloth_size)];
      }
      if (p.kids_size && !Array.isArray(p.kids_size)) {
        sizesList = [...sizesList, ...Object.keys(p.kids_size)];
      }
      if (p.mug_size && !Array.isArray(p.mug_size)) {
        sizesList = [...sizesList, ...Object.keys(p.mug_size)];
      }

      // Parse Colors
      let colorsList: string[] = [];
      if (typeof p.colors === 'string') {
        colorsList = p.colors.split(',').map(c => c.trim()).filter(Boolean);
      } else if (Array.isArray(p.colors)) {
        colorsList = p.colors;
      }

      // Parse Designs
      const designsList: string[] = [];
      if (p.ai_gen) designsList.push('ai');
      if (p.ai_letter) designsList.push('letter');
      if (p.ai_upload) designsList.push('custom');

      // Images
      // Prioritize images_data > images array
      const currentImages = p.images_data ||
        (Array.isArray(p.images) && typeof p.images[0] === 'object'
          ? (p.images as { id: number; image: string }[])
          : []);

      setProductData({
        name: p.name || "",
        category: String(catId || ""),
        sub_category: String(subId || ""),
        classification: String(classId || ""),
        ageGroup: String(ageId || ""),
        description: p.description || "",
        price: p.price || "",
        discount_percentage: String(p.discount_percentage || 0),
        stock: String(p.stock_quantity || 0),
        sku: p.sku || "",

        is_universal_size: String(p.is_universal_size ?? false),
        ai_gen: String(p.ai_gen ?? false),
        ai_letter: String(p.ai_letter ?? false),
        ai_upload: String(p.ai_upload ?? false),
        is_customize: String(p.is_customize ?? false),
        is_active: String(p.is_active ?? true),

        colors: colorsList,
        sizes: sizesList,
        designs: designsList,

        existingImages: currentImages,
        newImages: [],
      });
    }
  }, [productResponse]);

  // 6. Action Handlers

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setProductData(prev => ({
        ...prev,
        newImages: [...prev.newImages, ...Array.from(files)]
      }));
    }
  };

  const handleAction = async (action: "cancel" | "add") => {
    if (action === "cancel") {
      onViewChange("list");
      return;
    }

    try {
      // Map back to request format
      const clothSizes: Record<string, number> = {};
      const kidsSizes: Record<string, number> = {};
      const mugSizes: Record<string, number> = {};

      productData.sizes.forEach((size) => {
        if (size.includes("kid") || size.includes("Y")) kidsSizes[size] = 1;
        else if (size.includes("mug") || size.includes("oz")) mugSizes[size] = 1;
        else clothSizes[size] = 1;
      });

      const payload: UpdateProductRequest = {
        name: productData.name,
        category: Number(productData.category),
        sub_category: Number(productData.sub_category),
        classification: Number(productData.classification),
        age_range: Number(productData.ageGroup),
        description: productData.description,
        price: Number(productData.price),
        discount_percentage: Number(productData.discount_percentage),
        stock_quantity: Number(productData.stock),
        sku: productData.sku,
        colors: productData.colors.join(","),

        is_universal_size: productData.is_universal_size === "true",
        ai_gen: productData.designs.includes('ai') || productData.ai_gen === 'true',
        ai_letter: productData.designs.includes('letter') || productData.ai_letter === 'true',
        ai_upload: productData.designs.includes('custom') || productData.ai_upload === 'true',
        is_customize: productData.is_customize === "true",
        is_active: productData.is_active === "true",

        images: productData.newImages, // Only new images are sent for upload

        cloth_size: Object.keys(clothSizes).length ? clothSizes : undefined,
        kids_size: Object.keys(kidsSizes).length ? kidsSizes : undefined,
        mug_size: Object.keys(mugSizes).length ? mugSizes : undefined,
      };

      await updateProduct({ id: productId, data: payload }).unwrap();
      toast.success("Product updated successfully!");
      onViewChange("list");

    } catch (err: any) {
      console.error("Update failed:", err);
      const msg = err?.data?.message || err?.message || "Failed to update product";
      toast.error(msg);
    }
  };

  // 7. Sub-components (Color, Size, Design)

  const ColorSelectorField = ({
    label,
    description,
    colors,
    required = true,
    selectedColors,
    onColorChange,
  }: ColorSelectorFieldProps) => (
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
            onClick={() => {
              const newColors = selectedColors.includes(color.value)
                ? selectedColors.filter(c => c !== color.value)
                : [...selectedColors, color.value];
              onColorChange(newColors);
            }}
            className={`flex items-center justify-start p-3 border rounded-xl transition-all duration-200 ${selectedColors.includes(color.value)
              ? "border-[#8B6F47] ring-2 ring-[#8B6F47]/50 bg-[#8B6F47]/10"
              : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
          >
            <span
              className={`w-6 h-6 rounded-full mr-3 border border-gray-200 shadow-sm flex items-center justify-center ${color.value === "white" ? "border-gray-400" : ""}`}
              style={{ backgroundColor: color.hex }}
            >
              {selectedColors.includes(color.value) && (
                <Check className={`w-4 h-4 ${["white", "yellow"].includes(color.value) ? "text-[#8B6F47]" : "text-white"}`} />
              )}
            </span>
            <span className={`font-medium ${selectedColors.includes(color.value) ? "text-[#8B6F47]" : "text-gray-700"}`}>
              {color.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const SizeSelectorField = ({
    label,
    description,
    required = true,
    selectedSizes,
    onSizeChange,
  }: SizeSelectorFieldProps) => {
    const sizeGroups = [
      { title: "Clothing Sizes", type: "clothing", sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] },
      { title: "Kids Sizes", type: "kids", sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"] },
      { title: "Mug Sizes", type: "mug", sizes: ["11oz", "15oz", "20oz"] },
    ];
    const universalSize = "One Size (Universal)";

    return (
      <div className="flex flex-col space-y-2">
        <label className="text-lg font-semibold text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <p className="text-sm text-gray-500 mb-4">{description}</p>

        {sizeGroups.map((group, idx) => (
          <div key={group.type}>
            <h4 className="text-base font-medium text-gray-700 mb-3 mt-4">{group.title}</h4>
            <div className="flex flex-wrap gap-3 mb-4">
              {group.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    const newSizes = selectedSizes.includes(size)
                      ? selectedSizes.filter(s => s !== size)
                      : [...selectedSizes.filter(s => s !== universalSize), size];
                    onSizeChange(newSizes);
                  }}
                  className={`px-4 py-2 border rounded-xl text-sm font-semibold transition-all duration-200 ${selectedSizes.includes(size)
                    ? "border-[#8B6F47] bg-[#8B6F47] text-white"
                    : "border-gray-300 text-gray-700 bg-white hover:border-gray-400"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => {
              // Universal toggles itself and clears others
              const newSizes = selectedSizes.includes(universalSize) ? [] : [universalSize];
              onSizeChange(newSizes);
            }}
            className={`px-6 py-2 border rounded-xl text-sm font-semibold transition-all duration-200 ${selectedSizes.includes(universalSize)
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
      { key: "ai", title: "AI Generated", subtitle: "Adobe Firefly designs", icon: <span className="text-xl font-bold text-purple-600">AI</span> },
      { key: "letter", title: "Letter/Number", subtitle: "Manual creator tool", icon: <span className="text-xl font-bold text-blue-600">Aa</span> },
      { key: "custom", title: "Custom Upload", subtitle: "User image upload", icon: <Image src={uploadIcon} alt="Custom Upload" width={20} height={20} /> },
    ];

    return (
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Supported Design Options</h3>
        <p className="text-sm text-gray-500 mb-4">Select which design methods are available</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {designOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => {
                const newDesigns = productData.designs.includes(option.key)
                  ? productData.designs.filter(k => k !== option.key)
                  : [...productData.designs, option.key];
                setProductData(prev => ({ ...prev, designs: newDesigns }));
              }}
              className={`p-4 border rounded-xl text-left transition-all duration-200 ${productData.designs.includes(option.key)
                ? "border-[#8b6f47] ring-2 ring-[#8B6F47] bg-[#8B6F47]/10"
                : "border-gray-300 hover:border-gray-400 bg-white"
                }`}
            >
              <div className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${option.key === "ai" ? "bg-purple-100 border-2 border-purple-200" :
                option.key === "letter" ? "bg-blue-100 border-2 border-blue-200" :
                  "bg-green-100 border-2 border-green-200"
                }`}>
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
      <div className="flex items-center mb-2">
        <Image src={qualityIcon} alt="quality" height={24} width={24} />
        <h4 className="text-lg font-semibold ml-3 text-gray-800">Quality Assurance</h4>
      </div>
      <p className="text-sm text-gray-700 mt-1">
        All products support <strong>300 DPI</strong> quality checks.
      </p>
    </div>
  );

  if (isFetching) {
    return <div className="p-8 text-center text-gray-500">Loading product data...</div>;
  }

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
              <Title text="Edit Product" paragraph="Update product information and settings" />
            </div>
          </div>
          <div className="flex flex-col w-full space-y-2 md:flex-row md:space-x-4 md:space-y-0 md:w-auto">
            <button
              onClick={() => handleAction("cancel")}
              className="flex items-center justify-center w-full px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition duration-200 md:w-auto"
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </button>
            <button
              onClick={() => handleAction("add")}
              className="flex items-center justify-center w-full px-6 py-2 bg-[#8B6F47] text-white font-semibold rounded-xl hover:bg-[#A08169] transition duration-200 shadow-md md:w-auto"
              disabled={isUpdating}
            >
              <Check className="w-4 h-4 mr-2" /> {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={(e) => e.preventDefault()}>

          {/* Left Column: Image & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h3>

              {/* Existing Images Display */}
              {productData.existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Current Images (Read-Only)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {productData.existingImages.map((img, idx) => (
                      <div key={img.id || idx} className="relative aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={img.image}
                          alt={`Existing ${idx}`}
                          fill
                          className="object-cover"
                          unoptimized // Use unoptimized if strictly external hosts
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New */}
              <div
                onClick={handleImageClick}
                className="flex items-start p-4 gap-2 bg-white border border-blue-200 rounded-xl cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="p-2 bg-blue-50 rounded-full">
                  <Image src={uploadIcon} alt="Upload" width={20} height={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Add New Images</p>
                  <p className="text-xs text-gray-400">Click to browse</p>
                </div>
              </div>

              {/* New Upload Previews */}
              {productData.newImages.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {productData.newImages.map((file, idx) => (
                    <div key={idx} className="relative w-16 h-16 border rounded bg-white">
                      <Image src={URL.createObjectURL(file)} alt="new preview" fill className="object-cover rounded" />
                    </div>
                  ))}
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                multiple
              />
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-5">
                <QuickStat icon={dollerIcon.src} label="Price" value={`€${productData.price}`} color="text-[#8B6F47]" iconType="image" />
                <div className="h-px bg-gray-100 w-11/12 mx-auto" />
                <QuickStat icon={stockIcon.src} label="Stock" value={`${productData.stock} units`} color="text-[#f6921e]" iconType="image" />
                <div className="h-px bg-gray-100 w-11/12 mx-auto" />
                <QuickStat icon={increamentIcon.src} label="Sales" value={`${productResponse?.data.total_sold ?? 0} sold`} color="text-[#00a86b]" iconType="image" />
              </div>
            </Card>
          </div>

          {/* Right Column: Product Info */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Basic Information</h3>
              <div className="space-y-6">
                <InputField
                  label="Product Name"
                  placeholder="e.g., Premium Custom T-Shirt"
                  required
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    label="Category"
                    placeholder="Select category"
                    type="select"
                    required
                    options={categoryOptions}
                    value={productData.category}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                  />
                  <InputField
                    label="Sub Category"
                    placeholder="Select sub-category"
                    type="select"
                    required
                    options={subCategoryOptions}
                    value={productData.sub_category}
                    onChange={(e) => setProductData({ ...productData, sub_category: e.target.value })}
                  />
                  <InputField
                    label="Classification"
                    placeholder="Select classification"
                    type="select"
                    required
                    options={classificationOptions}
                    value={productData.classification}
                    onChange={(e) => setProductData({ ...productData, classification: e.target.value })}
                  />
                  <InputField
                    label="Age Group"
                    placeholder="Select age group"
                    type="select"
                    required
                    options={ageGroupOptions}
                    value={productData.ageGroup}
                    onChange={(e) => setProductData({ ...productData, ageGroup: e.target.value })}
                  />
                </div>

                <InputField
                  label="Product Description"
                  placeholder="Describe your product..."
                  type="textarea"
                  required
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <InputField
                  label="Price (USD)"
                  placeholder="99.00"
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                />
                <InputField
                  label="Stock Quantity"
                  placeholder="100"
                  type="number"
                  value={productData.stock}
                  onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                />
                <InputField
                  label="SKU"
                  placeholder="TSHIRT-BLK-L"
                  required={false}
                  value={productData.sku}
                  onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
                />
                <InputField
                  label="Discount %"
                  type="number"
                  placeholder="0"
                  value={productData.discount_percentage}
                  onChange={(e) => setProductData({ ...productData, discount_percentage: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <InputField
                  label="Is Active"
                  type="select"
                  options={booleanOptions}
                  value={productData.is_active}
                  onChange={(e) => setProductData({ ...productData, is_active: e.target.value })}
                  placeholder=""
                />
                <InputField
                  label="Customizable"
                  type="select"
                  options={booleanOptions}
                  value={productData.is_customize}
                  onChange={(e) => setProductData({ ...productData, is_customize: e.target.value })}
                  placeholder=""
                />
                <InputField
                  label="Universal Size"
                  type="select"
                  options={booleanOptions}
                  value={productData.is_universal_size}
                  onChange={(e) => setProductData({ ...productData, is_universal_size: e.target.value })}
                  placeholder=""
                />
              </div>
            </Card>

            <Card>
              <ColorSelectorField
                label="Available Colors"
                description="Select all colors available"
                colors={availableColors}
                required
                selectedColors={productData.colors}
                onColorChange={(colors) => setProductData({ ...productData, colors })}
              />
            </Card>
            <Card>
              <SizeSelectorField
                label="Available Sizes"
                description="Select all sizes available"
                required
                selectedSizes={productData.sizes}
                onSizeChange={(sizes) => setProductData({ ...productData, sizes })}
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

