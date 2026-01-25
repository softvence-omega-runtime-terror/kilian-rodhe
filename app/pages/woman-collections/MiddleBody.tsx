"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Jost, Cormorant_Garamond } from "next/font/google";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation"; // ⬅️ NEW: Import useRouter for navigation

// ----------------------------------------------------------------------
// Woman's Collection Images
// ----------------------------------------------------------------------
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
// Product Type & Data for Woman's Collection (UPDATED)
// ----------------------------------------------------------------------

type AgeGroupKey = "18-25" | "26-35" | "36-50" | "50+";

type Product = {
  id: number;
  // MODIFIED: Allows string (for external URL) or StaticImageData (for local import)
  imageSrc: StaticImageData | string;
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

const baseWomensProducts: Omit<Product, 'id' | 'priceValue'>[] = [
  {
    // EXTERNAL URL 1 ADDED
    imageSrc: "https://imagescdn.vanheusenindia.com/img/app/product/3/39731586-15262426.jpg?auto=format&w=390",
    isBestSeller: true,
    title: "T-SHIRTS",
    subtitle: "Organic Cotton Relaxed Tee",
    description: "Soft and breathable organic cotton, perfect for everyday wear.",
    price: "€34.99",
    colors: ["#FFFFFF", "#000000", "#FDE047", "#D1D5DB"],
    suitableAge: ["18-25", "26-35"],
  },
  {
    // EXTERNAL URL 2 ADDED
    imageSrc: "https://m.media-amazon.com/images/I/71hLTrKHlNL._AC_UY1100_.jpg",
    isNew: true,
    title: " HOODIES",
    subtitle: "Comfort Fleece Cropped Hoodie",
    description: "Stylish cropped fit with cozy fleece lining and drawstrings.",
    price: "€59.99",
    colors: ["#000000", "#FFFFFF", "#9CA3AF", "#EF4444"],
    suitableAge: ["18-25", "36-50"],
  },
  {
    // EXTERNAL URL 3 ADDED
    imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPrmQUxBc6ESRzix93bJvu-u2z0QUEF5KrMg&s",
    title: "CAPS",
    subtitle: "Embroidered Logo Baseball Cap",
    description: "Adjustable strap for comfort, classic design with elegant embroidery.",
    price: "€27.99",
    colors: ["#F9A8D4", "#000000", "#FFFFFF", "#3B82F6"],
    suitableAge: ["18-25", "26-35", "50+"],
  },

  // Remaining placeholders for variety
  {
    imageSrc: "https://placehold.co/400x600/DFA637/FFF/png?text=Womens+Graphic+Tee",
    isNew: true,
    title: "T-SHIRTS",
    subtitle: "Vintage Graphic Print Tee",
    description: "Soft cotton tee featuring a unique vintage-inspired graphic.",
    price: "€39.99",
    colors: ["#000000", "#D1D5DB", "#10B981", "#F97316"],
    suitableAge: ["18-25", "26-35"],
  },
  {
    imageSrc: "https://communityclothing.co.uk/cdn/shop/files/Female_Hooded-Sweatshirt_Apple-Green_Thigh-Up-Front-3_2048x.jpg?v=1709136121",
    title: "HOODIES",
    subtitle: "Relaxed Fit Zip-Up Hoodie",
    description: "Versatile and comfortable, perfect for layering in any season.",
    price: "€64.99",
    colors: ["#000000", "#FFFFFF", "#9CA3AF", "#1D4ED8"],
    suitableAge: ["18-25", "36-50"],
  }


];

const TOTAL_WOMENS_PRODUCTS = 48;
const PRODUCTS_PER_PAGE = 8;
const allWomensProducts: Product[] = [];

for (let i = 0; i < TOTAL_WOMENS_PRODUCTS; i++) {
  const baseIndex = i % baseWomensProducts.length;
  const base = baseWomensProducts[baseIndex];
  const priceValue = getPriceValue(base.price) + (i % 5) * 0.75;

  allWomensProducts.push({
    ...base,
    id: i + 1,
    priceValue: parseFloat(priceValue.toFixed(2)),
    price: `€${priceValue.toFixed(2)}`,
    subtitle: `${base.subtitle} - Style ${i + 1}`,
    isNew: i < 4 && base.isNew,
    isBestSeller: i % 7 === 0 && base.isBestSeller,
    imageSrc: base.imageSrc, // Already a string or StaticImageData
    suitableAge: base.suitableAge.includes("50+") && i % 3 === 0 ? ["50+"] : base.suitableAge,
  });
}

// ----------------------------------------------------------------------
// Filters (Modified for Woman's Collection) - Unchanged
// ----------------------------------------------------------------------

const ageGroups = ["ALL", "18-25", "26-35", "36-50", "50+"];
const productTypes = ["T-SHIRTS", "HOODIES", "CAPS"];
const priceRanges = [
  { name: "Under €30", min: 0, max: 30 },
  { name: "€30 - €60", min: 30, max: 60 },
  { name: "€60 - €90", min: 60, max: 90 },
  { name: "Over €90", min: 90, max: Infinity },
];
const filterColors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF", border: true },
  { name: "Grey", hex: "#9CA3AF" },
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Pink", hex: "#F9A8D4" },
  { name: "Yellow", hex: "#FDE047" },
  { name: "Green", hex: "#10B981" },
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

// ----------------------------------------------------------------------
// Product Card (UPDATED for Next.js Routing)
// ----------------------------------------------------------------------

const ProductCard: React.FC<{ product: Product }> = React.memo(({ product }) => {
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

  // ⬅️ NEW: Initialize router
  const router = useRouter();

  // If imageSrc is a string (URL), use it directly. If it's StaticImageData, use .src.
  // We use type assertion here to handle the mixed type when accessing .src
  const imageUrl = typeof imageSrc === 'string' ? imageSrc : (imageSrc as StaticImageData).src;

  const isLighterBgNeeded = product.title === "WOMEN'S T-SHIRTS" || product.title === "WOMEN'S CAPS";

  const badgeColor = "bg-[#DFA637] text-black";
  const iconButtonColor = "bg-[#DFA637] text-black hover:bg-[#c99532]";

  // ⬅️ MODIFIED: Update handleAction to use router.push() for specific actions
  const handleAction = (action: string) => {
    console.log(`${action} for Product ID: ${product.id}`);

    if (action === "Customize") {
      // Navigate to /pages/my-creation
      router.push(`/pages/customise?id=${product.id}`);
    } else if (action === "Order Now") {
      // Navigate to /pages/shipping
      router.push("/pages/shipping");
    } else {
      // Fallback for Wishlist/Quick Shop
      alert(`${action} clicked for ${subtitle}!`);
    }
  };

  return (
    <div className="flex flex-col border-none">
      <div className="relative overflow-hidden">
        <div
          className="w-full h-[400px] bg-cover bg-center flex items-center justify-center relative"
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
            backgroundColor: imageUrl ? (isLighterBgNeeded ? "#FFF" : "#F8F8F8") : "#F3F4F6",
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
            {/* Customise Button - Navigates to /pages/my-creation */}
            <button
              className={`${cormorantNormal.className} w-full py-3 text-sm font-semibold tracking-widest flex justify-center items-center border border-white text-white bg-black/50 hover:bg-black/80 transition`}
              onClick={() => handleAction("Customize")}
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

        {/* Order Now Button - Navigates to /pages/shipping */}
        <button
          className={`${jostFont.className} w-4/5 py-3 bg-[#DFA637] text-black font-semibold text-sm hover:bg-yellow-700 transition tracking-widest uppercase`}
          onClick={() => handleAction("Order Now")}
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
// Main Component for Woman's Collection (Unchanged)
// ----------------------------------------------------------------------

export default function WomansCollectionPage() {
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

  // Filtering Logic (Using allWomensProducts)
  const filteredProducts = useMemo(() => {
    return allWomensProducts
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

  // Handlers (using handleFilterChange)
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
        {/* Age Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-300/60">
          <div className="flex flex-wrap items-center space-x-2 text-sm mb-4 sm:mb-0">
            <span className="font-medium text-gray-700 tracking-wide mr-2 whitespace-nowrap">
              AGE GROUP:
            </span>
            {ageGroups.map((group) => (
              <span
                key={group}
                className={`px-3 py-1.5 cursor-pointer text-sm border font-medium transition mt-2 sm:mt-0 ${group === selectedAgeGroup
                    ? "bg-[#DFA637] text-black border-[#DFA637]"
                    : "text-gray-700 border-gray-300 hover:border-gray-500"
                  }`}
                onClick={() => handleAgeGroupSelect(group)}
              >
                {group}
              </span>
            ))}
          </div>

          {/* Filters Right */}
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

        {/* Product Type, Price, Colors */}
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
                  className={`cursor-pointer transition ${selectedProductType === type ? 'text-black font-bold' : 'hover:text-black'
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
                  className={`cursor-pointer transition ${selectedPriceRange?.name === range.name ? 'text-black font-bold' : 'hover:text-black'
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
                    className={`w-6 h-6 border-2 ${isSelected ? "border-transparent" : borderColor
                      } cursor-pointer hover:opacity-80 transition relative flex items-center justify-center`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    onClick={() => handleColorSelect(color.hex)}
                  >
                    {/* Checkmark icon on selection */}
                    {isSelected && (
                      <svg
                        className={`h-4 w-4 ${color.hex === "#FFFFFF" || color.hex === "#FDE047" || color.hex === "#F9A8D4" ? 'text-black' : 'text-white'}`}
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

      {/* Product Grid */}
      <div className="px-4 sm:px-6 lg:px-18">
        {productsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {productsToDisplay.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-600">
            <p className="text-xl font-semibold">No products found matching your criteria.</p>
            <p className="mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
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