"use client";

import React, { useState } from "react";
import { ArrowLeftIcon, Edit, Trash2, Box, ShoppingCart } from "lucide-react";
import Image from "next/image";
import productImage from "@/public/image/admin/products/productImage.jpg";
import calanderIcon from "@/public/image/admin/products/calanderIcon.svg";
import crossIcon from "@/public/image/admin/products/crossIcon.svg";
import { useGetSingleProductQuery } from "@/app/store/slices/services/adminService/products/productsApi";
import { ViewChangeHandler } from "./products/Products";
import { ProductImage } from "@/app/utils/types/productTypes";
import Card from "@/app/utils/shared/Card";
import {
  useGetAllCategoriesQuery,
  useGetAllSubCategoriesQuery,
  useGetAllClassificationsQuery,
  useGetAllAgeRangesQuery,
} from "@/app/store/slices/services/adminService/products/productMetadata";
import { getColorValue, isLightColor } from "@/app/utils/colorUtils";

const StatusBadge = ({ active }: { active: boolean }) => (
  <span
    className={`px-4 py-2 flex items-center gap-1 rounded-xl text-xs font-semibold ${active ? "bg-[#dcfce7] text-[#008236]" : "bg-[#fde2e8] text-[#9b002c]"
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
      className={`text-xs mt-1 ${change.startsWith("+") ? "text-green-600" : change.startsWith("-") ? "text-red-600" : "text-gray-500"
        }`}
    >
      {change}
    </span>
  </div>
);

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
  console.log(data, "single prod info")

  const { data: categories } = useGetAllCategoriesQuery();
  const { data: subCategories } = useGetAllSubCategoriesQuery();
  const { data: classifications } = useGetAllClassificationsQuery();
  const { data: ageRanges } = useGetAllAgeRangesQuery();

  if (isLoading) return <div className="p-8">Loading product details…</div>;

  const rawApiProduct = data?.data;
  if (!rawApiProduct) return <div className="p-8 text-red-500">Product data not available.</div>;

  // --- Helper to resolve ID to Title ---
  const getCategoryTitle = (val: number | { title: string } | undefined) => {
    if (typeof val === "object" && val?.title) return val.title;
    if (typeof val === "number") return categories?.find((c) => c.id === val)?.title;
    return "Not available";
  };
  const getSubCategoryTitle = (val: number | { title: string } | undefined) => {
    if (typeof val === "object" && val?.title) return val.title;
    if (typeof val === "number") return subCategories?.find((c) => c.id === val)?.title;
    return "Not available";
  };
  const getClassificationTitle = (val: number | { title: string } | undefined) => {
    if (typeof val === "object" && val?.title) return val.title;
    if (typeof val === "number") return classifications?.find((c) => c.id === val)?.title;
    return "Not available";
  };
  const getAgeRangeLabel = (val: number | { start: number; end: number } | undefined) => {
    if (typeof val === "object" && val !== null && "start" in val) return `${val.start}-${val.end}`;
    if (typeof val === "number") {
      const found = ageRanges?.find((a) => a.id === val);
      return found ? `${found.start}-${found.end}` : "Not available";
    }
    return "Not available";
  };


  // --- Normalize Images ---
  // The API might return `images` (strings or objs) OR `images_data` (objs)
  const sourceImages = rawApiProduct.images_data || rawApiProduct.images || [];
  const images: ProductImage[] = Array.isArray(sourceImages)
    ? sourceImages
      .map((img: string | { id?: number; image: string }, idx: number): ProductImage | null => {
        if (typeof img === "string" && img.trim()) return { id: idx, image: img };
        if (typeof img === "object" && img?.image) return { id: img.id || idx, image: img.image };
        return null;
      })
      .filter((img): img is ProductImage => img !== null)
    : [];

  // --- Normalize Sizes ---
  // Can be string[] OR object { XS: 1, L: 1 }
  const normalizeSizes = (sizes: unknown): string[] => {
    if (Array.isArray(sizes)) return sizes;
    if (typeof sizes === "object" && sizes !== null) return Object.keys(sizes);
    return [];
  };

  const resolvedClothSizes = normalizeSizes(rawApiProduct.cloth_size);
  const resolvedKidsSizes = normalizeSizes(rawApiProduct.kids_size);
  const resolvedMugSizes = normalizeSizes(rawApiProduct.mug_size);
  const allSizes = [...resolvedClothSizes, ...resolvedKidsSizes, ...resolvedMugSizes];

  // --- Normalize Colors ---
  // "colors": ["black,white"] or ["black", "white"] or "black,white"
  let resolvedColors: string[] = [];
  if (Array.isArray(rawApiProduct.colors)) {
    rawApiProduct.colors.forEach(c => {
      if (typeof c === "string") {
        if (c.includes(",")) {
          resolvedColors.push(...c.split(","));
        } else {
          resolvedColors.push(c);
        }
      }
    });
  } else if (typeof rawApiProduct.colors === "string") {
    resolvedColors = (rawApiProduct.colors as string).split(",");
  }

  // Construct display object
  const p = {
    ...rawApiProduct,
    categoryTitle: getCategoryTitle(rawApiProduct.category),
    subCategoryTitle: getSubCategoryTitle(rawApiProduct.sub_category),
    classificationTitle: getClassificationTitle(rawApiProduct.classification),
    ageRangeLabel: getAgeRangeLabel(rawApiProduct.age_range),
    colors: resolvedColors,
  };

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
                        className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 ${index === selectedImageIndex ? "border-[#8B6F47]" : "border-transparent"
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
                <span className="text-sm font-semibold">{p.categoryTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Sub Category</span>
                <span className="text-sm font-semibold">{p.subCategoryTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Classification</span>
                <span className="text-sm font-semibold">{p.classificationTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Age Group</span>
                <span className="text-sm font-semibold">{p.ageRangeLabel}</span>
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
              {p.colors && p.colors.length > 0 ? (
                p.colors.map((color, idx) => {
                  const colorValue = getColorValue(color);
                  const lightColor = isLightColor(color);
                  return (
                    <div key={idx} className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-white shadow-sm">
                      <div
                        className={`w-5 h-5 rounded-full border ${lightColor ? "border-gray-300" : "border-transparent"}`}
                        style={{ backgroundColor: colorValue }}
                      />
                      <span className="capitalize text-sm font-medium text-gray-700">{color}</span>
                    </div>
                  );
                })
              ) : (
                <p>Not available</p>
              )}
            </div>

            {/* AI Integration Flags */}
            <h2 className="text-lg font-semibold mt-6">Product Attributes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${p.ai_gen ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">AI Generated</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${p.ai_letter ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">AI Letter</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${p.ai_upload ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">AI Upload</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${p.is_customize ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">Customizable</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${p.is_universal_size ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">Universal Size</span>
              </div>
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
