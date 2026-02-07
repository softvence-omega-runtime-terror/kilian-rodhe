import React, { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import Image, { StaticImageData } from "next/image";

import RawGenerateIcon from "@/public/image/admin/Discount/grandIcon.svg";
import RawClockIcon from "@/public/image/admin/Discount/clockIcon.svg";
import RawCrossIcon from "@/public/image/admin/Discount/crossIcon.svg";
import RawRightIcon from "@/public/image/admin/Discount/rightIcon.svg";

import ManualDiscount from "../ManualDiscount";
import CsvDiscount from "./CsvDiscount";
import DiscountEmailSend from "./DiscountEmailSend";
import DiscountAutomation from "../DiscountAutomation";
import CreateDiscountCard from "../CreateDiscountCard";
import DiscountAnalysis from "../DiscountAnalysis";
import AnalysisBodyTable from "../AnalysisBodyTable";
import { useGetAdminDiscountUsageStatsQuery } from "@/app/store/slices/services/adminService/adminStats/adminStatsApi";
import EmailTemplateTab from "./EmailTemplateTab";

/* -----------------------------------------
    SAFE SVG TYPE (supports both component & image)
------------------------------------------ */
type SvgIconType =
  | React.ComponentType<React.SVGProps<SVGSVGElement>>
  | StaticImageData;

/* -----------------------------------------
    Handle default export for SVG (no any)
------------------------------------------ */
const getSvgIcon = (mod: unknown): SvgIconType => {
  return typeof mod === "object" && mod !== null && "default" in mod
    ? // @ts-expect-error - SVG imports might have a default property depending on loader
    mod.default
    : // @ts-expect-error - Fallback for other module formats
    mod;
};

const GenerateIcon = getSvgIcon(RawGenerateIcon);
const ClockIcon = getSvgIcon(RawClockIcon);
const CrossIcon = getSvgIcon(RawCrossIcon);
const RightIcon = getSvgIcon(RawRightIcon);

/* -----------------------------------------
    Interfaces
------------------------------------------ */
interface CardData {
  id: number;
  icon: SvgIconType;
  iconBgColor: string;
  iconColor: string;
  value: string;
  label: string;
  footerText: string;
  footerTextColor: string;
}

interface CreateDiscountCodePageProps {
  onBack: () => void;
}

/* -----------------------------------------
    Tabs
------------------------------------------ */
const tabs = ["Manage Codes", "Email Sending", "Automation", "Analytics", "Email Template"];

/* -----------------------------------------
    DashboardCard Component
------------------------------------------ */
const DashboardCard: React.FC<{ data: CardData }> = ({ data }) => {
  const Icon = data.icon;

  return (
    <div className="bg-white rounded-xl p-5 border-2 border-[#e8e3dc] flex flex-col justify-between">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${data.iconBgColor}`}
      >
        {typeof Icon === "function" ? (
          <Icon className="w-5 h-5" />
        ) : (
          <Image src={Icon} alt={data.label} className="w-5 h-5" />
        )}
      </div>

      <div className="mb-4">
        <p className="text-2xl font-semibold text-gray-900">{data.value}</p>
        <p className="text-sm text-gray-600 mt-0.5">{data.label}</p>
      </div>

      <p className={`text-xs font-medium ${data.footerTextColor}`}>
        {data.footerText}
      </p>
    </div>
  );
};

/* -----------------------------------------
    DashboardCards Component (DYNAMIC)
------------------------------------------ */
const DashboardCards: React.FC = () => {
  const { data, isLoading, isError } = useGetAdminDiscountUsageStatsQuery();

  if (isLoading || isError || !data) return null;

  const overview = data.overview;

  const dashboardCardsData: CardData[] = [
    {
      id: 1,
      icon: GenerateIcon,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      value: String(overview.total_codes_created),
      label: "Total Codes Generated",
      footerText: "",
      footerTextColor: "text-green-600",
    },
    {
      id: 2,
      icon: RightIcon,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
      value: String(overview.total_codes_redeemed),
      label: "Redeemed",
      footerText: "",
      footerTextColor: "text-green-600",
    },
    {
      id: 3,
      icon: ClockIcon,
      iconBgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      value: String(overview.active_codes),
      label: "Active Codes",
      footerText: "",
      footerTextColor: "text-green-600",
    },
    {
      id: 4,
      icon: CrossIcon,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
      value: String(overview.invalid_codes),
      label: "Expired/Invalid",
      footerText: "",
      footerTextColor: "text-red-600",
    },
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCardsData.map((card) => (
          <DashboardCard key={card.id} data={card} />
        ))}
      </div>
    </div>
  );
};

/* -----------------------------------------
    CreateDiscountCodePage Component
------------------------------------------ */
const CreateDiscountCodePage: React.FC<CreateDiscountCodePageProps> = ({
  onBack,
}) => {
  const [activeSubTab, setActiveSubTab] = useState("Manual");
  const subTabs = ["Manual", "Import CSV"];

  return (
    <div className="p-4 sm:p-6 bg-gray-50">
      <button
        onClick={onBack}
        className="p-3 mb-8 bg-white rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex flex-wrap space-x-2 px-2 border-2 border-[#E8E3DC] bg-[#FAF9F7] p-1 rounded-xl w-fit mb-4">
        {subTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeSubTab === tab
              ? "bg-[#8B6F47] text-white"
              : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeSubTab === "Manual" ? <ManualDiscount /> : <CsvDiscount />}
    </div>
  );
};

/* -----------------------------------------
    Main DiscountPage Component
------------------------------------------ */
const DiscountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isCreating, setIsCreating] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Manage Codes":
        return <AnalysisBodyTable />;
      case "Email Sending":
        return <DiscountEmailSend />;
      case "Automation":
        return <DiscountAutomation />;
      case "Analytics":
        return <DiscountAnalysis />;
      case "Email Template":
        return <EmailTemplateTab />;
      default:
        return null;
    }
  };

  if (isCreating) {
    return <CreateDiscountCodePage onBack={() => setIsCreating(false)} />;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50">
      <DashboardCards />

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 mt-4">
        <div className="flex flex-wrap space-x-2 border-2 border-[#e8e3dc] bg-white p-1 rounded-xl mb-4 sm:mb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab
                ? "bg-[#8B6F47] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center px-4 py-2.5 rounded-xl text-white font-semibold transition-all
           transform hover:scale-[1.01] bg-gradient-to-r from-indigo-500 to-purple-600 
           hover:from-indigo-600 hover:to-purple-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Custom Discount Code
        </button>
      </header>

      <div className="mb-6">
        <CreateDiscountCard onCreateClick={() => setIsCreating(true)} />
      </div>

      <main className="mt-6">{renderTabContent()}</main>
    </div>
  );
};

export default DiscountPage;
