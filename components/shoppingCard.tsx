"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react"; // Icon for cart
import Link from "next/link"; // Import Next.js Link component

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

interface EmptyCartProps {
  toggleCart: () => void; // Accept the toggleCart function as a prop
}

// Create a motion-enabled Link component
const MotionLink = motion(Link);

const EmptyCart: React.FC<EmptyCartProps> = ({ toggleCart }) => {
  // Define the path to your main shop/product page
  const shopPath = "/pages/shop"; // CHANGE THIS to your actual path, e.g., "/products"

  return (
    <div className="fixed inset-0 flex justify-end z-50">
      {/* Background Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/50" // Darker overlay for contrast
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }} // Fast fade out
        onClick={toggleCart} // Allows clicking the overlay to close the cart
      />

      {/* Cart Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }} // ডানদিকে স্লাইড করে বেরিয়ে যাবে
        transition={{
          type: "tween", // সিম্পল ট্রানজিশন টাইপ
          duration: 0.5, // 0.5 সেকেন্ডে অ্যানিমেশন সম্পন্ন হবে (স্লো)
          ease: "easeOut",
        }}
        className="relative bg-white w-full sm:w-[420px] h-screen shadow-lg flex flex-col"
      >
        {/* Header */}
        <div className="flex flex-col border-b border-gray-200">
          {/* Top Row: Icon, Title, and Close Button */}
          <div className="flex justify-between items-center px-6 py-2">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-[#C19E3C]" size={24} />
              <h2
                className={`${cormorantItalic.className} text-[28px] md:text-[36px] tracking-[0.5px] text-[#1a1a1a] font-semibold`}
              >
                Shopping Cart
              </h2>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none transition-transform duration-150 hover:scale-110" // added slight hover effect
              onClick={toggleCart} // Call toggleCart to close the cart
            >
              ×
            </button>
          </div>
          {/* Item count moved here, below the title/icon row */}
          <p
            className={`${jostFont.className} text-[14px] tracking-[2.1px] uppercase text-[#6b6b6b] px-6 pb-2`}
          >
            0 Items
          </p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="border-4 border-gray-300 rounded-lg p-4 mb-4">
              <ShoppingBag className="text-gray-500" size={50} />
            </div>
            <p
              className={`${jostFont.className} text-[18px] tracking-[0.5px] leading-[28px] text-[#6B6B6B] text-sm mb-6`}
            >
              Your cart is empty
            </p>
            {/* The button is replaced with the MotionLink component */}
            <MotionLink
              href={shopPath} // Sets the navigation destination
              onClick={toggleCart} // Close the cart when clicking the link
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`${jostFont.className} text-[14px] tracking-[1.4px] bg-[#D4AF37] hover:bg-[#A9892E] text-[#000000] font-medium uppercase px-8 py-3 transition-all inline-block`} // Added inline-block for proper styling
            >
              Start Shopping
            </MotionLink>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyCart;