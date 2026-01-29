"use client";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Jost, Cormorant_Garamond } from "next/font/google";
import loveIcon from "@/public/image/shopIcon/loveIcon.svg";
import shopIcon from "@/public/image/shopIcon/shopIcon.svg";
import arrowIcon from "@/public/image/shopIcon/arrowIcon.svg";
import colorStarIcon from "@/public/image/shopIcon/colorStar.svg";

import { useRouter } from "next/navigation";
import { useSaveProductMutation } from "@/app/store/slices/services/product/productApi";
import { useAddToCartMutation } from "@/app/store/slices/services/order/orderApi";
import ToastMessage from "../ToastMessage";

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
  src: string | StaticImageData;
  alt: string;
  onClick?: () => void;
}

const IconToggleButton = ({ src, alt, onClick }: IconToggleButtonProps) => (
  <motion.button
    className="bg-[#D4AF37] p-2 shadow-md text-gray-700 hover:opacity-80 transition-opacity"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
  >
    <Image src={src} alt={alt} width={20} height={20} className="w-5 h-5" />
  </motion.button>
);

const Loader = () => (
  <div className="flex flex-col items-center justify-center h-64 w-full">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-[#D4AF37]/20 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className={`${jostFont.className} mt-4 text-[#D4AF37] font-medium tracking-widest uppercase text-sm`}>
      Loading Collections
    </p>
  </div>
);

import { IProduct } from "@/app/store/slices/services/product/productApi";

export default function PopularWeek({ products, isLoading }: { products: IProduct[], isLoading: boolean }) {
  const router = useRouter();
  const [likedProductId, setLikedProductId] = useState<number | null>(null);

  const handleOrderNow = async (productId: number) => {
    try {
      await addToCart({ product: productId, quantity: 1 }).unwrap();
      router.push(`/pages/checkout`);
    } catch (error) {
      console.error("Failed to add to cart", error);
      setToastMessage({ message: "Failed to add to cart", type: "error" });
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart({ product: productId, quantity: 1 }).unwrap();
      setToastMessage({ message: "Added to cart!", type: "success" });
    } catch (error) {
      console.error("Failed to add to cart", error);
      setToastMessage({ message: "Failed to add to cart", type: "error" });
    }
  };

  const handleCustomize = (id: number) => {
    router.push(`/pages/customise?id=${id}`);
  };

  const [saveProduct] = useSaveProductMutation();
  const [addToCart] = useAddToCartMutation();
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);

  const handleLikeProduct = async (productId: number, productName: string) => {
    try {
      const response = await saveProduct({ product: productId }).unwrap();
      setToastMessage({ message: `${productName} saved successfully!`, type: 'success' });
    } catch (err: any) {
      if (err?.data?.message === "Product already saved") {
        setToastMessage({ message: `${productName} is already saved!`, type: 'info' });
      } else {
        setToastMessage({ message: "Please login to save products", type: 'error' });
      }
    }

    // Auto-dismiss logic is handled in the Toast component or here
    setTimeout(() => setToastMessage(null), 3000);
  };



  if (isLoading) {
    return <Loader />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={` bg-[#FAFAFA] ${jostFont.className}`}>
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
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="group flex flex-col items-center w-full sm:w-[calc(50%-20px)]  md:max-w-none md:w-[calc(50%-20px)]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Image Container (Main Product Image) */}
              <div className="relative w-full h-80 overflow-hidden mb-6 bg-gray-100">
                {product.images?.[0]?.image ? (
                  <Image
                    src={product.images[0].image}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="brightness-[0.9] transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}

                {/* Icons Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <IconToggleButton
                    src={loveIcon}
                    alt="Love Icon"
                    onClick={() => handleLikeProduct(product.id, product.name)}
                  />
                  <IconToggleButton
                    src={shopIcon}
                    alt="Shop Icon"
                    onClick={() => handleAddToCart(product.id)}
                  />
                </div>

                {/* CUSTOMIZE Button */}
                <motion.button
                  onClick={() => handleCustomize(product.id)}
                  className={`${jostFont.className} absolute bottom-[8%] w-9/10 right-[5%] h-12 border-2 border-[#ffffff] bg-white/10 text-white tracking-[2.1px] uppercase text-[14px] font-medium transition-colors duration-300 flex items-center justify-center`}
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
                <h3 className={`${jostFont.className} text-[16px] text-[#2c2c2c] mb-1`}>
                  {product.name}
                </h3>
                <p className={`${jostFont.className} text-[16px] font-medium mb-2`}>
                  €{product.discounted_price}
                  {product.discount_percentage > 0 && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      €{product.price}
                    </span>
                  )}
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
                  className={`${jostFont.className} shadow text-[14px] w-full h-12 mb-8 bg-[#D4AF37] text-black py-3 tracking-[2.1px] uppercase font-medium hover:bg-[#c2a25b] transition-colors duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOrderNow(product.id)}
                >
                  ORDER NOW
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {toastMessage && (
          <ToastMessage message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}