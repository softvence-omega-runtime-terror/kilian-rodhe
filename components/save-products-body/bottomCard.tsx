// pages/index.js
"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Jost, Roboto_Flex } from "next/font/google";

// --- Imported Assets ---
import mugImage from "@/public/image/shopIcon/mugImage.jpg";
import cupImage from "@/public/image/shopIcon/cup.jpg";
import arrowIcon from "@/public/image/shopIcon/arrowIcon.svg";
import colorStarIcon from "@/public/image/shopIcon/colorStar.svg";
import tshirtsImage from "@/public/image/shopIcon/tshirts.jpg";
import girlTshitImage from "@/public/image/shopIcon/girlTshirt.jpg";
import hoodyImage from "@/public/image/shopIcon/hoody.jpg";
import nextButtonImage from "@/public/image/shopIcon/nextArrow.svg";
// -----------------------

const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const roboto = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto",
});
// Define the Product Type (for better TypeScript support)
interface Product {
  id: number; // ⬅️ NEW: Added unique ID
  name: string;
  price: string;
  image: StaticImageData | string; // StaticImageData for imported images, string for URL-based images
  alt: string;
  delay: number;
}


// --- Product Data ---
// ⬅️ UPDATED: Added a unique ID to each product
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Women's Fitted Tee",
    price: "€32.99",
    image: tshirtsImage,
    alt: "Women's Fitted Tee",
    delay: 0.2,
  },
  {
    id: 2,
    name: "Kids Fun T-Shirt",
    price: "€19.99",
    image: girlTshitImage,
    alt: "Kids Fun T-Shirt",
    delay: 0.4,
  },
  {
    id: 3,
    name: "Oversized Hoodie",
    price: "€49.99",
    image: hoodyImage,
    alt: "Oversized Hoodie",
    delay: 0.6,
  },
  {
    id: 4,
    name: "Classic Coffee Mug",
    price: "€14.50",
    image: mugImage,
    alt: "Classic Coffee Mug",
    delay: 0.1,
  },
  {
    id: 5,
    name: "Travel Tumbler (Steel)",
    price: "€28.99",
    image: cupImage,
    alt: "Travel Tumbler",
    delay: 0.2,
  },
  {
    id: 6,
    name: "Vintage Crewneck Tee",
    price: "€35.00",
    image: tshirtsImage,
    alt: "Vintage Crewneck Tee",
    delay: 0.3,
  },
  {
    id: 7,
    name: "Unisex Heavy Hoodie",
    price: "€55.99",
    image: hoodyImage,
    alt: "Unisex Heavy Hoodie",
    delay: 0.4,
  },
  {
    id: 8,
    name: "Toddler Graphic Tee",
    price: "€15.99",
    image: girlTshitImage,
    alt: "Toddler Graphic Tee",
    delay: 0.5,
  },
  {
    id: 9,
    name: "Large Custom Mug",
    price: "€18.00",
    image: mugImage,
    alt: "Large Custom Mug",
    delay: 0.6,
  },
  {
    id: 10,
    name: "Insulated Sports Cup",
    price: "€25.00",
    image: cupImage,
    alt: "Insulated Sports Cup",
    delay: 0.7,
  },
  {
    id: 11,
    name: "Premium V-Neck T-shirt",
    price: "€39.99",
    image: tshirtsImage,
    alt: "Premium V-Neck T-shirt",
    delay: 0.8,
  },
  {
    id: 12,
    name: "Zip-Up Fleece Hoodie",
    price: "€62.00",
    image: hoodyImage,
    alt: "Zip-Up Fleece Hoodie",
    delay: 0.9,
  },
  {
    id: 13,
    name: "Infant Onesie",
    price: "€12.99",
    image: girlTshitImage,
    alt: "Infant Onesie",
    delay: 1.0,
  },
];

const resultsPerPage = 3;

