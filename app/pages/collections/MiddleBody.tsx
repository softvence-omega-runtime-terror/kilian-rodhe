"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Jost, Cormorant_Garamond } from "next/font/google";
import Image, { StaticImageData } from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProductsQuery, ICategory, useSaveProductMutation } from "@/app/store/slices/services/product/productApi";
import { useAddToCartMutation } from "@/app/store/slices/services/order/orderApi";
import { useAppSelector } from "@/app/store/hooks";
import { selectIsAuthenticated } from "@/app/store/slices/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../../components/Loader";
import EmptyState from "../../../components/EmptyState";

// Images (Ensure you have a checkmark icon or use an SVG/Unicode character)
// import hoodi from "@/public/image/collections/imag1.jpg";
// import cap from "@/public/image/collections/imag2.jpg";
// import hoodi2 from "@/public/image/collections/image.jpg";
// import tshirt from "@/public/image/collections/image4.jpg";

// import cap2 from "@/public/image/collections/img4.jpg";
// import hoodi3 from "@/public/image/collections/img5.jpg";
// import tshirt2 from "@/public/image/collections/img7.jpg";

import shop from "@/public/image/collections/shop.svg";
import heart from "@/public/image/collections/heartIcon.svg";

// ----------------------------------------------------------------------
// Fonts (Unchanged)
// ----------------------------------------------------------------------

const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic"],
});

const cormorantNormal = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

// ----------------------------------------------------------------------
// Product Type & Data Definitions (UPDATED)
// ----------------------------------------------------------------------

type AgeGroupKey = "18-25" | "26-35" | "36-50" | "50+";

export type Product = {
  id: number;
  imageSrc: string | StaticImageData;
  isBestSeller?: boolean;
  isNew?: boolean;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  priceValue: number;
  colors: string[];
  suitableAge: AgeGroupKey[] | string[];
};

// Helper to extract numerical price
// const getPriceValue = (price: string) => parseFloat(price.replace(/[^0-9.]/g, ''));

// Static data removed in favor of API
// const PRODUCTS_PER_PAGE = 8;

// ----------------------------------------------------------------------
// Filters (Unchanged)
// ----------------------------------------------------------------------
// const ageGroups = ["ALL", "18-25", "26-35", "36-50", "50+"];
// const productTypes = ["T-SHIRTS", "HOODIES", "CAPS", "MUGS"];
const priceRanges = [
  { name: "Under €25", min: 0, max: 25 },
  { name: "€25 - €50", min: 25, max: 50 },
  { name: "€50 - €75", min: 50, max: 75 },
  { name: "Over €75", min: 75, max: Infinity },
];
const filterColors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF", border: true },
  { name: "Gray", hex: "#6B7280" },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Yellow", hex: "#DFA637" },
];

type SortOption = 'Featured' | 'Price: Low to High' | 'Price: High to Low';

// ----------------------------------------------------------------------
// Color Swatch Component (Unchanged)
// ----------------------------------------------------------------------
type ColorSwatchProps = {
  hex: string;
  isWhite?: boolean;
};

const ColorSwatch: React.FC<ColorSwatchProps> = React.memo(({ hex, isWhite }) => (
  <div
    className={`w-4 h-4 mr-2 ${isWhite ? "border border-gray-300" : "border-none"
      }`}
    style={{
      backgroundColor: hex,
      outline: isWhite ? "1px solid #00000010" : "none",
    }}
  ></div>
));
ColorSwatch.displayName = 'ColorSwatch';


const ToastMessage = ({ message, type, onClose }: { message: string; type: 'success' | 'info' | 'error'; onClose: () => void }) => {
  useState(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  });

  let bgColor = "bg-green-600";
  let icon = "✅";

  if (type === 'info') {
    bgColor = "bg-blue-600";
    icon = "ℹ️";
  } else if (type === 'error') {
    bgColor = "bg-red-600";
    icon = "⚠️";
  }

  return (
    <motion.div
      className={`${jostFont.className} fixed top-24 right-4 ${bgColor} text-white px-6 py-4 rounded shadow-2xl z-[100] text-center font-medium flex items-center gap-3`}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.4, type: "spring" }}
    >
      <span className="text-xl">{icon}</span>
      <span>{message}</span>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// Product Card (UPDATED with route handlers)
