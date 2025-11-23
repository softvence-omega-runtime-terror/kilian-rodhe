import React from "react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import PremiunCollectionTshirt from "@/components/premiunCollectionTshirt";
import DSCRsection from "@/components/dscrSection";
import MayAlsoLike from "@/components/mayAlsoLike";
import CustomDesignStudio from "@/components/customSignStdio";
const page = () => {
  return (
    <>
      <Navbar />
      <PremiunCollectionTshirt />
      <DSCRsection />
      <MayAlsoLike />
      <CustomDesignStudio />
      <Footer />
    </>
  );
};

export default page;
