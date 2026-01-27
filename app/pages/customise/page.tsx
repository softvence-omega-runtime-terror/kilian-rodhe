"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import PremiunCollectionTshirt from "@/components/premiunCollectionTshirt";
import DSCRsection from "@/components/dscrSection";
import MayAlsoLike from "@/components/mayAlsoLike";
import CustomDesignStudio from "@/components/customSignStdio";

const CustomiseContent = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  return (
    <>
      <PremiunCollectionTshirt productId={productId ? parseInt(productId) : undefined} />
      <DSCRsection productId={productId ? parseInt(productId) : undefined} />
      <MayAlsoLike productId={productId ? parseInt(productId) : undefined} />
      <CustomDesignStudio />
    </>
  );
};

const Page = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <CustomiseContent />
      </Suspense>
      <Footer />
    </>
  );
};

export default Page;