export default function Home() {
  const router = useRouter();

  // ⬅️ NEW STATE: Manages the list of products that are currently visible
  const [activeProducts, setActiveProducts] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);

  // ⬅️ UPDATED: DYNAMICALLY CALCULATE totalPages and DUMMY_PRODUCT_COUNT
  const DUMMY_PRODUCT_COUNT = activeProducts.length;
  const totalPages = Math.max(1, Math.ceil(DUMMY_PRODUCT_COUNT / resultsPerPage)); // Ensure totalPages is at least 1
  const MAX_PAGES_TO_SHOW = 6;


  // --- Pagination & Product Display Logic ---
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = currentPage * resultsPerPage;
  // ⬅️ UPDATED: Slice from the activeProducts state
  const productsToDisplay = activeProducts.slice(startIndex, endIndex);

  // Memoized logic for pagination buttons (kept the same)
  const pagesToShow = useMemo(() => {
    const pages: number[] = [];
    const actualTotalPages = totalPages;

    const halfLimit = Math.floor(MAX_PAGES_TO_SHOW / 2);
    let startPage = currentPage - halfLimit;
    let endPage =
      currentPage + halfLimit - (MAX_PAGES_TO_SHOW % 2 === 0 ? 1 : 0);

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(actualTotalPages, MAX_PAGES_TO_SHOW);
    }

    if (endPage > actualTotalPages) {
      endPage = actualTotalPages;
      startPage = Math.max(1, actualTotalPages - MAX_PAGES_TO_SHOW + 1);
    }
    
    // Correctly handle case where total pages are less than max pages to show
    if (actualTotalPages < MAX_PAGES_TO_SHOW) {
      startPage = 1;
      endPage = actualTotalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]); // ⬅️ Dependency added: totalPages

  // --- Navigation Handlers ---

  const handleCustomize = () => {
    router.push("/pages/customise");
  };

  const handleOrderNow = () => {
    router.push(`/pages/shipping`);
  };

  // ⬅️ NEW HANDLER: Function to remove a product
  const handleRemoveProduct = (productId: number) => {
    // 1. Filter out the product with the given ID
    const newProducts = activeProducts.filter((p) => p.id !== productId);
    
    // 2. Update the state
    setActiveProducts(newProducts);

    // 3. Check if the current page is now empty after removal
    const newTotalPages = Math.max(1, Math.ceil(newProducts.length / resultsPerPage));

    // If the current page index is out of bounds after removing the item, move back one page
    if (currentPage > newTotalPages && currentPage > 1) {
      setCurrentPage(newTotalPages);
    }
    // If the last item was removed from the *only* page, currentPage remains 1 (handle by max(1))
    if (newProducts.length === 0) {
      setCurrentPage(1);
    }
  };

  // --- Pagination Handlers ---
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  // --- Classes and Display Variables ---
  const defaultClasses = `${roboto.className} sm:w-10 sm:h-10 flex items-center justify-center rounded-md border-[1.5px] sm:text-[18px] transition-colors duration-150 border-[#795548] bg-white text-[#795548] hover:bg-stone-50`;
  const activeClasses = `${roboto.className} sm:w-10 sm:h-10 flex items-center justify-center rounded-md border-[1.5px] sm:text-[18px] transition-colors duration-150 border-[#795548] bg-[#795548] text-white`;

  const startResult = DUMMY_PRODUCT_COUNT === 0 ? 0 : (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(
    startIndex + productsToDisplay.length,
    DUMMY_PRODUCT_COUNT
  );

  return (
    <div className={`bg-[#FAFAFA] ${jostFont.className}`}>
      <main className="max-w-8xl mx-auto lg:px-20 py-8">
        {/* Product Grid */}
        <div className="flex flex-wrap justify-center md:justify-start gap-x-[30px] gap-y-10">
          {productsToDisplay.map((product, index) => (
            <motion.div
              key={product.id} // ⬅️ Using product.id as key
              className="group flex flex-col items-center w-full sm:w-[calc(50%-15px)] lg:w-[calc(33.333%-20px)] mb-10 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Image Container */}
              <div className="relative w-full h-80 overflow-hidden mb-6">
                <motion.div
                  className="w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    className="object-cover brightness-[0.9]"
                  />
                </motion.div>

                {/* Heart Icon (SVG) - ⬅️ UPDATED: Added onClick to remove product */}
                <div className="absolute top-6 right-14 flex space-x-2">
                  <motion.button 
                    onClick={() => handleRemoveProduct(product.id)} // ⬅️ Call removal handler
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    className="transition-transform duration-100 p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="23"
                      viewBox="0 0 27 23"
                      fill="none"
                    >
                      <path
                        d="M0 7.35487C2.72625e-05 5.87114 0.450125 4.42232 1.29084 3.19976C2.13156 1.9772 3.32336 1.03842 4.70881 0.507404C6.09427 -0.0236082 7.60821 -0.12187 9.05068 0.225597C10.4932 0.573063 11.7963 1.34991 12.788 2.45354C12.8578 2.52822 12.9423 2.58776 13.0361 2.62847C13.1299 2.66918 13.2311 2.69018 13.3333 2.69018C13.4356 2.69018 13.5368 2.66918 13.6306 2.62847C13.7244 2.58776 13.8088 2.52822 13.8787 2.45354C14.8673 1.34274 16.1707 0.559361 17.6155 0.207673C19.0603 -0.144015 20.578 -0.0473334 21.9665 0.484849C23.355 1.01703 24.5485 1.95947 25.3882 3.18674C26.2278 4.41401 26.6738 5.86788 26.6667 7.35487C26.6667 10.4082 24.6667 12.6882 22.6667 14.6882L15.344 21.7722C15.0956 22.0575 14.7892 22.2868 14.4454 22.4446C14.1016 22.6025 13.7281 22.6853 13.3497 22.6877C12.9714 22.6901 12.5969 22.612 12.251 22.4585C11.9052 22.305 11.596 22.0797 11.344 21.7975L4 14.6882C2 12.6882 0 10.4215 0 7.35487Z"
                        fill="#E7000B"
                      />
                    </svg>
                  </motion.button>
                </div>

                {/* Customize Button */}
                <motion.button
                  onClick={handleCustomize}
                  className={`${jostFont.className} absolute bottom-[8%] w-[90%] left-1/2 -translate-x-1/2 h-12 border-2 border-[#ffffff] bg-white/10 text-[#fff] tracking-[2.1px] uppercase text-[14px] font-medium flex items-center justify-center`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  whileHover={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderColor: "#D4AF37",
                    scale: 1.03,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.97 }}
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

              {/* Product Info */}
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
                      alt="Star Rating"
                      width={14}
                      height={14}
                      className="inline"
                    />
                  ))}
                </div>

                {/* ORDER NOW Button */}
                <motion.button
                  className={`${jostFont.className} shadow text-[14px] w-3/4 h-12 mb-8 bg-[#D4AF37] text-[#000] py-3 tracking-[2.1px] uppercase font-medium`}
                  onClick={handleOrderNow}
                  whileHover={{
                    scale: 1.04,
                    backgroundColor: "#c2a25b",
                    boxShadow: "0px 5px 15px rgba(212, 175, 55, 0.4)",
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  ORDER NOW
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer Pagination */}
      <footer>
        <div className="flex flex-col mb-12 sm:flex-row lg:px-20 items-center justify-between p-4 sm:p-6 space-y-4 sm:space-y-0">
          <motion.div
            className={`${roboto.className} text-base font-normal sm:text-[20px] text-[#636363] order-2 sm:order-1 mt-4 sm:mt-0`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Showing {startResult}-{endResult} of {DUMMY_PRODUCT_COUNT} results
          </motion.div>

          {/* Pagination Buttons */}
          <div className="flex space-x-1 sm:space-x-2 order-1 sm:order-2">
            {/* Prev Button */}
            <motion.button
              className={`${roboto.className} w-16 h-8 text-xs sm:w-20 sm:h-10 sm:text-[18px] flex items-center justify-center rounded-md border-[1.5px] transition-colors duration-150 border-[#795548] bg-white text-[#795548] hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={handlePrevious}
              disabled={currentPage === 1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={nextButtonImage}
                alt="previous icon"
                width={16}
                height={16}
                className="mr-1 rotate-180"
              />
              Prev
            </motion.button>

            {/* Page Numbers */}
            <div className="flex space-x-1 sm:space-x-2">
              {pagesToShow.map((page) => (
                <motion.button
                  key={page}
                  className={
                    page === currentPage
                      ? `${activeClasses} w-8 h-8 text-sm`
                      : `${defaultClasses} w-8 h-8 text-sm`
                  }
                  aria-current={page === currentPage ? "page" : undefined}
                  onClick={() => handlePageChange(page)}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#795548",
                    color: "#fff",
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {page}
                </motion.button>
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              className={`${roboto.className} w-16 h-8 text-xs sm:w-20 sm:h-10 sm:text-[18px] flex items-center justify-center rounded-md border-[1.5px] transition-colors duration-150 border-[#795548] bg-white text-[#795548] hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={handleNext}
              disabled={currentPage === totalPages}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
              <Image
                src={nextButtonImage}
                alt="next icon"
                width={16}
                height={16}
                className="ml-1"
              />
            </motion.button>
          </div>
        </div>
      </footer>
    </div>
  );
}