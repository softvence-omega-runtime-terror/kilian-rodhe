// pages/index.js
"use client";
import Head from "next/head";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { useState } from "react"; // ⬅️ NEW: Import useState hook

import { Jost, Cormorant_Garamond } from "next/font/google";

// --- Imported Assets ---
import mugImage from "@/public/image/shopIcon/mugImage.jpg";
import cupImage from "@/public/image/shopIcon/cup.jpg";
import loveIcon from "@/public/image/shopIcon/loveIcon.svg";
import shopIcon from "@/public/image/shopIcon/shopIcon.svg";
import arrowIcon from "@/public/image/shopIcon/arrowIcon.svg";
import colorStarIcon from "@/public/image/shopIcon/colorStar.svg";
// -----------------------

import { useRouter } from "next/navigation";

import BottomCard from "@/components/shop/bottomCard";

const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic"],
});

// Define the correct type for the props
interface IconToggleButtonProps {
  src: StaticImageData;
  alt: string;
  // ⬅️ UPDATED: Added an optional onClick handler
  onClick?: () => void; 
}

// ⬅️ UPDATED: IconToggleButton now accepts an onClick handler
const IconToggleButton = ({ src, alt, onClick }: IconToggleButtonProps) => (
  <motion.button
    className="bg-[#D4AF37] p-2 shadow-md text-gray-700 hover:opacity-80 transition-opacity"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick} // ⬅️ Apply the onClick handler
  >
    <Image src={src} alt={alt} width={20} height={20} className="w-5 h-5" />
  </motion.button>
);

// Card Data Array
const products = [
  {
    name: "Premium Coffee Mug",
    price: "€14.99",
    image: mugImage,
    alt: "Premium Coffee Mug",
    delay: 0.2,
    id: 1, // ⬅️ Added a unique ID for tracking
  },
  {
    name: "Snapback Cap",
    price: "€24.99",
    image: cupImage,
    alt: "Snapback Cap",
    delay: 0.4,
    id: 2, // ⬅️ Added a unique ID for tracking
  },
];

export default function Home() {
  const router = useRouter();
  // ⬅️ NEW STATE: Stores the ID of the last liked product for success message
  const [likedProductId, setLikedProductId] = useState<number | null>(null);

  const handleOrderNow = () => {
    router.push(`/pages/shipping`);
  };

  const handleCustomize = () => {
    router.push("/pages/customise");
  };

  // ⬅️ NEW HANDLER: For the Love Icon click
  const handleLikeProduct = (productId: number) => {
    // 1. Set the state to show the success message for this product
    setLikedProductId(productId);
    
    // 2. Hide the success message after 2 seconds
    setTimeout(() => {
      setLikedProductId(null);
    }, 2000);

    // *In a real app, you would also save the product ID to global state or local storage here.*
  };

  // ⬅️ NEW COMPONENT: Floating Success Message
  const LikeSuccessMessage = ({ productName }: { productName: string }) => (
    <motion.div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded-lg shadow-xl z-50 flex items-center space-x-2"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <span className="text-xl">❤️</span>
      <span>
        {productName} saved to your favorites!
      </span>
    </motion.div>
  );

  return (
    <div className={` bg-[#FAFAFA] ${jostFont.className}`}>
      <Head>
        <title>Popular This Week</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" max-w-8xl">
        {/* ... Title Section (unchanged) ... */}
        <motion.h1
          className={`${cormorantItalic.className} text-[40px] md:text-[58px] mb-4 mt-2 font-medium text-[#1A1A1A]`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Popular this week
        </motion.h1>
        {/* ---------------------------------- */}
        
        {/* Product Grid */}
        <div className="flex flex-wrap justify-center md:justify-between">
          {products.map((product) => ( // Removed index for cleaner key usage
            <motion.div
              key={product.id} // ⬅️ Using product.id as key
              className="group flex flex-col items-center w-full sm:w-[calc(50%-20px)]  md:max-w-none md:w-[calc(50%-20px)]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: product.delay }}
            >
              {/* Image Container (Main Product Image) */}
              <div className="relative w-full h-80 overflow-hidden mb-6">
                <Image
                  src={product.image}
                  alt={product.alt}
                  layout="fill"
                  objectFit="cover"
                  className="brightness-[0.9] transition-transform duration-500"
                />

                {/* Customize Bar (Subtle bottom line) */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 "
                  initial={{ height: 1 }}
                  animate={{ height: "4px" }}
                  transition={{ duration: 0.8, delay: product.delay + 0.5 }}
                />

                {/* Icons Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  {/* ⬅️ UPDATED: Added onClick handler to the love icon */}
                  <IconToggleButton 
                    src={loveIcon} 
                    alt="Love Icon" 
                    onClick={() => handleLikeProduct(product.id)}
                  />
                  <IconToggleButton src={shopIcon} alt="Shop Icon" />
                </div>

                {/* CUSTOMIZE Button */}
                <motion.button
                  onClick={handleCustomize}
                  className={`${jostFont.className} absolute bottom-[8%] w-9/10 right-[5%] h-12 border-2 border-[#ffffff] bg-white/10 text-[#fff] tracking-[2.1px] uppercase text-[14px] font-medium transition-colors duration-300 flex items-center justify-center`}
                >
                  CUSTOMIZE
                  <Image
                    src={arrowIcon}
                    alt="Arrow Icon"
                    width={16}
                    height={16}
                    className="ml-2"
                  />
                </motion.button>
              </div>

              {/* ... Product Info and Buttons (unchanged) ... */}
              <div className="w-full max-w-md text-center">
                <h3
                  className={`${jostFont.className} text-[16px] text-[#2c2c2c] mb-1`}
                >
                  {product.name}
                </h3>
                <p
                  className={`${jostFont.className} text-[16px] font-medium mb-2`}
                >
                  {product.price}
                </p>

                {/* Star Ratings */}
                <div className="flex justify-center items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Image
                      key={i}
                      src={colorStarIcon}
                      alt="Star Icon"
                      width={14}
                      height={14}
                    />
                  ))}
                </div>

                {/* ORDER NOW Button */}
                <motion.button
                  className={`${jostFont.className} shadow text-[14px] w-full h-12 mb-8 bg-[#D4AF37] text-[#000] py-3 tracking-[2.1px] uppercase font-medium hover:bg-[#c2a25b] transition-colors duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOrderNow}
                >
                  ORDER NOW
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* ⬅️ NEW: Conditionally render the success message using AnimatePresence */}
      <AnimatePresence>
        {likedProductId !== null && (
          <LikeSuccessMessage 
            productName={products.find(p => p.id === likedProductId)?.name || "Product"} 
          />
        )}
      </AnimatePresence>
      {/* --------------------------------------------------------------------- */}
      
      <BottomCard />
    </div>
  );
}