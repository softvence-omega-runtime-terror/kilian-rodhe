// pages/index.js
"use client";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

import { Jost, Roboto_Flex } from "next/font/google";
import { useRouter } from "next/navigation";

// --- Imported Assets ---
// import mugImage from "@/public/image/shopIcon/mugImage.jpg";
// import cupImage from "@/public/image/shopIcon/cup.jpg";
import loveIcon from "@/public/image/shopIcon/loveIcon.svg";
import shopIcon from "@/public/image/shopIcon/shopIcon.svg";
import arrowIcon from "@/public/image/shopIcon/arrowIcon.svg";
import colorStarIcon from "@/public/image/shopIcon/colorStar.svg";
import { useAppSelector } from "@/app/store/hooks";
import { selectIsAuthenticated } from "@/app/store/slices/authSlice";

// import tshirtsImage from "@/public/image/shopIcon/tshirts.jpg";
// import girlTshitImage from "@/public/image/shopIcon/girlTshirt.jpg";
// import hoodyImage from "@/public/image/shopIcon/hoody.jpg";
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

interface IconToggleButtonProps {
  src: StaticImageData;
  alt: string;
  onClick?: () => void;
}

const IconToggleButton = ({ src, alt, onClick }: IconToggleButtonProps) => (
  <motion.button
    className="bg-[#D4AF37] p-2 shadow-md text-gray-700 hover:opacity-80 transition-opacity z-10"
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.9, rotate: -5 }}
    onClick={onClick}
    aria-label={alt}
  >
    <Image src={src} alt={alt} width={20} height={20} className="w-5 h-5" />
  </motion.button>
);

// 👇 NEW/UPDATED COMPONENT: Toast Message for Bottom Slide-Up
interface ToastMessageProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const ToastMessage = ({ message, type = 'success', onClose }: ToastMessageProps) => {
  // Automatically close the toast after 3 seconds
  useState(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  });

  const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-500';

  return (
    <motion.div
      // Positioned at the bottom
      className={`${jostFont.className} fixed bottom-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white p-4 rounded-lg shadow-2xl z-50 text-center font-medium`}
      // Animation for sliding up from the bottom (y: 100)
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
    >
      <div className="flex items-center space-x-2">
        <span role="img" aria-label="icon" className="text-xl">
          {type === 'error' ? '⚠️' : '❤️'}
        </span>
        <span>{message}</span>
      </div>
    </motion.div>
  );
}
// -----------------------

// Card Data Array (Unchanged)
// const products = [
//   {
//     name: "Women's Fitted Tee",
//     price: "€32.99",
//     image: tshirtsImage,
//     alt: "Women's Fitted Tee",
//     delay: 0.2,
//   },
//   {
//     name: "Kids Fun T-Shirt",
//     price: "€19.99",
//     image: girlTshitImage,
//     alt: "Kids Fun T-Shirt",
//     delay: 0.4,
//   },
//   {
//     name: "Oversized Hoodie",
//     price: "€49.99",
//     image: hoodyImage,
//     alt: "Oversized Hoodie",
//     delay: 0.6,
//   },
//   {
//     name: "Classic Coffee Mug",
//     price: "€14.50",
//     image: mugImage,
//     alt: "Classic Coffee Mug",
//     delay: 0.1,
//   },
//   {
//     name: "Travel Tumbler (Steel)",
//     price: "€28.99",
//     image: cupImage,
//     alt: "Travel Tumbler",
//     delay: 0.2,
//   },
//   {
//     name: "Vintage Crewneck Tee",
//     price: "€35.00",
//     image: tshirtsImage,
//     alt: "Vintage Crewneck Tee",
//     delay: 0.3,
//   },
//   {
//     name: "Unisex Heavy Hoodie",
//     price: "€55.99",
//     image: hoodyImage,
//     alt: "Unisex Heavy Hoodie",
//     delay: 0.4,
//   },
//   {
//     name: "Toddler Graphic Tee",
//     price: "€15.99",
//     image: girlTshitImage,
//     alt: "Toddler Graphic Tee",
//     delay: 0.5,
//   },
//   {
//     name: "Large Custom Mug",
//     price: "€18.00",
//     image: mugImage,
//     alt: "Large Custom Mug",
//     delay: 0.6,
//   },
//   {
//     name: "Insulated Sports Cup",
//     price: "€25.00",
//     image: cupImage,
//     alt: "Insulated Sports Cup",
//     delay: 0.7,
//   },
//   {
//     name: "Premium V-Neck T-shirt",
//     price: "€39.99",
//     image: tshirtsImage,
//     alt: "Premium V-Neck T-shirt",
//     delay: 0.8,
//   },
//   {
//     name: "Zip-Up Fleece Hoodie",
//     price: "€62.00",
//     image: hoodyImage,
//     alt: "Zip-Up Fleece Hoodie",
//     delay: 0.9,
//   },
//   {
//     name: "Infant Onesie",
//     price: "€12.99",
//     image: girlTshitImage,
//     alt: "Infant Onesie",
//     delay: 1.0,
//   },
// ];

