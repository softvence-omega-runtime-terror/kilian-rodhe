"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Jost, Cormorant_Garamond } from "next/font/google";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation"; // 👈 IMPORTED

// Images (Ensure you have a checkmark icon or use an SVG/Unicode character)
import hoodi from "@/public/image/collections/imag1.jpg";
import cap from "@/public/image/collections/imag2.jpg";
import hoodi2 from "@/public/image/collections/image.jpg";
import tshirt from "@/public/image/collections/image4.jpg";

import cap2 from "@/public/image/collections/img4.jpg";
import hoodi3 from "@/public/image/collections/img5.jpg";
import tshirt2 from "@/public/image/collections/img7.jpg";

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
// Product Type & Data Definitions (Unchanged)
// ----------------------------------------------------------------------

type AgeGroupKey = "18-25" | "26-35" | "36-50" | "50+";

type Product = {
  id: number;
  imageSrc: StaticImageData;
  isBestSeller?: boolean;
  isNew?: boolean;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  priceValue: number;
  colors: string[];
  suitableAge: AgeGroupKey[]; 
};

// Helper to extract numerical price
const getPriceValue = (price: string) => parseFloat(price.replace(/[^0-9.]/g, ''));

const baseProducts: Omit<Product, 'id' | 'priceValue'>[] = [
  // ... (Your baseProducts array remains the same)
  {
    imageSrc: tshirt,
    isBestSeller: true,
    title: "T-SHIRTS",
    subtitle: "Premium Cotton T-Shirt",
    description: "Luxurious 100% premium cotton with superior comfort",
    price: "$29.99",
    colors: ["#FFFFFF", "#000000", "#2563EB", "#7C7C7C"],
    suitableAge: ["18-25", "26-35"], 
  },
  {
    imageSrc: hoodi,
    isNew: true,
    title: "HOODIES",
    subtitle: "Designer Hoodie",
    description: "Premium fleece blend with kangaroo pocket",
    price: "$54.99",
    colors: ["#000000", "#FFFFFF", "#9B0000", "#2563EB"],
    suitableAge: ["18-25", "36-50"], 
  },
  {
    imageSrc: cap,
    title: "CAPS",
    subtitle: "Classic Baseball Cap",
    description: "Adjustable fit with premium embroidery quality",
    price: "$24.99",
    colors: ["#000000", "#FFFFFF", "#2563EB", "#7C7C7C"],
    suitableAge: ["18-25", "26-35", "50+"], 
  },
  {
    imageSrc: hoodi2,
    isBestSeller: true,
    title: "HOODIES",
    subtitle: "Designer Hoodie",
    description: "Premium fleece blend with kangaroo pocket",
    price: "$54.99",
    colors: ["#FFFFFF", "#000000", "#7C7C7C", "#9B0000"],
    suitableAge: ["26-35", "36-50", "50+"], 
  },

  {
    imageSrc: tshirt2,
    isBestSeller: true,
    title: "T-SHIRTS",
    subtitle: "Premium Cotton T-Shirt",
    description: "Luxurious 100% premium cotton with superior comfort",
    price: "$29.99",
    colors: ["#FFFFFF", "#000000", "#2563EB", "#7C7C7C"],
    suitableAge: ["18-25", "26-35"], 
  },
  {
    imageSrc: hoodi2,
    isNew: true,
    title: "HOODIES",
    subtitle: "Designer Hoodie",
    description: "Premium fleece blend with kangaroo pocket",
    price: "$54.99",
    colors: ["#000000", "#FFFFFF", "#9B0000", "#2563EB"],
    suitableAge: ["18-25", "36-50"], 
  },
  {
    imageSrc: cap2,
    title: "CAPS",
    subtitle: "Classic Baseball Cap",
    description: "Adjustable fit with premium embroidery quality",
    price: "$24.99",
    colors: ["#000000", "#FFFFFF", "#2563EB", "#7C7C7C"],
    suitableAge: ["18-25", "26-35", "50+"], 
  },
  {
    imageSrc: hoodi3,
    isBestSeller: true,
    title: "HOODIES",
    subtitle: "Designer Hoodie",
    description: "Premium fleece blend with kangaroo pocket",
    price: "$54.99",
    colors: ["#FFFFFF", "#000000", "#7C7C7C", "#9B0000"],
    suitableAge: ["26-35", "36-50", "50+"], 
  },
];

