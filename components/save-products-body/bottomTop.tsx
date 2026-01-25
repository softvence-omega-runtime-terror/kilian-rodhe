// pages/index.js
"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Jost } from "next/font/google";
import { useRouter } from "next/navigation";

// --- Imported Assets ---
import arrowIcon from "@/public/image/shopIcon/arrowIcon.svg";
import colorStarIcon from "@/public/image/shopIcon/colorStar.svg";
import { ISavedProduct, useDeleteSavedProductMutation } from "@/app/store/slices/services/product/productApi";

const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

interface BottomTopProps {
  items: ISavedProduct[];
}

export default function BottomTop({ items }: BottomTopProps) {
  const router = useRouter();
  const [removedProductName, setRemovedProductName] = useState<string | null>(null);

  const handleOrderNow = () => {
    router.push(`/pages/shipping`);
  };

  const handleCustomize = (id: number) => {
    router.push(`/pages/customise?id=${id}`);
  };

  const [deleteSavedProduct] = useDeleteSavedProductMutation();

  const handleRemoveProduct = async (productId: number, productName: string) => {
    try {
      await deleteSavedProduct(productId).unwrap();
      setRemovedProductName(productName);
      setTimeout(() => {
        setRemovedProductName(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to remove product:", error);
      alert("Failed to remove product. Please try again.");
    }
  };

  const RemoveSuccessMessage = ({ productName }: { productName: string }) => (
    <motion.div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-3 rounded-lg shadow-xl z-50 flex items-center space-x-2"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <span className="text-xl">🗑️</span>
      <span>
        {productName} has been removed from the list.
      </span>
    </motion.div>
  );

  if (items.length === 0) return null;

  return (
    <div className={`bg-[#FAFAFA] ${jostFont.className}`}>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-10 md:gap-5">
          {items.map((savedItem, index) => {
            const product = savedItem.product;
            const imageUrl = product.images?.[0]?.image;

            return (
              <motion.div
                key={savedItem.id}
                className="group flex flex-col items-center w-full sm:w-[calc(50%-20px)] md:w-[calc(50%-20px)] lg:w-[calc(50%-40px)]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative w-full h-80 overflow-hidden mb-6 bg-gray-100 flex items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover brightness-[0.9] transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-gray-400 font-medium text-lg uppercase tracking-widest">No Image</span>
                  )}

                  <div className="absolute top-6 right-14 flex space-x-2">
                    <motion.button
                      onClick={() => handleRemoveProduct(savedItem.id, product.name)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      className="p-1 transition-transform duration-100 rounded-full shadow-md"
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

                  <motion.button
                    className={`${jostFont.className} absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[90%] h-12 border-2 border-[#ffffff] bg-white/10 text-[#fff] tracking-[2.1px] uppercase text-[14px] font-medium transition-colors duration-300 flex items-center justify-center`}
                    onClick={() => handleCustomize(product.id)}
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
                    €{product.discounted_price || product.price}
                  </p>

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

                  <motion.button
                    className={`${jostFont.className} shadow text-[14px] w-full h-12 mb-8 bg-[#D4AF37] text-black py-3 tracking-[2.1px] uppercase font-medium hover:bg-[#c2a25b] transition-colors duration-300`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOrderNow}
                  >
                    ORDER NOW
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <AnimatePresence>
        {removedProductName && (
          <RemoveSuccessMessage productName={removedProductName} />
        )}
      </AnimatePresence>
    </div>
  );
}