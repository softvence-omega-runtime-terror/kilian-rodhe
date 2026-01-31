"use client";

import React from "react";
import { DollarSign, Percent, CheckCircle, Users } from "lucide-react";

import IncreamentIcon from "@/public/image/admin/Discount/increament.svg";
import DecreamentIcon from "@/public/image/admin/Discount/decrement.svg";
import Image from "next/image";

import AnaliseTopPerformance from "./AnaliseTopPerformance";
import AnalysisRecent from "./AnalysisRecent Redemptions";
import AnalysisEmailPerformance from "./AnalysisEmailPerformance";
import AnalysisTime from "./AnalysisTime";
import AnalysisExport from "./AnalysisExport";

import { useGetAdminDiscountUsageStatsQuery } from "@/app/store/slices/services/adminService/adminStats/adminStatsApi";

type ChangeColor = "green" | "red";

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconTextColor: string;
  title: string;
  value: string;
  change: string;
  changeColor: ChangeColor;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  iconBgColor,
  iconTextColor,
  title,
  value,
  change,
  changeColor,
}) => {
  const changeClasses = `flex items-center text-sm font-semibold ${changeColor === "green" ? "text-green-600" : "text-red-600"
    }`;

  const TrendImage = changeColor === "green" ? IncreamentIcon : DecreamentIcon;

  return (
    <div className="bg-white p-6 rounded-xl border-[1.2px] border-solid border-black/10 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgColor}`}
        >
          <Icon className={`w-5 h-5 ${iconTextColor}`} />
        </div>
        <div className={changeClasses}>
          <Image
            src={TrendImage}
            alt={changeColor === "green" ? "Increment" : "Decrement"}
            className="w-4 h-4 mr-1"
          />
          {change}
        </div>
      </div>

      <h3 className="text-3xl font-bold text-gray-900 mb-4">{value}</h3>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const { data, isLoading, isError } = useGetAdminDiscountUsageStatsQuery();

  if (isLoading) return <div>Loading analytics...</div>;
  if (isError || !data) return <div>Failed to load analytics.</div>;

  const meta = data;


  const metrics: MetricCardProps[] = [
    {
      icon: DollarSign,
      iconBgColor: "bg-green-100",
      iconTextColor: "text-green-500",
      title: "Total Revenue from Codes",
      value: `€${meta?.financial?.total_revenue_from_discounted_orders ?? 0}`,
      change: "",
      changeColor: "green",
    },
    {
      icon: Percent,
      iconBgColor: "bg-blue-100",
      iconTextColor: "text-blue-500",
      title: "Average Discount Used",
      value: `€${meta?.financial?.average_discounted_amount ?? 0}`,
      change: "",
      changeColor: "green",
    },
    {
      icon: CheckCircle,
      iconBgColor: "bg-purple-100",
      iconTextColor: "text-purple-500",
      title: "Code Redemption Rate",
      value: `${meta?.financial?.code_redemption_rate ?? 0}%`,
      change: "",
      changeColor: "green",
    },
    {
      icon: Users,
      iconBgColor: "bg-orange-100",
      iconTextColor: "text-orange-500",
      title: "Unique Customers",
      value: String(meta?.financial?.unique_customers ?? 0),
      change: "",
      changeColor: "green",
    },
  ];


  return (
    <div className=" bg-gray-50 ">
      <div className="mb-8">
        <h1 className="text-[#0a0a0a] font-semibold text-[30px]">
          Analytics & Reports
        </h1>
        <p className="text-gray-500 mt-1">
          Track performance and insights for your discount codes
        </p>
      </div>

      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <AnaliseTopPerformance />
        </div>

        <div>
          <AnalysisRecent />
        </div>
      </div>

      <div>
        <AnalysisEmailPerformance />
      </div>

      <div>
        <AnalysisTime />
      </div>

      <div>
        <AnalysisExport />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