// ... (Product generation loop remains the same)
const TOTAL_PRODUCTS = 48;
const PRODUCTS_PER_PAGE = 8;
const allProducts: Product[] = [];

for (let i = 0; i < TOTAL_PRODUCTS; i++) {
  const baseIndex = i % baseProducts.length;
  const base = baseProducts[baseIndex];
  const priceValue = getPriceValue(base.price) + (i % 5) * 0.5;

  allProducts.push({
    ...base,
    id: i + 1,
    priceValue: parseFloat(priceValue.toFixed(2)),
    price: `€${priceValue.toFixed(2)}`,
    subtitle: `${base.subtitle} - Style ${i + 1}`,
    isNew: i < 4 && base.isNew,
    isBestSeller: i % 7 === 0 && base.isBestSeller,
    imageSrc: base.imageSrc,
    suitableAge: base.suitableAge.includes("50+") && i % 3 === 0 ? ["50+"] : base.suitableAge,
  });
}

// ----------------------------------------------------------------------
// Filters (Unchanged)
// ----------------------------------------------------------------------
const ageGroups = ["ALL", "18-25", "26-35", "36-50", "50+"];
const productTypes = ["T-SHIRTS", "HOODIES", "CAPS", "MUGS"]; 
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
    className={`w-4 h-4 mr-2 ${
      isWhite ? "border border-gray-300" : "border-none"
    }`}
    style={{
      backgroundColor: hex,
      outline: isWhite ? "1px solid #00000010" : "none",
    }}
  ></div>
));
ColorSwatch.displayName = 'ColorSwatch';


// ----------------------------------------------------------------------
// Product Card (UPDATED with route handlers)
// ----------------------------------------------------------------------

