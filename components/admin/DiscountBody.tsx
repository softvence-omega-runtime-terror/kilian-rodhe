import React, { useState } from "react";
import {
  Plus,
  Sparkles,
  CheckCircle,
  Truck,
  UserPlus,
  Infinity,
  ArrowLeft,
} from "lucide-react";

import ManualDiscountForm from "./ManualDiscount";
import CsvDiscountForm from "./emailsComponent/CsvDiscount";

// --- Tab Navigation Data (Primary Tabs) ---
const tabs = ["Manage Codes", "Email Sending", "Automation", "Analytics"];

// -----------------------------------------------------------------
// 1. CreateDiscountCodePage (The page that opens when "Create" is clicked)
// -----------------------------------------------------------------
interface CreateDiscountCodePageProps {
  onBack: () => void; // Function to go back to the main view
}

const CreateDiscountCodePage: React.FC<CreateDiscountCodePageProps> = ({
  onBack,
}) => {
  const [activeSubTab, setActiveSubTab] = useState("Manual");
  const subTabs = ["Manual", "Import CSV"];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="p-3 mb-8 bg-white rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Sub-Tab Navigation (Manual / Import CSV) */}
        <div className="flex flex-wrap space-x-2 border border-gray-300 bg-white p-1 rounded-xl shadow-sm w-fit mb-12">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-all
                ${activeSubTab === tab
                  ? "bg-gray-900 text-white shadow-md" // Active sub-tab style
                  : "text-gray-600 hover:bg-gray-50" // Inactive sub-tab style
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content based on Sub-Tab */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {activeSubTab === "Manual" ? "Create Discount Codes" : "Import Discount Codes"}
        </h1>
        <p className="text-gray-600 mb-8">
          {activeSubTab === "Manual"
            ? "Generate a new series of unique discount codes."
            : "Upload a CSV file to import existing codes."}
        </p>

        {/* Content based on Sub-Tab */}
        <div className="mt-12">
          {activeSubTab === "Manual" ? <ManualDiscountForm /> : <CsvDiscountForm />}
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------
// 2. CreateDiscountCard (The card on the Manage Codes tab)
// -----------------------------------------------------------------
const CreateDiscountCard: React.FC<{ onCreateClick: () => void }> = ({
  onCreateClick,
}) => {
  return (
    <div className="p-6 md:p-8 rounded-2xl bg-linear-to-br from-indigo-50 to-purple-50 border-2 border-[#e9d4ff]">
      <div className="flex items-start">
        {/* Sparkle Icon with Background */}
        <div className="bg-white p-2.5 rounded-xl mr-4 shadow-md">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Create Custom Discount Codes
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl">
            Quickly create powerful discount codes with advanced features like
            free shipping, new customer exclusivity, unlimited or one-time use,
            and more.
          </p>

          {/* Feature Icons */}
          <div className="flex flex-wrap items-center space-x-4 mb-8 text-sm font-medium text-gray-700">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1.5" />
              One-Time Use
            </span>
            <span className="flex items-center">
              <Truck className="w-4 h-4 text-green-500 mr-1.5" />
              Free Shipping
            </span>
            <span className="flex items-center">
              <UserPlus className="w-4 h-4 text-green-500 mr-1.5" />
              New Customer Only
            </span>
            <span className="flex items-center">
              <Infinity className="w-4 h-4 text-green-500 mr-1.5" />
              Limited/Unlimited
            </span>
          </div>

          {/* "Try It Now" Button (calls the function to switch view) */}
          <button
            onClick={onCreateClick}
            className="flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium shadow-lg transition-all transform hover:scale-[1.02] bg-linear-to-r from-indigo-600 to-purple-600"
          >
            Try It Now →
          </button>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------
// 3. DiscountPage (Main Controller Component)
// -----------------------------------------------------------------
const DiscountPage: React.FC = () => {
  // State for Primary Tabs ("Manage Codes", "Email Sending", etc.)
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // State to switch between the Dashboard and the Code Creation view
  const [isCreating, setIsCreating] = useState(false);

  // Function to render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Manage Codes":
        // Pass the setIsCreating function down to the card
        return <CreateDiscountCard onCreateClick={() => setIsCreating(true)} />;
      case "Email Sending":
        return (
          <div className="p-6 text-gray-500">
            Email Sending dashboard content will go here.
          </div>
        );
      case "Automation":
        return (
          <div className="p-6 text-gray-500">
            Automation rules and triggers go here.
          </div>
        );
      case "Analytics":
        return (
          <div className="p-6 text-gray-500">
            Discount code performance analytics go here.
          </div>
        );
      default:
        return <CreateDiscountCard onCreateClick={() => setIsCreating(true)} />;
    }
  };

  // ⚠️ CONDITIONAL RENDERING: Render the creation page if isCreating is true
  if (isCreating) {
    return <CreateDiscountCodePage onBack={() => setIsCreating(false)} />;
  }

  // Render the main dashboard page
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* --- Header Section (Tabs and Button) --- */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          {/* Tab Navigation */}
          <div
            className="flex flex-wrap space-x-2 border-2 
            border-[#e8e3dc] bg-white p-1 rounded-xl shadow-sm mb-4 sm:mb-0"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg transition-all
                  ${activeTab === tab
                    ? "bg-gray-100 text-gray-900 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Create Custom Discount Code Button (Gradient) */}
          {/* This button also sets isCreating to true */}
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center px-4 py-2.5 rounded-xl text-white font-semibold transition-all shadow-lg transform hover:scale-[1.01] bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Custom Discount Code
          </button>
        </header>

        {/* --- Content Area --- */}
        <main className="mt-6">{renderTabContent()}</main>
      </div>
    </div>
  );
};

export default DiscountPage;
