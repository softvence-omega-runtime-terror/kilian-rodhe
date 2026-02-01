import React, { useMemo } from "react";
import { RedemptionLast7Days } from "@/app/store/slices/services/adminService/adminStats/adminStatsApi";

interface CodeUsageTimelineProps {
  data?: RedemptionLast7Days;
}

const CodeUsageTimeline: React.FC<CodeUsageTimelineProps> = ({ data }) => {
  // Define the order of days for the timeline
  const daysOrder: (keyof RedemptionLast7Days)[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const codeUsageData = useMemo(() => {
    if (!data) return [];

    // Find the maximum value to calculate percentages
    const values = Object.values(data);
    const maxVal = Math.max(...values, 1); // Avoid division by zero

    return daysOrder.map((day) => {
      const value = data[day] || 0;
      const percentage = Math.round((value / maxVal) * 100);
      return {
        day,
        value,
        percentage,
        hasPattern: day === "Thu", // Keep the pattern for Thu as per original design or make it dynamic if needed
      };
    });
  }, [data]);

  // custom gradient for the progress bar
  const gradientClasses = "bg-gradient-to-r from-purple-500 to-blue-500";

  return (
    <div className="p-6 bg-white rounded-xl border border-solid border-black/10 my-8">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Code Usage Timeline (Last 7 Days)
      </h2>

      {/* Timeline Items */}
      <div className="space-y-4">
        {codeUsageData.length > 0 ? (
          codeUsageData.map((item) => (
            <div key={item.day} className="flex items-center gap-4">
              {/* Day Label (Mon, Tue, etc.) */}
              <div className="w-12 text-sm text-gray-700 font-medium">
                {item.day}
              </div>

              {/* Progress Bar Container */}
              <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden relative">
                {/* Filled Segment */}
                <div
                  className={`h-full flex items-center justify-end ${gradientClasses} rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                >
                  {/* Patterned segment logic preserved */}
                  {item.hasPattern && item.percentage > 0 && (
                    <div
                      className="absolute h-8"
                      style={{
                        width: "calc(100% / 5)",
                        right: "0",
                        top: "0",
                      }}
                    >
                      <div
                        className={`h-full ${gradientClasses} border-l-4 border-white flex items-center justify-center`}
                        style={{ width: "100%" }}
                      >
                        <span className="text-white text-xs font-bold mr-1">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Percentage Text */}
                  {!item.hasPattern && item.percentage > 0 && (
                    <span className="text-white text-xs font-bold mr-2">
                      {item.percentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* Total Codes Count */}
              <div className="w-16 text-right text-sm text-gray-500">
                {item.value} codes
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No data available</p>
        )}
      </div>
    </div>
  );
};

export default CodeUsageTimeline;
