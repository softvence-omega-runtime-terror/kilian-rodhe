import React from "react";
import HomeHeroBanner from "@/components/admin/HomeHeroBanner";
import CmsHomeMidPageBanner from "@/components/admin/CmsHomeMidPageBanner";
import CmsHomeProductSystem from "@/components/admin/CmsHomeProductSystem";
import CmsHomeTechknolodgy from "@/components/admin/CmsHomeTechknology";
import CmsHomeFeatureIcon from "@/components/admin/CmsHomeFeatureIcon";
const CmsHome = () => {
  return (
    <>
      <HomeHeroBanner />
      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 ">
        <CmsHomeMidPageBanner />
        <CmsHomeProductSystem />
        <CmsHomeTechknolodgy />
        <CmsHomeFeatureIcon />
      </div>
    </>
  );
};

export default CmsHome;