import { IProduct, useSaveProductMutation } from "@/app/store/slices/services/product/productApi";
import { useAddToCartMutation } from "@/app/store/slices/services/order/orderApi";

interface BottomCardProps {
  products: IProduct[];
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
}

const Loader = () => (
  <div className="flex flex-col items-center justify-center h-64 w-full">
    <div className="relative w-12 h-12">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-[#795548]/20 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-[#795548] border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

export default function BottomCard({ products, isLoading, currentPage, onPageChange, hasMore }: BottomCardProps) {
  const router = useRouter();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // State for Toast Message
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleOrderNow = async (productId: number) => {
    if (!isAuthenticated) {
      setToast({ message: "Please login to order products.", type: 'error' });
      return;
    }
    try {
      await addToCart({ product: productId, quantity: 1 }).unwrap();
      router.push(`/pages/checkout`);
    } catch (error) {
      console.error("Failed to add to cart", error);
      setToast({ message: "Failed to add to cart. Please try again.", type: 'error' });
    }
  };

  const handleCustomize = (id: number) => {
    router.push(`/pages/customise?id=${id}`);
  };

  // Handler for the Love Icon
  const [saveProduct] = useSaveProductMutation();

  // Handler for Shop Icon (Add to Cart)
  const [addToCart] = useAddToCartMutation();

  const handleAddToCart = async (productId: number, productName: string) => {
    if (!isAuthenticated) {
      setToast({ message: `Please login to add ${productName} to cart.`, type: 'error' });
      return;
    }
    // setToast({ message: `Adding ${productName} to cart...`, type: 'success' });
    try {
      await addToCart({ product: productId, quantity: 1 }).unwrap();
      setToast({ message: `${productName} added to cart!`, type: 'success' });
    } catch (error) {
      console.error("Failed to add to cart", error);
      setToast({ message: "Failed to add to cart. Please try again.", type: 'error' });
    }
  };

  const handleSaveToFavorites = useCallback(async (productId: number, productName: string) => {
    if (!isAuthenticated) {
      setToast({ message: "Please login to save products.", type: 'error' });
      return;
    }
    try {
      await saveProduct({ product: productId }).unwrap();
      setToast({ message: `${productName} saved to your favorites!`, type: 'success' });
    } catch (err: unknown) {
      if ((err as { data?: { message?: string } })?.data?.message === "Product already saved") {
        setToast({ message: `${productName} is already in favorites.`, type: 'success' }); // Info could be better but sticking to plan
      } else {
        setToast({ message: "Failed to save product.", type: 'error' });
      }
    }
  }, [saveProduct, isAuthenticated]);

  const handleCloseToast = () => {
    setToast(null);
  };

  const handleNext = () => {
    if (hasMore) onPageChange(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  // const defaultClasses = `${roboto.className} sm:w-10 sm:h-10 flex items-center justify-center rounded-md border-[1.5] sm:text-[18px] transition-colors duration-150 border-[#795548] bg-white text-[#795548] hover:bg-stone-50`;
  const activeClasses = `${roboto.className} sm:w-10 sm:h-10 flex items-center justify-center rounded-md border-[1.5] sm:text-[18px] transition-colors duration-150 border-[#795548] bg-[#795548] text-white`;

  if (isLoading) return <Loader />;

  return (
    <div className={`bg-[#FAFAFA] ${jostFont.className}`}>
      <AnimatePresence>
        {toast && (
          <ToastMessage message={toast.message} type={toast.type} onClose={handleCloseToast} />
        )}
      </AnimatePresence>

      <main className="max-w-8xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center md:justify-start gap-x-7.5 gap-y-10">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
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
              <div className="relative w-full h-80 overflow-hidden mb-6">
                <motion.div
                  className="w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {product.images?.[0]?.image ? (
                    <Image
                      src={product.images[0].image}
                      alt={product.name}
                      fill
                      objectFit="cover"
                      className="brightness-[0.9]"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
                  )}
                </motion.div>

                <div className="absolute top-4 right-4 flex space-x-2">
                  <IconToggleButton
                    src={loveIcon}
                    alt="Save to Favorites Icon"
                    onClick={() => handleSaveToFavorites(product.id, product.name)}
                  />
                  <IconToggleButton
                    src={shopIcon}
                    alt="Shop Icon"
                    onClick={() => handleAddToCart(product.id, product.name)}
                  />
                </div>

                <motion.button
                  onClick={() => handleCustomize(product.id)}
                  className={`${jostFont.className} absolute bottom-[8%] w-[90%] left-1/2 -translate-x-1/2 h-12 border-2 border-[#ffffff] bg-white/10 text-white tracking-[2.1px] uppercase text-[14px] font-medium flex items-center justify-center`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
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

              <div className="w-full max-w-md text-center">
                <h3
                  className={`${jostFont.className} text-[16px] text-[#2c2c2c] mb-1`}
                >
                  {product.name}
                </h3>
                <p
                  className={`${jostFont.className} text-[16px] font-medium mb-2`}
                >
                  €{product.discounted_price}
                </p>
                <div className="flex justify-center items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Image
                      key={i}
                      src={colorStarIcon}
                      alt="Star Rating"
                      width={14}
                      height={14}
                    />
                  ))}
                </div>
                <motion.button
                  className={`${jostFont.className} shadow text-[14px] w-3/4 h-12 mb-8 bg-[#D4AF37] text-black py-3 tracking-[2.1px] uppercase font-medium`}
                  whileHover={{
                    scale: 1.04,
                    backgroundColor: "#c2a25b",
                    boxShadow: "0px 5px 15px rgba(212, 175, 55, 0.4)",
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleOrderNow(product.id)}
                >
                  ORDER NOW
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer>
        <div className="flex flex-col sm:flex-row items-center justify-center p-4 sm:p-6 space-y-4 sm:space-y-0">
          <div className="flex space-x-1 sm:space-x-2 order-1 sm:order-2">
            <motion.button
              className="w-16 h-8 text-xs sm:w-20 sm:h-10 sm:text-[18px] flex items-center justify-center rounded-md border-[1.5px] transition-colors duration-150 border-[#795548] bg-white text-[#795548] hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="flex space-x-1 sm:space-x-2">
              {[currentPage].map((page) => (
                <motion.button
                  key={page}
                  className={`${activeClasses} w-8 h-8 text-sm`}
                  aria-current="page"
                >
                  {page}
                </motion.button>
              ))}
            </div>

            <motion.button
              className="w-16 h-8 text-xs sm:w-20 sm:h-10 sm:text-[18px] flex items-center justify-center rounded-md border-[1.5px] transition-colors duration-150 border-[#795548] bg-white text-[#795548] hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={!hasMore}
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