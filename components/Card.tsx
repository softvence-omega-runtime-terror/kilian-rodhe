"use client";

import { Users } from "lucide-react";
import Image from "next/image";
import ExploreButton from "./button1"; // Assuming button1 is the path to your ExploreButton component

import trendingIcon from "../public/image/cardIcon/Icon-2.svg"; // Adjust path as needed
import exploreIcon from "../public/image/cardIcon/Icon.svg"; // Adjust path as needed
import styles from "./textstyle.module.css"; // Adjust path as needed

// Define the CSS Keyframe Animation for slide-up
const cardAnimationStyles = (
  <style jsx global>{`
    @keyframes slideUpFadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Apply the animation to the content container (text/button) */
    .content-slide-up {
      animation: slideUpFadeIn 0.6s ease-out forwards;
      opacity: 0; /* Start hidden */
      animation-delay: 0.2s; /* Start a bit after the card loads */
    }

    /* Animation for the age group selection buttons (staggered effect) */
    .age-button-slide-up {
      animation: slideUpFadeIn 0.3s ease-out forwards;
      opacity: 0;
    }
    .age-button-delay-1 {
      animation-delay: 0.6s;
    }
    .age-button-delay-2 {
      animation-delay: 0.7s;
    }
    .age-button-delay-3 {
      animation-delay: 0.8s;
    }
    .age-button-delay-4 {
      animation-delay: 0.9s;
    }
  `}</style>
);

export default function MensCollectionCard({
  image,
  tranding,
  title,
  productNumber,
  dis,
  ageGroup,
  ageValue,
}: {
  image: string;
  tranding: number;
  title?: string;
  productNumber?: number;
  dis?: string;
  ageGroup?: number;
  ageValue?: boolean;
}) {
  const imageContainerHeight = ageValue ? "h-[500px]" : "h-full";

  // --- Dynamic Age Group Logic ---
  const isKidsCollection = title === "Kid’s Collections";

  const ageRanges = isKidsCollection
    ? ["3-7", "7-9", "10-13", "14-18"] // Kid's Collections age groups
    : ["18-25", "26-35", "36-50", "50+"]; // Default/Men's Collections age groups
  // --- End Dynamic Age Group Logic ---

  return (
    <div className="bg-white overflow-hidden overflow-x-hidden lg:mb-30 font-['Cormorant_Garamond'] h-[660px]">
      {cardAnimationStyles} {/* Insert the animation styles */}
      
      {/* Image section */}
      <div
        className={`relative w-full ${imageContainerHeight} overflow-hidden`}
      >
        <Image
          src={image}
          alt={title || "Collection Image"}
          fill
          className="object-cover w-full h-full"
          priority
        />

        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Trending badge */}
        {tranding === 1 && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-4 py-2 bg-black/60 text-white text-[11px] uppercase tracking-wider font-sans">
            <Image
              src={trendingIcon}
              alt="Trending Icon"
              width={14}
              height={14}
              className="opacity-90"
            />
            <span className="px-2 py-[2px] rounded-sm">Trending</span>
          </div>
        )}

        {/* Text content (Positioned absolutely at the bottom of the image container) */}
        <div className="absolute bottom-0 w-full px-6 pb-8 text-white content-slide-up">
          {/* Top small stats */}
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-yellow-600 w-6 h-6 flex items-center justify-center rounded-sm">
              <Users className="w-4 h-4 text-black" />
            </div>
            <p className={styles.textStyle}>
              Products <br />
              <span className="text-[#fff] text-[16px]">{productNumber}</span>
            </p>

            {ageGroup !== -1 && (
              <>
                <hr className={styles.container} />
                <span className={styles.ageGroups}>{ageGroup} Age Groups</span>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="text-[26px] w-full font-semibold italic leading-[34px]">
            {title}
          </h2>
          <p className={styles.sophisticatedDesignsFor}>{dis}</p>

          {/* Button */}
          <ExploreButton
            text="Explore Collection"
            title={title ?? ""}
            image={exploreIcon}
          />
        </div>
      </div>
      
      {/* Bottom Section (Age Group Selection) */}
      {ageValue && (
        <div className="bg-white px-6 py-5 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-gray-500 uppercase text-[11px] font-medium tracking-widest
              leading-[16px] inline-block w-[174px] h-[16px]"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Age Group Selection
            </p>

            <p
              className="text-[#d4af37] text-[12px] tracking-[0.5px] leading-[16px]
        inline-block w-[100] h-[16px]"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              GDPR Compliant
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            {/* Dynamically mapped age buttons */}
            {ageRanges.map((age, index) => (
              <button
                key={age}
                className={`border border-gray-300 py-2 text-[14px] text-[#1a1a1a] w-full sm:w-auto min-w-[120px] px-4 age-button-slide-up age-button-delay-${
                  index + 1
                }`}
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}