// ----------------------------------------------------------------------

type ProductCardProps = {
  product: Product;
  handleOrderNow: (product: Product) => void;
  handleAddToCart: (product: Product) => void;
  handleCustomizeRoute: (id: number) => void;
  onSaveProduct: (message: string, type: 'success' | 'info' | 'error') => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, handleOrderNow, handleAddToCart, handleCustomizeRoute, onSaveProduct }) => {
  const {
    title,
    subtitle,
    description,
    price,
    colors,
    isBestSeller,
    isNew,
    imageSrc,
  } = product;

  const imageUrl = typeof imageSrc === "string" ? imageSrc : imageSrc.src;
  const isDarkImage = false; // logic removed

  const badgeColor = "bg-[#DFA637] text-black";
  const iconButtonColor = "bg-[#DFA637] text-black hover:bg-[#c99532]";

  const [saveProduct] = useSaveProductMutation();

  const handleAction = async (action: string) => {
    console.log(`${action} for Product ID: ${product.id}`);

    if (action === "Order Now") {
      handleOrderNow(product);
    } else if (action === "Quick Shop") {
      handleAddToCart(product);
    } else if (action === "Customize") {
      handleCustomizeRoute(product.id);
    } else if (action === "Wishlist") {
      try {
        const response = await saveProduct({ product: product.id }).unwrap();
        onSaveProduct(response.message || "Product saved successfully!", 'success');
      } catch (err: unknown) {
        const errorData = (err as { data?: { message?: string } })?.data;
        if (errorData?.message === "Product already saved") {
          onSaveProduct("Product is already saved!", 'info');
        } else {
          onSaveProduct("Unauthorized: Please login to save products.", 'error');
        }
      }
    } else {
      console.log(`${action} clicked for ${subtitle}!`);
    }
  };

  return (
    <div className="flex flex-col border-none">
      <div className="relative overflow-hidden">
        <div
          className="w-full h-[400px] bg-cover bg-center flex items-center justify-center relative"
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
            backgroundColor: imageUrl ? (isDarkImage ? "#000" : "#FFF") : "#F3F4F6",
          }}
        >
          {!imageUrl && (
            <span className="text-gray-400 font-medium">No Image</span>
          )}
          {(isBestSeller || isNew) && (
            <div
              className={`${jostFont.className} absolute top-3 left-3 text-xs font-medium px-3 py-1 tracking-widest uppercase ${badgeColor}`}
            >
              {isBestSeller ? "Best Seller" : "New"}
            </div>
          )}

          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              className={`${iconButtonColor} p-2 shadow-sm transition`}
              onClick={() => handleAction("Wishlist")}
            >
              <Image src={heart} alt="Add to Wishlist" className="h-4 w-4" />
            </button>
            <button
              className={`${iconButtonColor} p-2 shadow-sm transition`}
              onClick={() => handleAction("Quick Shop")}
            >
              <Image src={shop} alt="Quick Shop" className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute bottom-0 w-full px-8 mb-4">
            <button
              className={`${cormorantNormal.className} w-full py-3 text-sm font-semibold tracking-widest flex justify-center items-center border border-white text-white bg-black/50 hover:bg-black/80 transition`}
              onClick={() => handleAction("Customize")} // 👈 Calls handleAction -> handleCustomizeRoute()
            >
              CUSTOMIZE →
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p
          className={`${jostFont.className} text-xs tracking-[.25em] text-gray-500 mb-1`}
        >
          {title}
        </p>

        <h3
          className={`${cormorantNormal.className} text-xl font-semibold tracking-tight mb-1`}
        >
          {subtitle}
        </h3>

        <p
          className={`${cormorantItalic.className} text-sm text-gray-600 mb-2 leading-snug px-4`}
        >
          {description}
        </p>

        <p className={`${cormorantNormal.className} text-lg font-bold mb-4`}>
          {price}
        </p>

        <div className="flex justify-center mb-6">
          {colors.map((hex, index) => (
            <ColorSwatch key={index} hex={hex} isWhite={hex === "#FFFFFF"} />
          ))}
        </div>

        <button
          className={`${jostFont.className} w-4/5 py-3 bg-[#DFA637] text-black font-semibold text-sm hover:bg-yellow-700 transition tracking-widest uppercase`}
          onClick={() => handleAction("Order Now")} // 👈 Calls handleAction -> handleOrderNow()
        >
          ORDER NOW
        </button>
      </div>
    </div>
  );
});
ProductCard.displayName = 'ProductCard';

