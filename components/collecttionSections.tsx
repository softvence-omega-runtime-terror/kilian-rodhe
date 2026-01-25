"use client";

import React from "react";
import TitleText from "./titleText";
import Card from "./Card";
import { useGetProductCategoriesQuery } from "../app/store/slices/services/product/productApi";



const CollectionSections = () => {
  const { data, isLoading } = useGetProductCategoriesQuery();
  const cardWrapperClasses =
    "w-full max-w-sm sm:w-[calc(50%-1.5rem)] md:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)] xl:w-[calc(25%-1.5rem)]";

  const categories = data?.results?.slice(0, 4) || [];

  return (
    <>
      {/* Outer container for centering and padding */}
      <div className="container mx-auto px-4">
        <TitleText />

        {/* Responsive Card Layout Container (4 Cards) */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-4 xl:gap-6 mt-10">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            categories.map((item) => (
              <div key={item.id} className={cardWrapperClasses}>
                <Card
                  image={item.image}
                  tranding={item.is_popular ? 1 : 0}
                  title={item.title}
                  dis={item.description}
                  productNumber={item.total_products}
                  ageGroup={item.age_range?.length || 0}
                  ageValue={item.age_range && item.age_range.length > 0}
                  customAgeRanges={item.age_range?.map(
                    (age) => `${age.start}-${age.end}`
                  )}
                  categoryId={item.id}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CollectionSections;
