"use client";

import React, { useState } from "react";

/* =========================
   Types
========================= */
interface SizeSelectorFieldProps {
  label: string;
  description: string;
  required?: boolean;
  onSizeChange?: (sizes: string[]) => void;
}

/* =========================
   Component
========================= */
const SizeSelectorField: React.FC<SizeSelectorFieldProps> = ({
  label,
  description,
  required = true,
  onSizeChange,
}) => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const sizeGroups = [
    {
      title: "Clothing Sizes",
      type: "clothing",
      sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    },
    {
      title: "Kids Sizes",
      type: "kids",
      sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    },
    {
      title: "Mug Sizes",
      type: "mug",
      sizes: ["11oz", "15oz", "20oz"],
    },
  ];

  const universalSize = "One Size (Universal)";

  const handleSizeClick = (size: string) => {
    const isUniversal = size === universalSize;
    let newSelected: string[] = [];

    if (selectedSizes.includes(size)) {
      newSelected = selectedSizes.filter((s) => s !== size);
    } else if (isUniversal) {
      newSelected = [size];
    } else if (selectedSizes.includes(universalSize)) {
      newSelected = [size];
    } else {
      newSelected = [...selectedSizes, size];
    }

    setSelectedSizes(newSelected);
    if (onSizeChange) {
      onSizeChange(newSelected);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-lg font-semibold text-gray-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <p className="mb-4 text-sm text-gray-500">{description}</p>

      {sizeGroups.map((group, idx) => (
        <div key={group.type}>
          <h4 className="mb-3 mt-4 text-base font-medium text-gray-700">
            {group.title}
          </h4>

          <div className="mb-4 flex flex-wrap gap-3">
            {group.sizes.map((size) => {
              const isSelected = selectedSizes.includes(size);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeClick(size)}
                  disabled={selectedSizes.includes(universalSize)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200
                    ${isSelected
                      ? "border-[#8B6F47] bg-[#8B6F47] text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {idx < sizeGroups.length - 1 && (
            <hr className="my-2 border-gray-200" />
          )}
        </div>
      ))}

      <div className="pt-4">
        <button
          type="button"
          onClick={() => handleSizeClick(universalSize)}
          className={`rounded-xl border px-6 py-2 text-sm font-semibold transition-all duration-200
            ${selectedSizes.includes(universalSize)
              ? "border-[#8B6F47] bg-[#8B6F47] text-white"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }
          `}
        >
          {universalSize}
        </button>
      </div>
    </div>
  );
};

export default SizeSelectorField;
