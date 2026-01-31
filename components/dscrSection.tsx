"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

import rightIcon from "../public/image/myCreationIcon/rightIcon.svg";

import leftArrowIcon from "../public/image/myCreationIcon/rightIcon.svg";
import rightArrowIcon from "../public/image/myCreationIcon/rightIcon.svg";

import specialIcon from "../public/image/myCreationIcon/specialStartIcon.svg";
import drowIcon from "../public/image/myCreationIcon/deowIcon.svg";

import colorIcon from "../public/image/myCreationIcon/colorStar.svg";
import nonColorIcon from "../public/image/myCreationIcon/noncolorStar.svg";

import { Jost, Cormorant_Garamond } from "next/font/google";
import { useGetProductDetailsQuery, useGetProductReviewsQuery } from "@/app/store/slices/services/product/productApi";

const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorantNormal = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

// --- CSS Animation Definitions (Unchanged) ---
const animationStyles = (
  <style jsx global>{`
    /* 1. Fade-in for Content Transition */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Apply the animation class */
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }

    /* 2. Pulse effect on click for better feedback */
    @keyframes pulseClick {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(0.98);
      }
      100% {
        transform: scale(1);
      }
    }

    .tab-button-pulse:active {
      animation: pulseClick 0.2s ease-out;
    }
  `}</style>
);
// -------------------------------------------------------------

