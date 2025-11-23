import React, { useState } from "react";
import Swal from "sweetalert2"; // 👈 Import SweetAlert2

/* -----------------------------
    ToggleSwitch Component
----------------------------- */

interface ToggleSwitchProps {
  label: string;
  description: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  isChecked,
  onChange,
}) => (
  <div className="flex items-center bg-[#FAF9F7] rounded-xl px-4 justify-between py-4">
    <div>
      <p className="text-gray-900 font-medium">{label}</p>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>

    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div
        className="
          w-11 h-6 bg-gray-200 rounded-full peer
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:w-5 after:h-5 after:bg-white after:border after:border-gray-300
          after:rounded-full after:transition-all
          peer-checked:bg-black peer-checked:after:translate-x-full
        "
      ></div>
    </label>
  </div>
);

/* -----------------------------
    FilterItem Component
----------------------------- */

interface FilterItemProps {
  label: string;
  isChecked?: boolean;
}

const FilterItem: React.FC<FilterItemProps> = ({
  label,
  isChecked: initialChecked = true,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(initialChecked);

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };

  return (
    <ToggleSwitch
      label={label}
      description={`Filter item for ${label}`}
      isChecked={isChecked}
      onChange={handleToggle}
    />
  );
};

/* -----------------------------
    Data Sets
----------------------------- */

const genderCategories: string[] = [
  "Men's Collection",
  "Women's Collection",
  "Kids' Collection"
];

const ageGroups: string[] = [
  "Kids (0-18)",
  "Young Adults (19-30)",
  "Adults (31-50)",
  "Seniors (51+)",
];

const productCategories: string[] = [
  "T-Shirts",
  "Hoodies",
  "Mugs",
  "Caps",
  "Pants",
  "Sweatshirts",
  "Tank Tops",
  "Tote Bags",
  "Phone Cases",
];

/* -----------------------------
    FilterPage Component
----------------------------- */

const FilterPage: React.FC = () => {
  const [isButtonActive] = useState<boolean>(true);

  const activeClass = "bg-[#8B6F47] hover:opacity-90";
  const inactiveClass = "bg-gray-400 cursor-not-allowed";

  const buttonClasses = `
    w-full py-3 rounded-md text-white font-semibold transition-all duration-200
    ${isButtonActive ? activeClass : inactiveClass}
  `;

  // 👈 New function to handle button click and SweetAlert
  const handleSave = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setTimeout(() => {
      Swal.fire({
        title: "Changes Saved! 🎉",
        text: "Your store information has been updated successfully.",
        icon: "success",
        confirmButtonText: "Close",
        confirmButtonColor: "#8B6A47",
        timer: 2500,
        timerProgressBar: true,
      });
    }, 500);
  };

  return (
    <div className="font-sans">
      <div className="space-y-8">
        {/* Gender Categories + Age Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gender Categories */}
          <div className="bg-white rounded-xl border border-[#E8E3DC]">
            <h2 className="text-xl p-4 font-medium text-gray-800 border-b border-[#E8E3DC]">
              Gender Categories
            </h2>
            <div className="p-4 space-y-3">
              {genderCategories.map((category) => (
                <FilterItem key={category} label={category} />
              ))}
            </div>
          </div>

          {/* Age Groups */}
          <div className="bg-white rounded-xl border border-[#E8E3DC]">
            <h2 className="text-xl p-4 font-medium text-gray-800 border-b border-[#E8E3DC]">
              Age Groups
            </h2>
            <div className="p-4 space-y-3">
              {ageGroups.map((group) => (
                <FilterItem key={group} label={group} />
              ))}
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-xl border border-[#E8E3DC]">
          <h2 className="text-xl p-4 font-medium text-gray-800 border-b border-[#E8E3DC]">
            Product Categories
          </h2>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
            {productCategories.map((product) => (
              <FilterItem key={product} label={product} />
            ))}
          </div>

          <div className="mt-8 p-4">
            <button
              className={buttonClasses}
              onClick={handleSave}
              disabled={!isButtonActive}
            >
              Add New Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
