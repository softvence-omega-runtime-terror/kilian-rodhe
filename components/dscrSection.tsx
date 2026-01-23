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
const TAB_DATA = [
  {
    value: "description",
    label: "DESCRIPTION",
    content: (
      <div className="text-gray-700">
        <p
          className={`${jostFont.className} tracking-[0.5] text-[18px] text-[#6b6b6b]`}
        >
          Luxurious 100% premium cotton with superior comfort.
        </p>
        <p
          className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b]`}
        >
          Our Premium Cotton T-Shirt represents the perfect canvas for your
          creative vision. Made from premium materials and constructed with
          meticulous attention to detail, this product combines luxury with
          functionality. Whether you&apos;re creating a personal statement or
          designing for your brand, our AI-powered customization tools ensure
          your vision comes to life with stunning clarity.
        </p>
        <ul className="list-none p-0 space-y-2 ">
          <li className="flex items-start">
            <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
              <Image
                src={rightIcon}
                alt="Checkmark Icon"
                width={16}
                height={16}
                className="text-amber-700"
              />
            </div>
            <span
              className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b]`}
            >
              Premium materials sourced from certified suppliers
            </span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
              <Image
                src={rightIcon}
                alt="Checkmark Icon"
                width={16}
                height={16}
                className="text-amber-700"
              />
            </div>
            <span
              className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b]`}
            >
              Professional 300 DPI print quality for crisp, vibrant designs
            </span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
              <Image
                src={rightIcon}
                alt="Checkmark Icon"
                width={16}
                height={16}
                className="text-amber-700"
              />
            </div>
            <span
              className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b]`}
            >
              Adobe Firefly AI integration for stunning design generation
            </span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
              <Image
                src={rightIcon}
                alt="Checkmark Icon"
                width={16}
                height={16}
                className="text-amber-700"
              />
            </div>
            <span
              className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b]`}
            >
              Durable construction for long-lasting wear and use
            </span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
              <Image
                src={rightIcon}
                alt="Checkmark Icon"
                width={16}
                height={16}
                className="text-amber-700"
              />
            </div>
            <span
              className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b]`}
            >
              Easy care instructions for maintaining quality
            </span>
          </li>
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
          <h3
            className={`${cormorantNormal.className} tracking-[0.5] text-[20px] text-[#1a1a1a] mb-4  pb-2`}
          >
            Product Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-[#e5e5e5]">
              <span
                className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b] mb-3`}
              >
                Category
              </span>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#1a1a1a] `}
              >
                T-Shirts
              </span>
            </div>
            <div className="flex justify-between border-b border-[#e5e5e5]">
              <span
                className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b] mb-3`}
              >
                Material
              </span>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#1a1a1a] `}
              >
                100% Premium Cotton
              </span>
            </div>
            <div className="flex justify-between border-b border-[#e5e5e5]">
              <span
                className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b] mb-3`}
              >
                Print Quality
              </span>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#1a1a1a] `}
              >
                300 DPI Professional
              </span>
            </div>
            <div className="flex justify-between border-b border-[#e5e5e5]">
              <span
                className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b] mb-3`}
              >
                Available Colors
              </span>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#1a1a1a] `}
              >
                4 Options
              </span>
            </div>
            <div className="flex justify-between border-b border-[#e5e5e5]">
              <span
                className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6b6b6b] mb-3 `}
              >
                Available Sizes
              </span>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#1a1a1a] `}
              >
                XS, S, M, L, XL, XXL
              </span>
            </div>
          </div>
        </div>
        <div>
          <h3
            className={`${cormorantNormal.className} tracking-[0.5] text-[20px] text-[#1a1a1a]  mb-4  pb-2`}
          >
            Care Instructions
          </h3>
          <ul className="list-none p-0 space-y-2">
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                  className="text-amber-700"
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}
              >
                Machine wash cold with like colors
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                  className="text-amber-700"
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}
              >
                Tumble dry low or hang dry
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                  className="text-amber-700"
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}
              >
                Do not bleach or dry clean
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                  className="text-amber-700"
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}
              >
                Iron inside out on low heat if needed
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                  className="text-amber-700"
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}
              >
                Print quality guaranteed for 50+ washes
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
        {/* AI Design Generator Card */}
        <div className="border border-[#D4AF3733] p-6 bg-white shadow-sm flex flex-col items-start">
          {/* Placeholder for icon */}
          <div className="w-10 h-10 bg-[#D4AF37] flex items-center justify-center mb-4">
            <Image
              src={specialIcon}
              alt="Checkmark Icon"
              width={16}
              height={16}
            />
          </div>
          <h4
            className={`${cormorantNormal.className} tracking-[0.5] text-[20px] text-[#1a1a1a] mb-2`}
          >
            AI Design Generator
          </h4>
          <p
            className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#6B6B6B] mb-4`}
          >
            Create unique designs using Adobe Firefly AI. Simply describe your
            vision, and our AI will generate professional-quality graphics in
            seconds.
          </p>
          <ul className="list-none p-0 space-y-2 text-sm">
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}
              >
                Text-to-image generation
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}
              >
                Style customization options
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}
              >
                Instant preview on product
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}
              >
                300 DPI export quality
              </span>
            </li>
          </ul>
        </div>

        {/* Manual Text Creator Card */}
        <div className="border border-[#D4AF3733] p-6 bg-white shadow-sm flex flex-col items-start">
          {/* Placeholder for icon */}
          <div className="w-10 h-10 bg-[#E5E5E5]  flex items-center justify-center mb-4">
            <Image
              src={drowIcon}
              alt="Checkmark Icon"
              width={16}
              height={16}
              className="text-amber-700"
            />
          </div>
          <h4
            className={`${cormorantNormal.className} tracking-[0.5] text-[20px] text-[#1a1a1a] mb-2`}
          >
            Manual Text Creator
          </h4>
          <p
            className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#6B6B6B] mb-4`}
          >
            Design custom text layouts with full control over fonts, sizes,
            colors, and positioning. Perfect for names, numbers, and messages.
          </p>
          <ul className="list-none p-0 space-y-2 text-sm">
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}
              >
                Multiple premium fonts
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                />
              </div>
              <span>Custom colors and effects</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                  className="text-amber-700"
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}
              >
                Drag and position text
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 w-4 h-4 shrink-0">
                <Image
                  src={rightIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                  className="text-amber-700"
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a]`}
              >
                High-resolution rendering
              </span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    value: "reviews",
    label: "REVIEWS (127)",
    content: (
      <div className="text-gray-700 ">
        <div className="mb-8 p-4 border-gray-200 bg-white ">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            <div className="flex flex-col items-center px-2 py-8">
              <span
                className={`${jostFont.className} tracking-[0.5] text-[48px] text-[#1a1a1a] text-6xl  `}
              >
                4.8
              </span>
              <div className="flex text-xl mt-2 mb-2 gap-1">
                {/* Star icons */}
                <Image
                  src={colorIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                />

                <Image
                  src={colorIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                />

                <Image
                  src={colorIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                />

                <Image
                  src={colorIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                />

                <Image
                  src={nonColorIcon}
                  alt="Checkmark Icon"
                  width={16}
                  height={16}
                />
              </div>
              <span
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#6B6B6B]`}
              >
                127 Reviews
              </span>
            </div>
            <div className="w-full px-2 py-8">
              {/* Star rating bars */}
              {[5, 4, 3, 2, 1].map((starCount) => (
                <div key={starCount} className="flex items-center mb-2">
                  <span
                    className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a] w-12 mr-2`}
                  >
                    {starCount} Star
                  </span>
                  <div className="grow bg-[#F5F5F5] h-2.5 relative overflow-hidden">
                    <div
                      className="bg-[#F4C430] h-full "
                      style={{
                        width: `${starCount === 5
                            ? (101 / 127) * 100
                            : starCount === 4
                              ? (19 / 127) * 100
                              : starCount === 3
                                ? (7 / 127) * 100
                                : starCount === 2
                                  ? (7 / 127) * 100
                                  : starCount === 1
                                    ? (7 / 127) * 100
                                    : 0
                          }%`,
                      }}
                    ></div>
                  </div>
                  <span
                    className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#6B6B6B] w-10 text-left ml-2`}
                  >
                    {starCount === 5
                      ? 101
                      : starCount === 4
                        ? 19
                        : starCount === 3
                          ? 7
                          : starCount === 2
                            ? 7
                            : starCount === 1
                              ? 7
                              : 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Individual Review Items */}
        {[...Array(3)].map(
          (
            _,
            i // Showing 3 sample reviews
          ) => (
            <div
              key={i}
              className="mb-6 p-4 border-[#E5E5E5] border-b bg-white "
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex text-amber-500 text-lg mr-2">
                  {/* Star icons */}
                  <Image
                    src={colorIcon}
                    alt="Checkmark Icon"
                    width={14}
                    height={14}
                  />

                  <Image
                    src={colorIcon}
                    alt="Checkmark Icon"
                    width={14}
                    height={14}
                  />

                  <Image
                    src={colorIcon}
                    alt="Checkmark Icon"
                    width={14}
                    height={14}
                  />

                  <Image
                    src={colorIcon}
                    alt="Checkmark Icon"
                    width={14}
                    height={14}
                  />

                  <Image
                    src={nonColorIcon}
                    alt="Checkmark Icon"
                    width={14}
                    height={14}
                  />
                </div>
                <span className="text-sm text-gray-500">2 days ago</span>
              </div>
              <p
                className={`${jostFont.className} tracking-[0.5] text-[14px] text-[#1a1a1a] mb-1`}
              >
                Verified Purchase
              </p>
              <p
                className={`${cormorantNormal.className} tracking-[0.5] text-[18px] text-[#1a1a1a] mb-2`}
              >
                Amazing Quality and AI Features!
              </p>

              <p
                className={`${jostFont.className} tracking-[0.5] text-[16px] text-[#6B6B6B]`}
              >
                {" "}
                The AI customization tool is incredible! I created a unique
                design in minutes, and the print quality exceeded my
                expectations. Definitely ordering more.
              </p>
              <p
                className={`${jostFont.className} tracking-[0.5] mt-2 text-[14px] text-[#1a1a1a]`}
              >
                - Sarah M.
              </p>
            </div>
          )
        )}
      </div>
    ),
  },
];

// --- COMPONENT ---
export default function ProductTabs({ productId }: { productId?: number }) {
  const [activeTab, setActiveTab] = useState(TAB_DATA[0].value);
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
    if (window.innerWidth >= 768) {
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

  const content = TAB_DATA.find((tab) => tab.value === activeTab)?.content;

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
          {TAB_DATA.map((tab) => (
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
