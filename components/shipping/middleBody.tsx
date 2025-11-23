// ShippingPage.js (or .tsx)

"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

// Fonts
import { Jost, Cormorant_Garamond } from "next/font/google";

// Assets
import mug from "@/public/image/shipping/mug.png";
import userIcon from "@/public/image/shipping/Icon (1).svg";
import mailIcon from "@/public/image/shipping/Icon (2).svg";
import phone from "@/public/image/shipping/Icon (3).svg";
import location from "@/public/image/shipping/Icon (4).svg";
import track from "@/public/image/shipping/Icon (5).svg";
import base from "@/public/image/shipping/Icon (6).svg";
import rightIcon from "@/public/image/shipping/Icon (7).svg";
import clock from "@/public/image/shipping/Icon (8).svg";
import whiteRightIcon from "@/public/image/shipping/Icon.svg";
import leftArrow from "@/public/image/shipping/Icon (9).svg";

// Fonts
const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic"],
});

const ACCENT_COLOR = "#8b6f47";

// ---------------- Types ----------------

interface ShippingMethodProps {
  title: string;
  desc: string;
  price: string;
  isSelected: boolean;
  onClick: () => void;
}

interface StepProps {
  index: number;
  label: string;
  currentStepIndex?: number;
}

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  Icon?: StaticImageData;
}

// ---------------- Shipping Method Component ---------------- (No changes)

const ShippingMethod: React.FC<ShippingMethodProps> = ({
  title,
  desc,
  price,
  isSelected,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between border-2 rounded-xl p-3 cursor-pointer transition duration-200 ease-in-out ${
      isSelected
        ? "border-2 border-transparent ring-2 ring-offset-1 ring-offset-[#fdfbf9] ring-[#a07d48] bg-[#fdfbf9]"
        : "border-gray-200 hover:border-[#a07d48]/50"
    }`}
  >
    <div>
      <p className="font-medium text-gray-800 text-sm">{title}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
    <p className="font-semibold text-gray-800 text-sm">{price}</p>
  </div>
);

// ---------------- Step Component ---------------- (No changes)

const Step: React.FC<StepProps> = ({ index, label, currentStepIndex = 1 }) => {
  const isCompleted = index < currentStepIndex;
  const isCurrent = index === currentStepIndex;

  let circleClasses =
    "w-10 h-10 flex items-center justify-center rounded-full text-lg flex-shrink-0 transition-all duration-300";

  if (isCompleted || isCurrent) {
    circleClasses +=
      " bg-[#a07d48] text-white font-medium shadow-md shadow-[#a07d48]/30";
  } else {
    circleClasses += " bg-[#f7f5f3] text-[#a07d48] font-medium";
  }

  let labelClasses =
    "text-sm ml-2 transition-colors duration-300 whitespace-nowrap";

  if (isCompleted || isCurrent) {
    labelClasses += " font-semibold text-gray-800";
  } else {
    labelClasses += " text-gray-400";
  }

  const lineIsSolid = index <= currentStepIndex;

  return (
    <div className="flex items-center">
      {index > 0 && (
        <div
          className={`h-0.5 w-12 mx-2 ${
            lineIsSolid && index === 1 ? "bg-[#a07d48]" : "bg-gray-300"
          }`}
        ></div>
      )}

      <div className="flex items-center">
        <div className={circleClasses}>
          {isCompleted ? (
            <Image
              src={whiteRightIcon}
              width={16}
              height={16}
              alt="Completed"
            />
          ) : (
            index + 1
          )}
        </div>
        <span className={labelClasses}>{label}</span>
      </div>
    </div>
  );
};

// ---------------- Input Field Component ---------------- (No changes)

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type,
  required,
  Icon,
}) => (
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-1">
      {label} {required && <span className="text-[#a07d48]">*</span>}
    </label>

    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Image src={Icon} alt={`${label} icon`} width={16} height={16} />
        </div>
      )}

      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-inset focus:ring-gray-300 outline-none placeholder-gray-400 text-sm transition duration-150 ${
          Icon ? "pl-10" : "pl-4"
        }`}
      />
    </div>
  </div>
);

// ---------------- Main Component (MODIFIED) ----------------

