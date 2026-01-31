import React from "react";

// Define the data for the timeline
const codeUsageData = [
  { day: "Mon", percentage: 65, total: 78, hasPattern: false },
  { day: "Tue", percentage: 78, total: 94, hasPattern: false },
  { day: "Wed", percentage: 52, total: 62, hasPattern: false },
  // This bar has a special hatched/patterned segment
  { day: "Thu", percentage: 88, total: 106, hasPattern: true },
  { day: "Fri", percentage: 95, total: 114, hasPattern: false },
  { day: "Sat", percentage: 42, total: 50, hasPattern: false },
  { day: "Sun", percentage: 35, total: 42, hasPattern: false },
];

// custom gradient for the progress bar
const gradientClasses = "bg-gradient-to-r from-purple-500 to-blue-500";

const CodeUsageTimeline = () => {
  return (
    <div className="p-6 bg-white rounded-xl border border-solid border-black/10  my-8">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Code Usage Timeline (Last 7 Days)
      </h2>

      {/* Timeline Items */}
      <div className="space-y-4">
        {codeUsageData.map((item) => (
          <div key={item.day} className="flex items-center gap-4">
            {/* Day Label (Mon, Tue, etc.) */}
            <div className="w-12 text-sm text-gray-700 font-medium">
              {item.day}
            </div>

            {/* Progress Bar Container */}
            <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
              {/* Filled Segment */}
              <div
                className={`h-full flex items-center justify-end ${gradientClasses} rounded-full`}
                style={{ width: `${item.percentage}%` }}
              >
                {/* Special segment for 'Thu' to match the pattern */}
                {item.hasPattern && (
                  <div
                    className="absolute h-8"
                    // Adjust the right positioning to place the pattern correctly
                    // This is a stylistic approximation based on the image (around 1/5th from the right edge of the blue fill)
                    style={{
                      width: "calc(100% / 5)", // Use a small percentage of the total bar width
                      right: "0",
                      top: "0",
                    }}
                  >
                    {/* The patterned effect is tricky with pure Tailwind. 
                        We use a custom class or inline style for the diagonal lines. 
                        For this example, we use a simple border/outline effect 
                        and a white background for the 'inner' portion to simulate the break. 
                        A true hatched pattern often requires a background image or SVG.
                        Here's a simpler approach matching the color blocks:
                    */}
                    <div
                      className={`h-full ${gradientClasses} border-l-4 border-white`}
                      style={{ width: "100%" }}
                    >
                      <span className="text-white text-xs font-bold mr-1">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Percentage Text (only if not using the patterned segment) */}
                {!item.hasPattern && (
                  <span className="text-white text-xs font-bold mr-2">
                    {item.percentage}%
                  </span>
                )}
              </div>

              {/* A simple implementation for the patterned bar is often better achieved 
                  by calculating two separate percentage fills:
                  e.g., Thu: 80% solid blue, 8% patterned.
              */}
            </div>

            {/* Total Codes Count */}
            <div className="w-16 text-right text-sm text-gray-500">
              {item.total} codes
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeUsageTimeline;