// ----------------------------------------------------------------------
// GDPR Banner & Pagination Components (Unchanged)
// ----------------------------------------------------------------------

const GdpComplianceBanner = React.memo(() => (
  <div className="w-full bg-[#fcf8f0] py-2 mt-4 mb-8">
    <p className="text-center text-xs text-gray-600 flex justify-center items-center">
      <span className="mr-2 text-lg">🔒</span>
      Age group selection is for product filtering only. No personal data is
      collected or stored. GDPR compliant.
    </p>
  </div>
));
GdpComplianceBanner.displayName = 'GdpComplianceBanner';


type PaginationProps = {
  totalProducts: number;
  displayedCount: number;
  onLoadMore: () => void;
  canLoadMore: boolean;
}

const Pagination: React.FC<PaginationProps> = React.memo(
  ({ totalProducts, displayedCount, onLoadMore, canLoadMore }) => {

    return (
      <div className="flex flex-col items-center py-12">
        <div className="w-16 border-t border-[#DFA637] mb-8"></div>

        <button
          className={`${jostFont.className} mb-4 px-12 py-3 border border-gray-900 text-gray-900 font-medium tracking-widest flex items-center transition 
            ${canLoadMore ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'}`}
          onClick={onLoadMore}
          disabled={!canLoadMore}
        >
          LOAD MORE PRODUCTS
          <svg
            className="ml-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <p className={`${jostFont.className} text-base text-gray-700`}>
          Showing {displayedCount} of {totalProducts} products
        </p>
      </div>
    );
  }
);
Pagination.displayName = 'Pagination';

// ----------------------------------------------------------------------
// Main Component (UPDATED with route handlers)
// ----------------------------------------------------------------------



// ... constants

interface MiddleBodyProps {
  currentCategory?: ICategory;
}

