import React from "react";
import { TrendingUp } from "lucide-react"; // Using TrendingUp icon for "Top Performing Series"

// --- Sub-Component: SeriesCard ---
type SeriesCardProps = {
  seriesName: string;
  totalCodes: number;
  redeemed: number;
  rate: string;
  revenue: string;
  progress: number;
};

const SeriesCard: React.FC<SeriesCardProps> = ({
  seriesName,
  totalCodes,
  redeemed,
  rate,
  revenue,
  progress,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border-[1.2px] border-solid border-black/10 mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{seriesName}</h3>
        <span className="text-xl font-bold text-green-600">{revenue}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-500 font-medium mb-1">Total Codes</p>
          <p className="text-gray-900 font-semibold">{totalCodes}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium mb-1">Redeemed</p>
          <p className="text-gray-900 font-semibold">{redeemed}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium mb-1">Rate</p>
          <p className="text-gray-900 font-semibold">{rate}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// main component

const TopPerformingSeries = () => {
  const seriesData = [
    {
      seriesName: "SUMMER2025",
      totalCodes: 3516,
      redeemed: 2842,
      rate: "80.8%",
      revenue: "€45,280",
      progress: 80.8,
    },
    {
      seriesName: "WELCOME10",
      totalCodes: 892,
      redeemed: 756,
      rate: "84.8%",
      revenue: "€12,340",
      progress: 84.8,
    },
    {
      seriesName: "VIP20",
      totalCodes: 145,
      redeemed: 132,
      rate: "91.0%",
      revenue: "€18,920",
      progress: 91.0,
    },
    {
      seriesName: "FLASH15",
      totalCodes: 2341,
      redeemed: 1567,
      rate: "66.9%",
      revenue: "€28,450",
      progress: 66.9,
    },
  ];

  return (
    <div className="mt-6 bg-gray-50 ">
      {" "}
      {/* Adjusted padding and background for full page effect */}
      <div className=" bg-white p-6 rounded-xl border-[1.2px] border-solid border-black/10">
        {" "}
        {/* Container for the whole section */}
        {/* Header */}
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 mr-2 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-800">
            Top Performing Series
          </h2>
        </div>
        {/* List of Series Cards */}
        <div>
          {seriesData.map((series, index) => (
            <SeriesCard
              key={index}
              seriesName={series.seriesName}
              totalCodes={series.totalCodes}
              redeemed={series.redeemed}
              rate={series.rate}
              revenue={series.revenue}
              progress={series.progress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopPerformingSeries;
