"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

/* =========================
   Types
========================= */
interface ColorSelectorFieldProps {
  label: string;
  description: string;
  colors: {
    value: string;
    label: string;
    hex: string;
  }[];
  required?: boolean;
  onColorChange?: (colors: string[]) => void;
}

/* =========================
   Component
========================= */
const ColorSelectorField: React.FC<ColorSelectorFieldProps> = ({
  label,
  description,
  colors,
  required = true,
  onColorChange,
}) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const handleColorClick = (value: string) => {
    const newSelected = selectedColors.includes(value)
      ? selectedColors.filter((c) => c !== value)
      : [...selectedColors, value];

    setSelectedColors(newSelected);
    if (onColorChange) {
      onColorChange(newSelected);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-lg font-semibold text-gray-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <p className="mb-4 text-sm text-gray-500">{description}</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {colors.map((color) => {
          const isSelected = selectedColors.includes(color.value);

          return (
            <button
              key={color.value}
              type="button"
              onClick={() => handleColorClick(color.value)}
              className={`flex items-center justify-start rounded-xl border p-3 transition-all duration-200
                ${isSelected
                  ? "border-[#8B6F47] bg-[#8B6F47]/10 ring-2 ring-[#8B6F47]/50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                }
              `}
            >
              <span
                className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 shadow-sm ${color.value === "white" ? "border-gray-400" : ""
                  }`}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <Check
                    className={`h-4 w-4 ${color.value === "white" || color.value === "yellow"
                        ? "text-[#8B6F47]"
                        : "text-white"
                      }`}
                  />
                )}
              </span>

              <span
                className={`font-medium ${isSelected ? "text-[#8B6F47]" : "text-gray-700"
                  }`}
              >
                {color.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelectorField;