// --- DATA STRUCTURE WITH ALL CONTENT (Unchanged) ---
// --- COMPONENT ---
export default function ProductTabs({ productId }: { productId?: number }) {
  const { data: detailsData } = useGetProductDetailsQuery(productId ?? 0, {
    skip: !productId,
  });

  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useGetProductReviewsQuery({ product_id: productId }, {
    skip: !productId
  });

  const apiProduct = detailsData?.data;

  // Helper to flatten reviews from the API structure
  const allReviews = React.useMemo(() => {
    if (!reviewsData?.review_details) return [];
    
    // The API returns an object where keys are star ratings, and values are objects containing a 'reviews' array
    return Object.values(reviewsData.review_details)
      .flatMap((detail: any) => detail.reviews || [])
      .sort((a: any, b: any) => new Date(b.review.created_date).getTime() - new Date(a.review.created_date).getTime());
  }, [reviewsData]);

  // Helper to calculate average rating
  const averageRating = React.useMemo(() => {
    if (!reviewsData?.star_reveiw_count) return 0;
    
    let totalStars = 0;
    let totalCount = 0;
    
    Object.entries(reviewsData.star_reveiw_count).forEach(([star, count]) => {
      totalStars += parseInt(star) * (count as number);
      totalCount += (count as number);
    });
    
    return totalCount > 0 ? (totalStars / totalCount).toFixed(1) : 0;
  }, [reviewsData]);

  const totalReviewCount = reviewsData?.total_review || 0;

  // Memoize the tab data to update when apiProduct changes
  const tabData = React.useMemo(() => [
    {
      value: "description",
      label: "DESCRIPTION",
      content: (
        <div className="text-gray-700">
          <p className={`${jostFont.className} tracking-[0.5] text-[18px] text-[#6b6b6b]`}>
            {apiProduct?.name || "Premium Product"}
          </p>
          <p className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b]`}>
            {apiProduct?.description || "No description available for this product."}
          </p>
          {/* Static benefits list - consistent for all premium products */}
          <ul className="list-none p-0 space-y-2 ">
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image src={rightIcon} alt="Checkmark Icon" width={16} height={16} className="text-amber-700" />
              </div>
              <span className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b]`}>
                Premium materials sourced from certified suppliers
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image src={rightIcon} alt="Checkmark Icon" width={16} height={16} className="text-amber-700" />
              </div>
              <span className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b]`}>
                Professional 300 DPI print quality for crisp, vibrant designs
              </span>
            </li>
            {apiProduct?.ai_gen && (
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                  <Image src={rightIcon} alt="Checkmark Icon" width={16} height={16} className="text-amber-700" />
                </div>
                <span className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b]`}>
                  Adobe Firefly AI integration for stunning design generation
                </span>
              </li>
            )}
          </ul>
        </div>
      ),
    },
    {
      value: "specifications",
      label: "SPECIFICATIONS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
          <div>
            <h3 className={`${cormorantNormal.className} tracking-[0.5] text-[20px] text-[#1a1a1a] mb-4  pb-2`}>
              Product Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-[#e5e5e5]">
                <span className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b] mb-3`}>
                  Category
                </span>
                <span className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#1a1a1a] `}>
                  {apiProduct?.category?.title || "N/A"}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#e5e5e5]">
                <span className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b] mb-3`}>
                  Sub-Category
                </span>
                <span className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#1a1a1a] `}>
                  {apiProduct?.sub_category?.title || "N/A"}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#e5e5e5]">
                <span className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b] mb-3`}>
                  Primary Color
                </span>
                <span className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#1a1a1a] `}>
                  {apiProduct?.color_code || "Varied"}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#e5e5e5]">
                <span className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b] mb-3 `}>
                  Available Sizes
                </span>
                <span className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#1a1a1a] `}>
                  {Array.isArray(apiProduct?.cloth_size) ? apiProduct?.cloth_size.join(", ") : "One Size"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className={`${cormorantNormal.className} tracking-[0.5] text-[20px] text-[#1a1a1a]  mb-4  pb-2`}>
              Care Instructions
            </h3>
            {/* Standard care instructions as fallback or static content */}
            <ul className="list-none p-0 space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                  <Image src={rightIcon} alt="Checkmark Icon" width={16} height={16} className="text-amber-700" />
                </div>
                <span className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}>
                  Machine wash cold with like colors
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                  <Image src={rightIcon} alt="Checkmark Icon" width={16} height={16} className="text-amber-700" />
                </div>
                <span className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}>
                  Tumble dry low or hang dry
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      value: "customization",
      label: "CUSTOMIZATION",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Design Generator Card - Show if AI Gen is enabled */}
          {apiProduct?.ai_gen && (
            <div className="border border-[#D4AF3733] p-6 bg-white shadow-sm flex flex-col items-start">
              <div className="w-10 h-10 bg-[#D4AF37] flex items-center justify-center mb-4">
                <Image src={specialIcon} alt="Checkmark Icon" width={16} height={16} />
              </div>
              <h4 className={`${cormorantNormal.className} tracking-[0.5] text-[20px] text-[#1a1a1a] mb-2`}>
                AI Design Generator
              </h4>
              <p className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#6B6B6B] mb-4`}>
                Create unique designs using Adobe Firefly AI. Simply describe your vision.
              </p>
              <ul className="list-none p-0 space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                    <Image src={rightIcon} alt="Checkmark Icon" width={16} height={16} />
                  </div>
                  <span className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}>
                    Text-to-image generation
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Manual Text Creator Card - Show if Manual Lettering is enabled */}
          {apiProduct?.ai_letter && (
            <div className="border border-[#D4AF3733] p-6 bg-white shadow-sm flex flex-col items-start">
              <div className="w-10 h-10 bg-[#E5E5E5]  flex items-center justify-center mb-4">
                <Image src={drowIcon} alt="Checkmark Icon" width={16} height={16} className="text-amber-700" />
              </div>
              <h4 className={`${cormorantNormal.className} tracking-[0.5] text-[20px] text-[#1a1a1a] mb-2`}>
                Manual Text Creator
              </h4>
              <p className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#6B6B6B] mb-4`}>
                Design custom text layouts with full control over fonts, sizes, and colors.
              </p>
              <ul className="list-none p-0 space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                    <Image src={rightIcon} alt="Checkmark Icon" width={16} height={16} />
                  </div>
                  <span className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}>
                    Multiple premium fonts
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Fallback if no customization options are available */}
          {!apiProduct?.ai_gen && !apiProduct?.ai_letter && (
            <div className="col-span-1 md:col-span-2 text-center py-8 text-gray-500">
              <p>No customization options available for this product.</p>
            </div>
          )}
        </div>
      ),
    },
    {
      value: "reviews",
      label: `REVIEWS (${totalReviewCount})`,
      content: (
        <div className="text-gray-700 ">
          <div className="mb-8 p-4 border-gray-200 bg-white ">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
              <div className="flex flex-col items-center px-2 py-8">
                <span className={`${jostFont.className} tracking-[0.5] text-[48px] text-[#1a1a1a] text-6xl`}>
                  {averageRating}
                </span>
                <div className="flex text-xl mt-2 mb-2 gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Image
                      key={star}
                      src={star <= Math.round(Number(averageRating)) ? colorIcon : nonColorIcon}
                      alt="Star Icon"
                      width={16}
                      height={16}
                    />
                  ))}
                </div>
                <span className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#6B6B6B]`}>
                  {totalReviewCount} Reviews
                </span>
              </div>
              <div className="w-full px-2 py-8">
                {/* Star rating bars */}
                {[5, 4, 3, 2, 1].map((starCount) => {
                  const countForStar = reviewsData?.star_reveiw_count?.[String(starCount)] || 0;
                  const percentage = totalReviewCount > 0 ? (countForStar / totalReviewCount) * 100 : 0;

                  return (
                    <div key={starCount} className="flex items-center mb-2">
                      <span className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a] w-12 mr-2`}>
                        {starCount} Star
                      </span>
                      <div className="grow bg-[#F5F5F5] h-2.5 relative overflow-hidden">
                        <div
                          className="bg-[#F4C430] h-full "
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#6B6B6B] w-10 text-left ml-2`}>
                        {countForStar}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Individual Review Items */}
          {reviewsLoading ? (
            <p className="p-4 text-center text-gray-500">Loading reviews...</p>
          ) : reviewsError ? (
            <p className="p-4 text-center text-red-500">Error loading reviews.</p>
          ) : allReviews.length > 0 ? (
            allReviews.map((review: any) => (
              <div key={review.id} className="mb-6 p-4 border-[#E5E5E5] border-b bg-white ">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-500 text-lg mr-2">
                     {[...Array(5)].map((_, j) => (
                        <Image
                          key={j}
                          src={j < review.review.star ? colorIcon : nonColorIcon}
                          alt="Star"
                          width={14}
                          height={14}
                        />
                     ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.review.created_date).toLocaleDateString()}
                  </span>
                </div>
                <p className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a] mb-1`}>
                  Verified Purchase
                </p>
                {/*
                  Note: The API doesn't seem to provide a separate title,
                  so we might omit the title or re-use part of the comment or just a generic header if needed.
                  Using a shortened comment as a "title" placeholder if desired, or removing.
                */}

                <p className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6B6B6B]`}>
                  {review.review.comment}
                </p>
                <p className={`${jostFont.className} tracking-[0.5] mt-2 text-[14px] text-[#1a1a1a]`}>
                  - {review.user.email?.split('@')[0] || "Anonymous"}
                </p>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-gray-500">No reviews yet.</p>
          )}
        </div>
      ),
    },
  ], [apiProduct, reviewsData, allReviews, averageRating, totalReviewCount, reviewsLoading, reviewsError]);

  const [activeTab, setActiveTab] = useState("description"); // Default string to match values
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Ref for the entire tab list container (for measuring scroll)
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  // Ref for the entire tabs header (to position underline relative to it)
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  // Refs for each individual tab element
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Function to check and update arrow visibility based on scroll position
  const updateArrowVisibility = useCallback(() => {
    // Only show arrows if on md+ screen and there's horizontal overflow
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      const scrollContainer = tabsScrollRef.current;
      if (scrollContainer) {
        setShowLeftArrow(scrollContainer.scrollLeft > 0);
        setShowRightArrow(
          scrollContainer.scrollLeft <
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        );
      }
    } else {
      // Hide arrows on mobile
      setShowLeftArrow(false);
      setShowRightArrow(false);
    }
  }, []);

  // Effect for initial render, activeTab changes, and window resize
  useEffect(() => {
    updateArrowVisibility(); // Update arrow visibility on mount
  }, [activeTab, updateArrowVisibility]);

  // Effect for window resize (responsiveness)
  useEffect(() => {
    // Debounce the resize handler for better performance
    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateArrowVisibility();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateArrowVisibility]);

  // Effect for monitoring scroll of the tabs itself
  useEffect(() => {
    const scrollContainer = tabsScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateArrowVisibility);
      return () =>
        scrollContainer.removeEventListener("scroll", updateArrowVisibility);
    }
  }, [updateArrowVisibility]);

  // Scroll handler for arrows
  const handleScroll = (direction: "left" | "right") => {
    const scrollContainer = tabsScrollRef.current;
    if (scrollContainer) {
      const scrollAmount = scrollContainer.clientWidth / 2; // Scroll half the container width
      scrollContainer.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const content = tabData.find((tab) => tab.value === activeTab)?.content;

  return (
    <div className="w-full max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8 mb-12">
      {animationStyles} {/* Inject custom CSS animations */}
      {/* Container for tabs and arrows */}
      <div className="relative" ref={tabsContainerRef}>
        {/* Left Scroll Arrow (Hidden on Mobile) */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            // ADDED: Active pulse class
            className="tab-button-pulse absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md z-20 focus:outline-none hidden md:block transition-transform duration-150"
          >
            <Image
              src={leftArrowIcon}
              alt="Scroll Left"
              width={16}
              height={16}
              // Added transform to flip the rightIcon to act as a left arrow
              className="transform rotate-180"
            />
          </button>
        )}

        {/* Tab Header Container (Switching between vertical/horizontal) */}
        <div
          ref={tabsScrollRef} // This is the element that actually scrolls/stacks
          className="relative flex flex-col md:flex-row border-b border-gray-200 overflow-x-hidden md:overflow-x-auto whitespace-normal md:whitespace-nowrap scrollbar-hide"
        >
          <div className="absolute bottom-0 h-0.5 bg-gray-900 transition-all duration-300 ease-in-out" />

          {/* Tab Buttons */}
          {tabData.map((tab) => (
            <button
              key={tab.value}
              ref={(el) => {
                tabRefs.current[tab.value] = el;
              }}
              onClick={() => setActiveTab(tab.value)}
              className={`
      py-3 md:py-4 md:px-21.5 ${jostFont.className
                } tracking-[2.1] text-[14px] text-[#1a1a1a]
      text-sm font-medium uppercase 
      relative z-10 transition-colors duration-200 flex-shrink-0 
      w-full md:w-auto  border 
      
      // Active/Inactive States
      ${activeTab === tab.value
                  ? // --- Active State: Full Border + Background Color ---
                  "text-[#1a1a1a] bg-gray-50 border-[#795548] md:bg-white"
                  : // --- Inactive State: Transparent Border ---
                  "text-[#1a1a1a] hover:text-[#1a1a1a] hover:bg-gray-50 md:hover:bg-white border-transparent"
                }
    `}
            >
              <div className="px-4 md:px-0 text-left">{tab.label}</div>
            </button>
          ))}
        </div>

        {/* Right Scroll Arrow (Hidden on Mobile) */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            // ADDED: Active pulse class
            className="tab-button-pulse absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md z-20 focus:outline-none hidden md:block transition-transform duration-150" // Hidden below md
          >
            <Image
              src={rightArrowIcon}
              alt="Scroll Right"
              width={16}
              height={16}
            />
          </button>
        )}

        {/* Scroll Bar Indicator (Hidden on Mobile) */}
        <div className="h-2 bg-gray-200 rounded-full mt-2 hidden md:hidden">
          {/* ... scroll indicator logic ... */}
        </div>
      </div>{" "}
      {/* End of tabs & arrows container */}
      <div className="pt-8 px-2 md:px-0">
        <div
          key={activeTab} // Key forces the component to re-mount, triggering the fade animation
          className="animate-fade-in" // ADDED: The class for content animation
        >
          {content}
        </div>
      </div>
    </div>
  );
}
