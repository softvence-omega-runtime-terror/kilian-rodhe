import React, { useState } from "react";
import HeaderElement from "@/components/shop/headerElements";
import PropularWeek from "./propularWeek";
import BottomCard from "./bottomCard";
import { useGetProductsQuery, IProductQueryParams } from "@/app/store/slices/services/product/productApi";

const ShopRightSideElements = ({ filters }: { filters: IProductQueryParams }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: productsData, isLoading } = useGetProductsQuery({
    ...filters,
    page: currentPage
  });

  const products = Array.isArray(productsData?.data?.categories) ? productsData.data.categories : [];
  // const totalCount = 0; // The API doesn't seem to return total count yet, or maybe it does in 'count'
  // Let's check IProductResponse again. It had success, message, data, errors. 
  // Wait, I noticed ICategoryResponse had results and count, but IProductResponse only has data.
  // I should check if I should update the API response interface.

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-4 lg:px-0 md:px-0">
      <HeaderElement />
      <PropularWeek
        products={products?.slice(0, 2)}
        isLoading={isLoading}
      />
      <BottomCard
        products={products?.slice(2)}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        hasMore={products?.length >= 8} // Simple check for now
      />
    </div>
  );
};

export default ShopRightSideElements;
