"use client";
import React, { useState } from "react"; // 👈 useState import kora holo
// import Image from "next/image";

import { Inter } from "next/font/google";

import { useGetProductCategoriesQuery } from "@/app/store/slices/services/product/productApi";
import Image from "next/image";
import Loader from "../Loader";

const inter = Inter({ subsets: ["latin"] });

const CategorySidebar = ({
  onSelectCategory,
}: {
  onSelectCategory: (id: number | null) => void;
}) => {
  const { data: categoriesData, isLoading } = useGetProductCategoriesQuery();
  const allCategories = categoriesData?.results || [];
  const [activeCategory, setActiveCategory] = useState("All Categories");

  if (isLoading) {
    return (
      <div className="w-full lg:w-58 md:w-full border border-[#E5E5E5] bg-white p-4">
        <Loader text="Loading Categories..." />
      </div>
    );
  }
  console.log(allCategories);
  // 1. State hook: Default active category hobe "All Categories"

  // 2. Click Handler function: Category name ke active category hishebe set korbe
  const handleCategoryClick = (categoryName: string, id: number | null) => {
    setActiveCategory(categoryName);
    onSelectCategory(id);
    // Ekhane apni parent component-ke janate paren ba product filter korte paren
    console.log(`Category selected: ${categoryName}, id: ${id}`);
  };

  return (
    <div
      className={` w-full lg:w-58 md:w-full shadow border border-[#E5E5E5] bg-white p-4`}
    >
      <ul className="space-y-1">
        {/* All Categories Item */}
        <li
          onClick={() => handleCategoryClick("All Categories", null)}
          className={`
            flex items-center justify-between p-2 cursor-pointer transition-colors
            ${activeCategory === "All Categories"
              ? "bg-amber-50 text-amber-900 border-l-4 border-amber-600"
              : "text-gray-700 hover:bg-gray-100 border-l-4 border-transparent"
            }
          `}
        >
          <div className="flex items-center">
            <span
              className={`${inter.className} text-[14px] leading-5 font-medium`}
            >
              All Categories
            </span>
          </div>
        </li>

        {/* Dynamic Categories From API */}
        {allCategories.map((category, index) => {
          // 3. Check kora hocche ei category-ti ki active state-er shathe match kore?
          const isActive = category.title === activeCategory;

          return (
            <li
              key={index}
              // 4. Click event add kora holo
              onClick={() => handleCategoryClick(category.title, category.id)}
              className={`
                flex items-center justify-between p-2 cursor-pointer transition-colors
                ${isActive
                  ? "bg-amber-50 text-amber-900 border-l-4 border-amber-600" // Active style
                  : "text-gray-700 hover:bg-gray-100 border-l-4 border-transparent" // Inactive style
                }
              `}
            >
              <div className="flex items-center">
                {/* Image Component (Commented out) */}
                {/* {ImageSrc && ( */}
                  <Image
                    src={category.icon}
                    alt={category.title}
                    width={20}
                    height={20}
                    className="mr-3"
                  />
                {/* )} */}
                <span
                  className={`${inter.className} text-[14px] leading-5 font-medium`}
                >
                  {category.title}
                </span>
              </div>
              {/* Count */}
              {category.total_products !== null && (
                <span
                  className={`${inter.className} text-[12px] leading-[16px]`}
                >
                  ({category.total_products})
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategorySidebar;