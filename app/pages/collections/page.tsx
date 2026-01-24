"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TopHeader from "./TopHeader";
import MiddleBody from "./MiddleBody";
import CustomDesignStudio from "../../../components/customSignStdio";
import { useGetProductCategoriesQuery } from "@/app/store/slices/services/product/productApi";

const Page = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const { data: categoriesData } = useGetProductCategoriesQuery();

  const currentCategory = categoriesData?.results?.find(
    (cat) => cat.id.toString() === categoryId
  );

  return (
    <>
      <Navbar />
      <TopHeader
        title={currentCategory?.title}
        description={currentCategory?.description}
        productCount={currentCategory?.total_products}
        backgroundImage={currentCategory?.image}
      />
      <MiddleBody currentCategory={currentCategory} />
      <CustomDesignStudio />
      <Footer />
    </>
  );
};

export default Page;
