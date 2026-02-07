// components/SendDiscountCodes.jsx
import { Send, UploadIcon, Users2Icon } from "lucide-react";
import DiscountEmailPReview from "@/components/admin/DiscountEmailPreview";
import React, { useState } from "react";
import DiscountSendButton from "../DiscountSendButton";

// Define recipient types for easy state management
const RECIPIENT_TYPES = {
  INDIVIDUAL: "individual",
  EMAIL_LIST: "emailList",
  USER_SEGMENT: "userSegment",
};

const SendDiscountCodes = () => {
  // State to track the active recipient type (which card/tab is selected)
  const [activeRecipientType, setActiveRecipientType] = useState(
    RECIPIENT_TYPES.INDIVIDUAL
  );

  // Helper function to determine the card's styling
  const getCardClasses = (type: string) => {
    const isSelected = activeRecipientType === type;
    // Removed flex-1 here as grid controls the width
    return `p-6 rounded-xl cursor-pointer transition duration-150 ease-in-out ${isSelected
      ? "border-2 border-purple-500 bg-purple-50"
      : "border border-gray-200 hover:border-gray-300"
      }`;
  };

  // Helper function to determine the icon's styling
  const getIconClasses = (type: string) => {
    const isSelected = activeRecipientType === type;
    // We remove mr-2 because the icon is now on its own line above the text
    return `w-6 h-6 mb-3 ${isSelected ? "text-purple-700" : "text-[#9810FA]"}`;
  };

  // Helper function to determine the text's styling
  const getTextClasses = (type: string) => {
    const isSelected = activeRecipientType === type;
    return `font-semibold ${isSelected ? "text-purple-700" : "text-gray-700"}`;
  };

  // --- Conditional Content Rendering ---
  const renderRecipientContent = () => {
    switch (activeRecipientType) {
      case RECIPIENT_TYPES.INDIVIDUAL:
        return (
          // Content for Individual
          <section className="space-y-2 py-6">
            <h3 className="text-sm font-medium text-gray-700">
              Recipient Email
            </h3>
            <input
              type="email"
              placeholder="customer@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </section>
        );
      case RECIPIENT_TYPES.EMAIL_LIST:
        return (
          // Content for Email List (CSV Upload)
          <section className="space-y-2 py-6">
            <h3 className="text-sm font-medium text-gray-700">
              Upload Email List (CSV)
            </h3>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-50 text-gray-500 hover:border-purple-500 transition duration-150">
              <UploadIcon className="w-6 h-6 mb-2" />
              <p className="text-sm font-medium">
                Drag and drop your CSV file here, or click to select.
              </p>
              <input type="file" accept=".csv" className="sr-only" />
            </div>
            <p className="text-xs text-gray-500">
              The CSV should contain a column named &quot;email&quot;. Optional columns:
              &quot;name&quot;.
            </p>
          </section>
        );
      case RECIPIENT_TYPES.USER_SEGMENT:
        return (
          // Content for User Segment
          <section className="space-y-2 py-6">
            <h3 className="text-sm font-medium text-gray-700">
              Select User Segment
            </h3>
            <div className="relative">
              <select
                defaultValue=""
                className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="" disabled>
                  Select a segment...
                </option>
                <option value="high_spenders">High Spenders (500 users)</option>
                <option value="new_signups">
                  Last 30 days Signups (120 users)
                </option>
                <option value="lapsed_users">
                  Inactive for 6 months (30 users)
                </option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-500">
              Codes will be sent to all users in the selected segment.
            </p>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className=" bg-gray-50 ">
      <div className=" bg-white border border-black/10 rounded-xl p-8 ">
        {/* Header */}
        <div className="flex items-center text-xl mb-6 font-semibold text-gray-800">
          <Send className="w-5 h-5 mr-2 text-[#9810FA]" />
          Send Discount Codes
        </div>

        {/* Recipient Type Selection (The Tab Buttons) */}
        <section className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Recipient Type</h3>

          {/* RESPONSIVE GRID IMPLEMENTATION */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Individual Card */}
            <div
              className={getCardClasses(RECIPIENT_TYPES.INDIVIDUAL)}
              onClick={() => setActiveRecipientType(RECIPIENT_TYPES.INDIVIDUAL)}
            >
              {/* CHANGED to flex-col for vertical stacking */}
              <div className="flex flex-col items-start">
                <Users2Icon
                  className={getIconClasses(RECIPIENT_TYPES.INDIVIDUAL)}
                />
                <p className={getTextClasses(RECIPIENT_TYPES.INDIVIDUAL)}>
                  Individual
                </p>
                <p className="text-sm text-gray-500">Send to one person</p>
              </div>
            </div>

            {/* Email List Card */}
            <div
              className={getCardClasses(RECIPIENT_TYPES.EMAIL_LIST)}
              onClick={() => setActiveRecipientType(RECIPIENT_TYPES.EMAIL_LIST)}
            >
              {/* CHANGED to flex-col for vertical stacking */}
              <div className="flex flex-col items-start">
                <UploadIcon
                  className={getIconClasses(RECIPIENT_TYPES.EMAIL_LIST)}
                />
                <p className={getTextClasses(RECIPIENT_TYPES.EMAIL_LIST)}>
                  Email List
                </p>
                <p className="text-sm text-gray-500">Upload CSV list</p>
              </div>
            </div>

            {/* User Segment Card */}
            <div
              className={getCardClasses(RECIPIENT_TYPES.USER_SEGMENT)}
              onClick={() =>
                setActiveRecipientType(RECIPIENT_TYPES.USER_SEGMENT)
              }
            >
              {/* CHANGED to flex-col for vertical stacking */}
              <div className="flex flex-col items-start">
                <Users2Icon
                  className={getIconClasses(RECIPIENT_TYPES.USER_SEGMENT)}
                />
                <p className={getTextClasses(RECIPIENT_TYPES.USER_SEGMENT)}>
                  User Segment
                </p>
                <p className="text-sm text-gray-500">From database</p>
              </div>
            </div>
          </div>
          {/* END OF RESPONSIVE GRID */}
        </section>

        <hr className="border-gray-100 mt-6" />

        {/* Conditional Recipient Input/Selection */}
        {renderRecipientContent()}

        {/* Discount Code Series - REMAINS CONSTANT */}
        <section className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">
            Discount Code Series
          </h3>
          <div className="relative">
            <select
              defaultValue="SUMMER-A1B2C3D4"
              className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="SUMMER-A1B2C3D4">SUMMER-A1B2C3D4 (10% OFF)</option>
              <option value="FALL-A5Z9C0D3">FALL-A5Z9C0D3 ($5 OFF)</option>
              <option value="SPRIMG-B1B2C0D7">SPRING-B1B2C0D7 (BOGO)</option>
              {/* Add actual options here if needed */}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-500">
            One unique code per recipient will be sent
          </p>
        </section>

        {/* Email Subject - REMAINS CONSTANT */}
        <section className="space-y-2 py-6">
          <h3 className="text-sm font-medium text-gray-700">Email Subject</h3>
          <input
            type="text"
            defaultValue="Your Exclusive Discount Code is Here! 🎉"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 font-medium focus:ring-purple-500 focus:border-purple-500"
          />
        </section>

        {/* Email Message - REMAINS CONSTANT */}
        <section className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Email Message</h3>
          <textarea
            rows={10}
            className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm focus:ring-purple-500 focus:border-purple-500"
            defaultValue={`Hi {name},

Thank you for being a valued customer! Here's your exclusive discount code:

{discount_code}

Use this code at checkout to get {discount_value} off your next purchase.

Happy shopping!
The Tundra Team`}
          />
        </section>

        {/* Variable Buttons - REMAINS CONSTANT */}
        <div className="flex flex-wrap gap-3 pt-2">
          <VariableButton label="{name}" />
          <VariableButton label="{discount_code}" />
          <VariableButton label="{discount_value}" />
          <VariableButton label="{expiry_date}" />
        </div>

        <div className="mt-6">
          <DiscountEmailPReview />
        </div>
        <DiscountSendButton />
      </div>
    </div>
  );
};

// Helper component for the variable buttons
type VariableButtonProps = {
  label: string;
};

const VariableButton = ({ label }: VariableButtonProps) => (
  <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition duration-150">
    {label}
  </button>
);

export default SendDiscountCodes;
