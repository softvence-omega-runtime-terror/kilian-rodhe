import React, { useState, useEffect } from "react";

//  Add the missing type here
interface DesignOption {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

// 🔹 Add onDesignChange prop
interface DesignSelectorFieldProps {
  onDesignChange?: (selected: string[]) => void;
}

const DesignSelectorField: React.FC<DesignSelectorFieldProps> = ({
  onDesignChange,
}) => {
  const designOptions: DesignOption[] = [
    {
      key: "ai",
      title: "AI Generated",
      subtitle: "Adobe Firefly",
      icon: <span className="text-xl font-bold text-purple-600">AI</span>,
    },
    {
      key: "letter",
      title: "Letter/Number",
      subtitle: "Manual creator",
      icon: <span className="text-xl font-bold text-blue-600">Aa</span>,
    },
    {
      key: "custom",
      title: "Custom Upload",
      subtitle: "300 DPI Required",
      icon: "📷",
    },
  ];

  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([]);

  const handleDesignClick = (key: string) => {
    setSelectedDesigns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // 🔹 Notify parent whenever selection changes
  useEffect(() => {
    if (onDesignChange) {
      onDesignChange(selectedDesigns);
    }
  }, [selectedDesigns, onDesignChange]);

  // --- Helper function to get card styles ---
  const getCardStyles = (key: string, isSelected: boolean) => {
    // Styles for AI and Letter/Number (Purple gradient)
    if (key === "ai" || key === "letter") {
      const baseClasses =
        "bg-gradient-to-br from-[#faf5ff] to-[#f3e8ff] border-[#e9d4ff]";
      if (isSelected) {
        return `${baseClasses} ring-2 ring-purple-500 border-purple-400`;
      }
      return `${baseClasses} hover:border-purple-300`;
    }

    // Styles for Custom Upload (Green gradient)
    if (key === "custom") {
      const baseClasses =
        "bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border-[#b9f8cf]";
      if (isSelected) {
        return `${baseClasses} ring-2 ring-green-500 border-green-400`;
      }
      return `${baseClasses} hover:border-green-300`;
    }

    // Default fallback
    return "bg-white border-gray-300 hover:border-gray-400";
  };
  // ----------------------------------------

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Supported Design Options
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Select which design methods are available for this product
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {designOptions.map((option) => {
          const isSelected = selectedDesigns.includes(option.key);
          const customClasses = getCardStyles(option.key, isSelected);

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => handleDesignClick(option.key)}
              className={`p-4 border rounded-xl text-left transition-all duration-200 ${customClasses}`}
            >
              <div
                className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                  option.key === "ai"
                    ? "bg-purple-100 border-2 border-purple-200"
                    : option.key === "letter"
                    ? "bg-blue-100 border-2 border-blue-200"
                    : "bg-green-100 border-2 border-green-200"
                }`}
              >
                {option.icon}
              </div>
              <p className="font-semibold text-gray-800">{option.title}</p>
              <p className="text-xs text-[#6b6560] mt-0.5">{option.subtitle}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DesignSelectorField;
