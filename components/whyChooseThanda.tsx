"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";

import rightIcon from "../public/image/whyChooseThanderIcon/rightIcon.svg";
import dengerIcon from "../public/image/whyChooseThanderIcon/dengerIcon.svg";
import crossIcon from "../public/image/whyChooseThanderIcon/crossIcon.svg";

import { Jost, Cormorant_Garamond } from "next/font/google";

const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic"],
});

// --- CSS Animation Definitions (Common to all components) ---
const animationStyles = (
  <style jsx global>{`
    @keyframes slideUpFadeIn {
      from {
        opacity: 0;
        transform: translateY(40px); /* Slightly larger slide for the table */
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Initial state for the entire table container */
    .table-initial {
      opacity: 0;
      transform: translateY(40px);
    }

    /* Animated state for the table */
    .table-animate {
      animation: slideUpFadeIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; /* Smoother timing function */
      animation-delay: 0.2s; /* Start delay after scroll trigger */
    }

    /* Animation for the title */
    .title-initial {
      opacity: 0;
      transform: translateY(20px);
    }
    .title-animate {
      animation: slideUpFadeIn 0.8s ease-out forwards;
    }
  `}</style>
);
// -------------------------------------------------------------

const WhyChooseTundra = () => {
  // 1. Setup Hooks for Scroll Animation
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the section is visible
      }
    );

    const currentElement = sectionRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    // Cleanup function
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  // 2. Data structure remains the same
  const features = [
    {
      description: "AI-assisted design creation",
      tundra: (
        <Image
          src={rightIcon}
          alt="Checkmark"
          width={20}
          height={20}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      ),
      other: (
        <Image
          src={crossIcon}
          alt="Cross"
          width={20}
          height={20}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      ),
    },
    {
      description: "Automatic AI image optimization for best print results",
      tundra: (
        <Image
          src={rightIcon}
          alt="Checkmark"
          width={20}
          height={20}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      ),
      other: (
        <Image
          src={crossIcon}
          alt="Cross"
          width={20}
          height={20}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      ),
    },
    {
      description: "Save designs & images permanently in profile",
      tundra: (
        <Image
          src={rightIcon}
          alt="Checkmark"
          width={20}
          height={20}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      ),
      other: (
        <div className="relative inline-block">
          <Image
            src={dengerIcon}
            alt="Alert"
            width={20}
            height={20}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <span className="absolute -top-1 -right-1 text-xs text-gray-500 font-bold leading-none">
            *
          </span>
        </div>
      ),
    },
    {
      description: "Private & secure design environment",
      tundra: (
        <Image
          src={rightIcon}
          alt="Checkmark"
          width={20}
          height={20}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      ),
      other: (
        <Image
          src={rightIcon}
          alt="Checkmark"
          width={20}
          height={20}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      ),
    },
    {
      description: "Seamless production & order process",
      tundra: (
        <Image
          src={rightIcon}
          alt="Checkmark"
          width={20}
          height={20}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      ),
      other: (
        <Image
          src={rightIcon}
          alt="Checkmark"
          width={20}
          height={20}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      ),
    },
  ];

  // 3. Conditional Class Application
  const titleClasses = isVisible
    ? "title-initial title-animate"
    : "title-initial";
  const tableClasses = isVisible
    ? "table-initial table-animate"
    : "table-initial";

  return (
    <section
      ref={sectionRef} // Attach ref to the section
      className="bg-[#fcfcfc] py-16 px-4 sm:px-6 lg:px-8"
    >
      {animationStyles}
      <div className="max-w-4xl lg:max-w-5xl mx-auto">
        {/* Title Section with Animation Classes */}
        <h2
          className={`text-3xl md:text-5xl ${cormorantItalic.className} lg:text-7xl font-semibold italic text-[#1a1a1a] text-center mb-12 ${titleClasses}`}
        >
          Why Choose Tundra?
        </h2>

        {/* Comparison Table Container with Animation Classes */}
        <div
          className={`bg-white rounded-lg overflow-hidden border border-gray-200 ${tableClasses}`}
        >
          {/* Table Header (Keeping the staggered effect here for smooth transition) */}
          <div className="grid grid-cols-3 text-center border-b border-gray-200 bg-white text-gray-800 font-semibold text-sm sm:text-base">
            <div className="py-4 px-3 sm:px-6 text-left"></div>{" "}
            <div
              className={`${jostFont.className} text-lg font-semibold py-4 px-3 sm:px-6  `}
            >
              Tundra.de
            </div>
            <div
              className={`${jostFont.className} text-lg font-semibold py-4 px-3 sm:px-6 `}
            >
              Other Websites
            </div>{" "}
          </div>

          {/* Table Rows (Removed individual row animation, relying on parent animation) */}
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 items-center text-sm sm:text-base group 
              ${index < features.length - 1 ? "border-b border-gray-100" : ""} 
              transition-all duration-300 ease-in-out hover:bg-gray-50 transform hover:scale-[1.005]`}
            >
              {/* Description Column */}
              <div
                className={`${jostFont.className} text-[#0a0a0a] text-[16px] py-3 px-3 sm:px-6 text-left transition-transform duration-300 group-hover:translate-x-1`}
              >
                {feature.description}
              </div>
              {/* Tundra Column (Image Icon) */}
              <div
                className={`${jostFont.className} text-[#0a0a0a] text-[16px] py-3 px-3 sm:px-6 flex justify-center`}
              >
                {feature.tundra}
              </div>
              {/* Other Column (Image Icon/Alert) */}
              <div
                className={`${jostFont.className} text-[#0a0a0a] text-[16px] py-3 px-3 sm:px-6 flex justify-center`}
              >
                {feature.other}
              </div>
            </div>
          ))}

          {/* Footer Note */}
          <div className="py-3 px-3 sm:px-6 text-[#4a5565] text-[16px] border-t border-gray-100 bg-gray-50">
            *partly
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseTundra;