const ShippingPage: React.FC = () => {
  const [selectedShipping, setSelectedShipping] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false); // 👈 NEW STATE FOR LOADER
  const router = useRouter();

  const shippingOptions = [
    { title: "Standard Shipping", desc: "5–7 business days", price: "€5.99" },
    { title: "Express Shipping", desc: "2–3 business days", price: "€15.99" },
    { title: "Overnight Delivery", desc: "Next business day", price: "€29.99" },
  ];

  const ACTIVE_STEP_INDEX = 1;

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // 👈 START LOADER

    // In a real scenario, you might send data to an API here.
    // We use setTimeout to simulate the delay before navigation.
    setTimeout(() => {
        router.push("/pages/payment");
        // We don't need to set isLoading(false) because the page redirects.
    }, 500); // Simulate a short processing delay
  };

  return (
    <div className="min-h-screen bg-[#f9f7f5] font-sans flex flex-col items-center py-10">
      {/* Back Link */}
      <div className="w-full md:container px-3 lg:container mb-5">
        <button
          onClick={() => router.push("/pages/shop")}
          className="font-medium text-[14px] text-[#6B6560] hover:text-gray-900 transition flex items-center"
        >
          <Image src={leftArrow} alt="Back arrow" width={16} height={16} />
          <span className="ml-3">Back to Shop</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full border-b pb-3 border-t pt-3 bg-[#ffffff] border-[#E8E3DC] flex flex-col sm:flex-row items-center justify-center mb-12 sm:px-0">
        {["Product Details", "Shipping Info", "Payment"].map((label, index) => (
          <Step
            key={index}
            index={index}
            label={label}
            currentStepIndex={ACTIVE_STEP_INDEX}
          />
        ))}
      </div>

      {/* Main container */}
      <div className="w-full max-w-5xl rounded-xl border border-gray-100 flex flex-col lg:flex-row gap-10 p-8 md:p-12">
        {/* Left: Shipping Form */}
        <div className="flex-1 border-2 border-[#E8E3DC] rounded-xl p-4 bg-white">
          <h2
            className={`${cormorantItalic.className} text-[24px] font-semibold mb-6 text-[#1A1410]`}
          >
            Shipping Information
          </h2>

          <form
            onSubmit={handleContinueToPayment}
            className={`${jostFont.className} space-y-6`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                placeholder="John"
                required
                Icon={userIcon}
              />
              <InputField
                label="Last Name"
                placeholder="Doe"
                required
                Icon={userIcon}
              />
            </div>

            <InputField
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              required
              Icon={mailIcon}
            />

            <InputField
              label="Phone Number"
              placeholder="+49 123 456 7890"
              Icon={phone}
            />

            <InputField
              label="Street Address"
              placeholder="Street address, apartment, suite, etc."
              required
              Icon={location}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Postal Code" placeholder="10115" required />
            </div>

            {/* Shipping Method */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Shipping Method
              </label>

              <div className="space-y-3">
                {shippingOptions.map((item, i) => (
                  <ShippingMethod
                    key={i}
                    {...item}
                    isSelected={i === selectedShipping}
                    onClick={() => setSelectedShipping(i)}
                  />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 text-sm"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isLoading} // 👈 DISABLE BUTTON WHILE LOADING
                style={{ backgroundColor: ACCENT_COLOR }}
                className={`
                    px-8 py-2 text-white rounded-lg transition duration-150 text-sm font-medium shadow-md shadow-[#a07d48]/20 flex items-center justify-center
                    ${isLoading ? 'opacity-70 cursor-wait' : 'hover:bg-[#8a6a3f]'}
                `}
              >
                {isLoading ? (
                  <>
                    {/* Spinning Loader SVG */}
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
                    Processing...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Order Summary (No changes) */}
        <div
          className={`${jostFont.className} w-full lg:w-[350px] bg-[#ffffff] rounded-xl p-6 border-2 border-[#E8E3DC] self-start`}
        >
          <h3 className="font-semibold text-gray-800 mb-6 text-lg">
            Order Summary
          </h3>

          <div className="flex items-start space-x-4 mb-4">
            <div className="w-16 h-16 flex-shrink-0 relative rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={mug}
                alt="Premium Coffee Mug"
                className="object-cover w-full h-full"
                fill
                sizes="64px"
              />
            </div>

            <div className="pt-1">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-800 text-sm">
                  Premium Coffee Mug
                </p>
                <Image
                  src={whiteRightIcon}
                  alt="Arrow icon"
                  width={16}
                  height={16}
                />
              </div>

              <p className="text-xs text-gray-500">Size: M • Color: Black</p>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal (1 item)</span>
              <span>€24.99</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>€5.99</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (19% VAT)</span>
              <span>€4.75</span>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          <div className="flex justify-between font-bold text-lg text-gray-800">
            <span>Total</span>
            <span style={{ color: ACCENT_COLOR }}>€35.73</span>
          </div>

          <ul
            className={`${jostFont.className} text-xs text-gray-500 mt-5 space-y-2`}
          >
            <li className="flex items-center">
              <span className="mr-2 text-sm">
                <Image src={track} width={16} height={16} alt="track" />
              </span>
              Free shipping over $150
            </li>

            <li className="flex items-center">
              <span className="mr-2 text-sm">
                <Image src={base} width={16} height={16} alt="base" />
              </span>
              GDPR compliant & secure
            </li>

            <li className="flex items-center">
              <span className="mr-2 text-sm">
                <Image src={rightIcon} width={16} height={16} alt="right" />
              </span>
              300 DPI quality guaranteed
            </li>

            <li className="flex items-center">
              <span className="mr-2 text-sm">
                <Image src={clock} width={16} height={16} alt="clock" />
              </span>
              5–7 business days delivery
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;