type ProductCardProps = {
    product: Product;
    handleOrderNow: () => void;
    handleCustomizeRoute: () => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, handleOrderNow, handleCustomizeRoute }) => {
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

  const isDarkImage = product.id % baseProducts.length === 2 || product.id % baseProducts.length === 0;
  
  const badgeColor = "bg-[#DFA637] text-black";
  const iconButtonColor = "bg-[#DFA637] text-black hover:bg-[#c99532]";

  const handleAction = (action: string) => {
    console.log(`${action} for Product ID: ${product.id}`);
    
    if (action === "Order Now") {
      handleOrderNow(); // 👈 Call handler for /pages/shipping
    } else if (action === "Customize") {
      handleCustomizeRoute(); // 👈 Call handler for /pages/my-creation
    } else {
      alert(`${action} clicked for ${subtitle}!`);
    }
  };

  return (
    <div className="flex flex-col border-none">
      <div className="relative overflow-hidden">
        <div
          className="w-full h-[400px] bg-cover bg-center" 
          style={{
            backgroundImage: `url(${imageSrc.src})`,
            backgroundColor: isDarkImage ? "#000" : "#FFF",
          }}
        >
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

export default function ShopPage() {
  const router = useRouter(); // 👈 INITIALIZED ROUTER

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(ageGroups[0]);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<typeof priceRanges[number] | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('Featured');
  
  // Handlers to reset pagination
  const handleFilterChange = useCallback(() => {
    setCurrentPage(1); 
  }, []);
  
  // 1. ROUTE HANDLER: Order Now (for /pages/shipping)
  const handleOrderNow = useCallback(() => {
    router.push(`/pages/shipping`);
  }, [router]);

  // 2. ROUTE HANDLER: Customize (for /pages/my-creation)
  const handleCustomizeRoute = useCallback(() => {
    router.push(`/pages/customise`);
  }, [router]);

  // Filtering Logic (Unchanged)
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(product => {
        if (selectedAgeGroup !== "ALL") {
            if (!product.suitableAge.includes(selectedAgeGroup as AgeGroupKey)) {
                return false;
            }
        }
        if (selectedProductType && product.title !== selectedProductType) {
          return false;
        }
        if (selectedPriceRange) {
            if (product.priceValue < selectedPriceRange.min || product.priceValue >= selectedPriceRange.max) {
                return false;
            }
        }
        if (selectedColors.length > 0) {
            const hasSelectedColor = product.colors.some(productColor => selectedColors.includes(productColor));
            if (!hasSelectedColor) {
                return false;
            }
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'Price: Low to High':
            return a.priceValue - b.priceValue;
          case 'Price: High to Low':
            return b.priceValue - a.priceValue;
          case 'Featured':
          default:
            if (a.isBestSeller && !b.isBestSeller) return -1;
            if (!a.isBestSeller && b.isBestSeller) return 1;
            if (a.isNew && !b.isNew) return -1;
            if (!a.isNew && b.isNew) return 1;
            return a.id - b.id;
        }
      });
  }, [selectedAgeGroup, selectedProductType, selectedPriceRange, selectedColors, sortOption]);

  const totalFilteredProducts = filteredProducts.length;
  const productsToDisplay = filteredProducts.slice(0, currentPage * PRODUCTS_PER_PAGE);
  const canLoadMore = productsToDisplay.length < totalFilteredProducts;
  
  // ... (Other handlers remain the same)
  const handleLoadMore = useCallback(() => {
    setCurrentPage(prevPage => prevPage + 1);
  }, []);

  const handleAgeGroupSelect = useCallback((group: string) => {
    setSelectedAgeGroup(group);
    handleFilterChange(); 
  }, [handleFilterChange]);

  const handleProductTypeSelect = useCallback((type: string) => {
    setSelectedProductType(prevType => prevType === type ? null : type);
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
      alert("Filter panel toggle clicked! (Placeholder for opening/closing a sidebar/modal)");
  };


  return (
    <div className={`bg-white ${jostFont.className}`}>
      <div className="px-4 sm:px-6 lg:px-18 pt-6">
        {/* Age Filters (Unchanged) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-300/60">
          <div className="flex flex-wrap items-center space-x-2 text-sm mb-4 sm:mb-0">
            <span className="font-medium text-gray-700 tracking-wide mr-2 whitespace-nowrap">
              AGE GROUP:
            </span>
            {ageGroups.map((group) => (
              <span
                key={group}
                className={`px-3 py-1.5 cursor-pointer text-sm border font-medium transition mt-2 sm:mt-0 ${
                  group === selectedAgeGroup
                    ? "bg-[#DFA637] text-black border-[#DFA637]"
                    : "text-gray-700 border-gray-300 hover:border-gray-500"
                }`}
                onClick={() => handleAgeGroupSelect(group)}
              >
                {group}
              </span>
            ))}
          </div>

          {/* Filters Right (Unchanged) */}
          <div className="flex items-center space-x-4 text-sm text-gray-700">
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

        {/* Product Type, Price, Colors (Unchanged filter structure) */}
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-start pt-6 pb-4">
          {/* Product Type */}
          <div className="w-full sm:w-1/4 mb-6 sm:mb-0">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 tracking-wider">
              PRODUCT TYPE
            </h3>
            <ul className="space-y-1 text-sm tracking-wide text-gray-800">
              {productTypes.map((type) => (
                <li 
                  key={type} 
                  className={`cursor-pointer transition ${
                    selectedProductType === type ? 'text-black font-bold' : 'hover:text-black'
                  }`}
                  onClick={() => handleProductTypeSelect(type)}
                >
                  {type}
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
                  className={`cursor-pointer transition ${
                    selectedPriceRange?.name === range.name ? 'text-black font-bold' : 'hover:text-black'
                  }`}
                  onClick={() => handlePriceRangeSelect(range)}
                >
                  {range.name}
                </li>
              ))}
            </ul>
          </div>

          {/* COLORS */}
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
                    className={`w-6 h-6 border-2 ${
                      isSelected ? "border-transparent" : borderColor
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
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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

      {/* Product Grid (UPDATED to pass handlers) */}
      <div className="px-4 sm:px-6 lg:px-18">
        {productsToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {productsToDisplay.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  handleOrderNow={handleOrderNow} // 👈 Passed to Card
                  handleCustomizeRoute={handleCustomizeRoute} // 👈 Passed to Card
                />
              ))}
            </div>
        ) : (
            <div className="text-center py-20 text-gray-600">
                <p className="text-xl font-semibold">No products found matching your criteria.</p>
                <p className="mt-2">Try adjusting your filters.</p>
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