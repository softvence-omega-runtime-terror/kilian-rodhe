"use client";

import React, { useRef, useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";

// Assuming these paths are correct for your Next.js setup
import tshirtImage from "../public/image/myAlsoLike/tshirt.jpg";
import hoodieImage from "../public/image/myAlsoLike/girl.jpg";
import capImage from "../public/image/myAlsoLike/cap.jpg";
import mugImage from "../public/image/myAlsoLike/mug.jpg";

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

const cormorantNormal = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

interface Product {
  id: number;
  category: string;
  name: string;
  price: number;
  // StaticImageData is the type used by Next.js for local image imports
  imageSrc: StaticImageData;
}

interface ProductCardProps {
  product: Product;
  isVisible: boolean;
  index: number;
}

// --- CSS Animation Definitions ---
const animationStyles = (
  <style jsx global>{`
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Initial State (Hidden) for Title */
    .title-initial {
      opacity: 0;
      transform: translateY(20px);
    }
    .title-animate {
      animation: slideUp 0.7s ease-out forwards;
    }

    /* Initial State (Hidden) for Cards */
    .card-initial {
      opacity: 0;
      transform: translateY(30px);
    }

    /* Animated State for Cards */
    .card-animate {
      animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; /* Smooth slide up */
    }
  `}</style>
);

const featuredProducts: Product[] = [
  {
    id: 1,
    category: "T-SHIRTS",
    name: "Designer T-Shirt",
    price: 34.99,
    imageSrc: tshirtImage,
  },
  {
    id: 2,
    category: "HOODIES",
    name: "Premium Hoodie",
    price: 54.99,
    imageSrc: hoodieImage,
  },
  {
    id: 3,
    category: "CAPS",
    name: "Baseball Cap",
    price: 24.99,
    imageSrc: capImage,
  },
  {
    id: 4,
    category: "MUGS",
    name: "Coffee Mug",
    price: 19.99,
    imageSrc: mugImage,
  },
];

// 3. PRODUCT CARD COMPONENT
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isVisible,
  index,
}) => {
  // ⬅️ UPDATED: Using "en-US" locale, which typically places the currency symbol
  // on the left for many currencies (including EUR).
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR", // ISO 4217 code for Euro
  }).format(product.price);

  // Conditional classes for animation with staggered delay
  const delay = `${0.3 + index * 0.15}s`;
  const cardClasses = isVisible ? "card-initial card-animate" : "card-initial";

  return (
    <div
      className={`group bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${cardClasses}`}
      style={{ animationDelay: delay }} // Apply staggered delay
    >
      <div className="relative h-96 overflow-hidden">
        <Image
          src={product.imageSrc}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="text-left p-3">
        <p
          className={`${jostFont.className} tracking-[2.4] text-[12px] text-[#6B6B6B] mb-0.5 uppercase`}
        >
          {product.category}
        </p>
        <p
          className={`${cormorantNormal.className} tracking-[0.5] text-[18px] text-[#1a1a1a]`}
        >
          {product.name}
        </p>
        <p
          className={`${jostFont.className} tracking-[0.5] text-[18px] text-[#1a1a1a] mt-1`}
        >
          {/* Displays price with the € symbol on the left, e.g., "€34.99" */}
          {formattedPrice}
        </p>
      </div>
    </div>
  );
};

const YouMayAlsoLike: React.FC = () => {
  // Type the ref as HTMLElement to match the section tag
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // 🚀 FIX for the React Hook Warning: Capture the current ref value locally
    const currentRef = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once visible for a one-time animation
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the section is visible
      }
    );

    // Use the captured local variable for setting up the observation
    if (currentRef) {
      observer.observe(currentRef);
    }

    // 🧹 Cleanup Function: Use the captured local variable for cleanup
    // This correctly references the element that was observed.
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []); // Empty dependency array means this runs once on mount.

  // Conditional class for Title
  const titleClasses = isVisible
    ? "title-initial title-animate"
    : "title-initial";

  return (
    <section
      ref={sectionRef} // Attach ref to the section
      className="py-12 md:py-16 px-4 bg-gray-50"
    >
      {animationStyles}
      <h2
        className={`text-center ${cormorantItalic.className} text-3xl md:text-[48px] italic mb-10 text-[#1a1a1a] ${titleClasses}`}
      >
        You May Also Like
      </h2>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 px-2">
          {featuredProducts.map((product, index) => (
            // Passing isVisible and index to the ProductCard
            <ProductCard
              key={product.id}
              product={product}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;