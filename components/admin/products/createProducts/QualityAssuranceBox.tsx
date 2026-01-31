"use client"

import Image from 'next/image';
import qualityIcon from "@/public/image/admin/products/quality.svg";

function QualityAssuranceBox() {
  return (
    <div className="flex flex-col  px-4 p-6 bg-[#ECF3FF] border border-[#BEDBFF] rounded-xl mt-6">
      <div className="flex items-center  mb-2">
        <Image src={qualityIcon} alt="quality" height={24} width={24} />
        <h4 className="text-lg font-semibold ml-3 text-gray-800">
          Quality Assurance
        </h4>
      </div>
      <p className="text-sm text-gray-700 mt-1">
        All products support <strong>300 DPI</strong> quality checks to ensure
        crisp, professional printing results. Customers will be notified if
        their uploaded designs don&apos;t meet quality standards.
      </p>
    </div>
  );
  
}

export default QualityAssuranceBox