export default function ShopPage({ currentCategory }: MiddleBodyProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const categoryParam = searchParams.get("category");
  const subCategoryParam = searchParams.get("subcategory");
  const ageRangeParam = searchParams.get("age_range");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState<number | "ALL">("ALL"); // Store ID
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(subCategoryParam ? parseInt(subCategoryParam) : null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<typeof priceRanges[number] | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('Featured');

  // Dynamic Age Groups
  const ageGroups = useMemo(() => {
    if (!currentCategory?.age_range) return [];
    return currentCategory.age_range.map(age => ({
      id: age.id,
      label: `${age.start}-${age.end}`
    }));
  }, [currentCategory]);

  // Sync selected age group with URL param only on mount/change? 
  // User says "when click specific age group fetch with that agegroup id".
  // Note: searchParams for age_range might be present from URL.
  // Ideally, valid selectedAgeGroupId should be from params if present.

  // Update state from params if needed, or simply use params in query and use state for UI selection.
  // Actually, keeping them in sync is best.
  // For now, let's prioritize local interaction updating the query.

  // API Query
  const { data: productsData, isLoading } = useGetProductsQuery({
    page: currentPage,
    category: categoryParam ? parseInt(categoryParam) : undefined,
    subcategory: selectedSubCategoryId || (subCategoryParam ? parseInt(subCategoryParam) : undefined),
    age_range: selectedAgeGroupId !== "ALL" ? selectedAgeGroupId : (ageRangeParam ? parseInt(ageRangeParam) : undefined),
    min_price: selectedPriceRange?.min,
    max_price: selectedPriceRange?.max === Infinity ? undefined : selectedPriceRange?.max,
    color: selectedColors.length > 0 ? selectedColors[0] : undefined,
  });

  const productsToDisplay: Product[] = useMemo(() => {
    if (!Array.isArray(productsData?.results?.categories)) return [];

    // Map API data to UI Product type
    const mapped = productsData.results.categories.map((p) => ({
      id: p.id,
      imageSrc: p.images[0]?.image || "",
      isBestSeller: false,
      isNew: false,
      title: p.category?.title || "Product",
      subtitle: p.name,
      description: p.description,
      price: `$${p.discounted_price || p.price}`,
      priceValue: p.discounted_price || parseFloat(p.price),
      colors: [p.color_code],
      suitableAge: p.age_range ? [`${p.age_range.start}-${p.age_range.end}`] : [],
    }));

    // Client-side Sorting
    if (sortOption === 'Price: Low to High') {
      return mapped.sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortOption === 'Price: High to Low') {
      return mapped.sort((a, b) => b.priceValue - a.priceValue);
    }

    return mapped;
  }, [productsData, sortOption]);

  // Handlers
  const handleFilterChange = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // ... (Action handlers same)
  const [addToCart] = useAddToCartMutation();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleOrderNow = useCallback(async (product: Product) => {
    if (!isAuthenticated) {
      setToast({ message: "Unauthorized: Please login to order products.", type: 'error' });
      return;
    }
    try {
      await addToCart({ product: product.id, quantity: 1 }).unwrap();
      router.push(`/pages/checkout`);
    } catch (error) {
      console.error("Failed to add to cart", error);
      setToast({ message: "Failed to add to cart. Please try again.", type: 'error' });
    }
  }, [router, addToCart, isAuthenticated]);

  const handleAddToCart = useCallback(async (product: Product) => {
    if (!isAuthenticated) {
      setToast({ message: "Unauthorized: Please login to add to cart.", type: 'error' });
      return;
    }
    try {
      await addToCart({ product: product.id, quantity: 1 }).unwrap();
      setToast({ message: "Added to cart successfully!", type: 'success' });
    } catch (error) {
      console.error("Failed to add to cart", error);
      setToast({ message: "Failed to add to cart. Please try again.", type: 'error' });
    }
  }, [addToCart, isAuthenticated]);

  const handleCustomizeRoute = useCallback((id: number) => {
    router.push(`/pages/customise?id=${id}`);
  }, [router]);

  const totalFilteredProducts = Array.isArray(productsData?.results?.categories) ? productsData.results.categories.length : 0;
  const canLoadMore = false;

  const handleLoadMore = useCallback(() => {
    setCurrentPage(prevPage => prevPage + 1);
  }, []);

  const handleAgeGroupSelect = useCallback((id: number | "ALL") => {
    setSelectedAgeGroupId(id);
    handleFilterChange();
  }, [handleFilterChange]);

  // ... (Other handlers same)
  const handleSubCategorySelect = useCallback((id: number) => {
    setSelectedSubCategoryId(prevId => prevId === id ? null : id);
    handleFilterChange();
  }, [handleFilterChange]);

  const handlePriceRangeSelect = useCallback((range: typeof priceRanges[number]) => {
    setSelectedPriceRange(prevRange => prevRange?.name === range.name ? null : range);
    handleFilterChange();
  }, [handleFilterChange]);

  const handleColorSelect = useCallback((hex: string) => {
    setSelectedColors(prevColors => {
      const isSelected = prevColors.includes(hex);
      const newColors = isSelected
        ? prevColors.filter(c => c !== hex)
        : [...prevColors, hex];
      handleFilterChange();
      return newColors;
    });
  }, [handleFilterChange]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
    handleFilterChange();
  }, [handleFilterChange]);

  const handleFilterPanelToggle = () => {
    // alert("Filter panel toggle clicked! (Placeholder)");
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  return (
    <div className={`bg-white ${jostFont.className}`}>
      <AnimatePresence>
        {toast && (
          <ToastMessage message={toast.message} type={toast.type} onClose={handleCloseToast} />
        )}
      </AnimatePresence>
      <div className="px-4 sm:px-6 lg:px-18 pt-6">
        {/* Age Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-300/60">
          <div className="flex flex-wrap items-center space-x-2 text-sm mb-4 sm:mb-0">
            <span className="font-medium text-gray-700 tracking-wide mr-2 whitespace-nowrap">
              AGE GROUP:
            </span>
            <span
              className={`px-3 py-1.5 cursor-pointer text-sm border font-medium transition mt-2 sm:mt-0 ${selectedAgeGroupId === "ALL"
                ? "bg-[#DFA637] text-black border-[#DFA637]"
                : "text-gray-700 border-gray-300 hover:border-gray-500"
                }`}
              onClick={() => handleAgeGroupSelect("ALL")}
            >
              ALL
            </span>
            {ageGroups.map((group) => (
              <span
                key={group.id}
                className={`px-3 py-1.5 cursor-pointer text-sm border font-medium transition mt-2 sm:mt-0 ${group.id === selectedAgeGroupId
                  ? "bg-[#DFA637] text-black border-[#DFA637]"
                  : "text-gray-700 border-gray-300 hover:border-gray-500"
                  }`}
                onClick={() => handleAgeGroupSelect(group.id)}
              >
                {group.label}
              </span>
            ))}
          </div>

          {/* Filters Right (Unchanged) */}
          <div className="flex items-center space-x-4 text-sm text-gray-700">
            {/* ... unchanged ... */}
            <div
              className="flex items-center space-x-1 cursor-pointer hover:text-black"
              onClick={handleFilterPanelToggle}
            >
              <span className="text-xl">&#9776;</span>
              <span className="font-semibold tracking-wider">FILTERS</span>
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-white py-2 pl-4 pr-8 border border-gray-300/40 focus:outline-none cursor-pointer text-sm"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Product Type, Price, Colors (Unchanged) */}
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-start pt-6 pb-4">
          {/* Product Type */}
          <div className="w-full sm:w-1/4 mb-6 sm:mb-0">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 tracking-wider">
              SUB CATEGORY
            </h3>
            <ul className="space-y-1 text-sm tracking-wide text-gray-800">
              {productsData?.results?.sub_categories?.map((sub) => (
                <li
                  key={sub.id}
                  className={`cursor-pointer transition ${selectedSubCategoryId === sub.id ? 'text-black font-bold' : 'hover:text-black'
                    }`}
                  onClick={() => handleSubCategorySelect(sub.id)}
                >
                  {sub.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="w-full sm:w-1/4 mb-6 sm:mb-0">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 tracking-wider">
              PRICE RANGE
            </h3>
            <ul className="space-y-1 text-sm tracking-wide text-gray-800">
              {priceRanges.map((range) => (
                <li
                  key={range.name}
                  className={`cursor-pointer transition ${selectedPriceRange?.name === range.name ? 'text-black font-bold' : 'hover:text-black'
                    }`}
                  onClick={() => handlePriceRangeSelect(range)}
                >
                  {range.name}
                </li>
              ))}
            </ul>
          </div>

          {/* COLORS (Unchanged) */}
          <div className="w-full sm:w-1/4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 tracking-wider">
              COLORS
            </h3>
            <div className="flex space-x-2">
              {filterColors.map((color) => {
                const isSelected = selectedColors.includes(color.hex);
                const borderColor = color.border ? "border-gray-300" : "border-transparent";

                return (
                  <div
                    key={color.name}
                    className={`w-6 h-6 border-2 ${isSelected ? "border-transparent" : borderColor
                      } cursor-pointer hover:opacity-80 transition relative flex items-center justify-center`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    onClick={() => handleColorSelect(color.hex)}
                  >
                    {/* Checkmark icon on selection */}
                    {isSelected && (
                      <svg
                        className={`h-4 w-4 ${color.hex === "#FFFFFF" || color.hex === "#DFA637" ? 'text-black' : 'text-white'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <GdpComplianceBanner />

      {/* Product Grid */}
      <div className="px-4 sm:px-6 lg:px-18">
        {productsData && productsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {productsToDisplay.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                handleOrderNow={handleOrderNow}
                handleAddToCart={handleAddToCart}
                handleCustomizeRoute={handleCustomizeRoute}
                onSaveProduct={(msg, type) => setToast({ message: msg, type })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-600">
            {isLoading ? (
              <Loader text="Loading products..." />
            ) : (
              <EmptyState message="No products found matching your criteria." />
            )}
          </div>
        )}
      </div>

      {/* Pagination (Unchanged) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Pagination
          totalProducts={totalFilteredProducts}
          displayedCount={productsToDisplay.length}
          onLoadMore={handleLoadMore}
          canLoadMore={canLoadMore}
        />
      </div>
    </div>
  );
}