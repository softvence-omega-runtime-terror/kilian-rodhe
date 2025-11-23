import React from "react";
import Link from "next/link";
import { Jost, Cormorant_Garamond } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import Image from "next/image"; // Import Next.js Image component

import bgImage from "@/public/image/collections/bgImage.jpg";

// --- Font Definitions ---
const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic"],
});


// --- Collection Hero Component ---
const CollectionHero = () => {
  return (
    <div className="w-full bg-white">
      {/* Outer container for the full width */}
      {/* Top section: "Back to Home" */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 bg-white">
        <Link
          href="/"
          className={`flex items-center text-gray-800 hover:text-gray-600 transition duration-200 ${jostFont.className}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="uppercase tracking-wide text-xs">Back to Home</span>
        </Link>
      </div>

      {/* Hero Image and Text Section */}
      <div className="relative w-full h-[30vh] bg-gray-800 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={bgImage} // Replace with the correct path to your image
            alt="Men's Collection Background"
            layout="fill" // Ensures the image covers the entire container
            objectFit="cover" // Ensures the image covers the div without distortion
            className="opacity-70" // Make the background slightly transparent
          />
        </div>

        {/* Overlay to darken the image slightly */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Content Wrapper */}
        <div className="relative z-10 text-white text-center flex flex-col items-center">
          {/* Product Count */}
          <div
            className={`border border-white py-1 px-3 mb-4 text-xs tracking-wider uppercase ${jostFont.className}`}
          >
            88 Products
          </div>

          {/* Collection Title */}
          <h1
            className={`text-6xl md:text-7xl lg:text-8xl mb-4 ${cormorantItalic.className}`}
          >
            Kid&apos;s Collection
          </h1>

          {/* Subtitle / Description */}
          <p
            className={`text-lg md:text-xl text-gray-200 max-w-lg ${jostFont.className}`}
          >
           Stylish designs for children
          </p>

          {/* Separator Line */}
          <div className="w-20 border-t-2 border-yellow-700 mt-6"></div>
        </div>
      </div>
    </div>
  );
};

export default CollectionHero;
