"use client";
import React from "react";
import { Jost } from "next/font/google";

const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

interface LoaderProps {
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Loading Collections", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 w-full ${className}`}>
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#D4AF37]/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
      {text && (
        <p className={`${jostFont.className} mt-4 text-[#D4AF37] font-medium tracking-widest uppercase text-sm`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
