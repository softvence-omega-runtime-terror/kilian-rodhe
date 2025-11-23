"use client";

import React, { useState } from "react"; // 👈 Import useState
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Button1Props {
  text: string;
  title: string;
  image?: string;
}

const Button1 = ({ text, image, title }: Button1Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // 👈 New state for loading

  // Function to handle the click event and navigate
  const handleClick = () => {
    setIsLoading(true); // 👈 Start loading state

    let destination = "/pages/collections";

    if (title === "Men’s Collections") {
      destination = "/pages/man-collections";
    } else if (title === "Women’s Collections") {
      destination = "/pages/woman-collections";
    } else if (title === "Kid’s Collections") {
      destination = "/pages/children-collections";
    } else if (title === "Other Products Collections") {
      destination = "/pages/others-collections";
    }

    // Call router.push to navigate
    router.push(destination);

    // Note: Since router.push() is client-side, the loading state will automatically
    // reset when the component on the destination page mounts.
    // We don't need to manually set setIsLoading(false) here.
  };

  // Determine the content to show inside the button
  const buttonContent = isLoading ? (
    // Loader Icon (Using a simple SVG spinning animation)
    <span className="flex items-center">
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Loading...
    </span>
  ) : (
    // Default content
    <>
      {text}
      {image && <Image src={image} alt="icon" width={16} height={16} />}
    </>
  );

  return (
    <button
      className={`mt-6 border w-full border-white px-5 py-2.5 text-[14px] font-medium tracking-wider flex items-center justify-center gap-2 transition-all ${
        isLoading ? "opacity-70 cursor-wait" : "hover:bg-white hover:text-black"
      }`} // 👈 Add styling for loading state
      style={{ fontFamily: "'Jost', sans-serif" }}
      onClick={handleClick}
      disabled={isLoading} // 👈 Disable the button during loading
    >
      {buttonContent}
    </button>
  );
};

export default Button1;