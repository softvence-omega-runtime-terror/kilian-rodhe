"use client";
import React, { useState } from "react";
import BottomCard from "@/components/save-products-body/bottomCard";
import BottomTop from "@/components/save-products-body/bottomTop";
import { useGetSavedProductsQuery } from "@/app/store/slices/services/product/productApi";

const ITEMS_PER_PAGE = 5;

const MiddleBody = () => {
  const { data: savedData, isLoading, error } = useGetSavedProductsQuery();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#795548]/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#795548] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-[#795548] font-medium tracking-widest uppercase text-sm">
          Loading Saved Products
        </p>
      </div>
    );
  }

  // Handle 401 or other errors
  if (error) {
    const isUnauthorized = (error as { status?: number })?.status === 401;
    return (
      <div className="text-center py-20 text-gray-600">
        <p className="text-xl font-semibold uppercase tracking-widest">
          {isUnauthorized ? "Please Login" : "Oops! Something went wrong"}
        </p>
        <p className="mt-2 text-sm italic">
          {isUnauthorized
            ? "You need to be logged in to view saved products."
            : "We couldn't fetch your saved items at this time."}
        </p>
      </div>
    );
  }

  const allItems = savedData?.results || [];
  const totalCount = allItems.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = allItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Divide items: first 2 for top, rest for bottom
  const topItems = pageItems.slice(0, 2);
  const bottomItems = pageItems.slice(2);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (allItems.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        <p className="text-xl font-semibold uppercase tracking-widest">No saved products found.</p>
        <p className="mt-2 text-sm italic">Items you save will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <BottomTop items={topItems} />
      <BottomCard
        items={bottomItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalCount={totalCount}
        startIndex={startIndex}
      />
    </>
  );
};

export default MiddleBody;
