// pages/index.js
"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Jost, Roboto_Flex } from "next/font/google";

// --- Imported Assets ---
import arrowIcon from "@/public/image/shopIcon/arrowIcon.svg";
import colorStarIcon from "@/public/image/shopIcon/colorStar.svg";
import nextButtonImage from "@/public/image/shopIcon/nextArrow.svg";
import { ISavedProduct, useDeleteSavedProductMutation } from "@/app/store/slices/services/product/productApi";
import { useAppSelector } from "@/app/store/hooks";
import { selectIsAuthenticated } from "@/app/store/slices/authSlice";
import ToastMessage from "../ToastMessage";

const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const roboto = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto",
});

interface BottomCardProps {
  items: ISavedProduct[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  startIndex: number;
}

export default function BottomCard({
  items,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  startIndex
}: BottomCardProps) {
  const router = useRouter();
  const [removedProductName, setRemovedProductName] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const MAX_PAGES_TO_SHOW = 6;

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

    if (actualTotalPages < MAX_PAGES_TO_SHOW) {
      startPage = 1;
      endPage = actualTotalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  const handleCustomize = (id: number) => {
    router.push(`/pages/customise?id=${id}`);
  };

  const handleOrderNow = () => {
    if (!isAuthenticated) {
      setToast({ message: "Please login to order products.", type: 'error' });
      return;
    }
    router.push(`/pages/shipping`);
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
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

  const defaultClasses = `${roboto.className} sm:w-10 sm:h-10 flex items-center justify-center rounded-md border-[1.5px] sm:text-[18px] transition-colors duration-150 border-[#795548] bg-white text-[#795548] hover:bg-stone-50`;
  const activeClasses = `${roboto.className} sm:w-10 sm:h-10 flex items-center justify-center rounded-md border-[1.5px] sm:text-[18px] transition-colors duration-150 border-[#795548] bg-[#795548] text-white`;

  const startResult = totalCount === 0 ? 0 : startIndex + 1;
  const endResult = Math.min(startIndex + 2 + items.length, totalCount);

  if (items.length === 0 && currentPage === 1) return null;

  return (
    <div className={`bg-[#FAFAFA] ${jostFont.className}`}>
      <main className="max-w-8xl mx-auto lg:px-20 py-8">
        <div className="flex flex-wrap justify-center md:justify-start gap-x-[30px] gap-y-10">
          {items.map((savedItem, index) => {
            const product = savedItem.product;
            const imageUrl = product.images?.[0]?.image;

            return (
              <motion.div
                key={savedItem.id}
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
                <div className="relative w-full h-80 overflow-hidden mb-6 bg-gray-100 flex items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover brightness-[0.9]"
                    />
                  ) : (
                    <span className="text-gray-400 font-medium text-lg uppercase tracking-widest">No Image</span>
                  )}

                  <div className="absolute top-6 right-14 flex space-x-2">
                    <motion.button
                      onClick={() => handleRemoveProduct(savedItem.id, product.name)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      className="transition-transform duration-100 p-1 rounded-full shadow-sm"
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
                    onClick={() => handleCustomize(product.id)}
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
                        alt="Star Rating"
                        width={14}
                        height={14}
                        className="inline"
                      />
                    ))}
                  </div>

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
            );
          })}
        </div>
      </main>

      <AnimatePresence>
        {toast && (
          <ToastMessage
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {removedProductName && (
          <RemoveSuccessMessage productName={removedProductName} />
        )}
      </AnimatePresence>

      <footer>
        <div className="flex flex-col mb-12 sm:flex-row lg:px-20 items-center justify-between p-4 sm:p-6 space-y-4 sm:space-y-0">
          <motion.div
            className={`${roboto.className} text-base font-normal sm:text-[20px] text-[#636363] order-2 sm:order-1 mt-4 sm:mt-0`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Showing {startResult}-{endResult} of {totalCount} results
          </motion.div>

          <div className="flex space-x-1 sm:space-x-2 order-1 sm:order-2">
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