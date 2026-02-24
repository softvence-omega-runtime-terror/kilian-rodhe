import React from "react";

// Import statements...

import DiscountTitle from "@/components/admin/DiscountTitle";
import CsvBody from "../CsvBody";

const CsvDiscountForm: React.FC = () => {
  return (
    <>
      <DiscountTitle
        text="Import Discount Codes (CSV)"
        paragraph="Bulk import discount codes from a CSV file"
      />
      <CsvBody />
    </>
  );
};

export default CsvDiscountForm;
