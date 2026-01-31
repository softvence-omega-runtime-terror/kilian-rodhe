import { Mail } from "lucide-react";
import React from "react";

const EmailCampaignPerformance = () => {
  //  derfice dummy data for the email campaign performance
  const metrics = [
    {
      value: "45,892",
      label: "Emails Sent",
      bgColor: "bg-blue-50", // Light blue background
      textColor: "text-blue-900",
    },
    {
      value: "98.5%",
      label: "Delivery Rate",
      bgColor: "bg-green-50", // Light green background
      textColor: "text-green-900",
    },
    {
      value: "42.8%",
      label: "Open Rate",
      bgColor: "bg-purple-50", // Light purple background
      textColor: "text-purple-900",
    },
    {
      value: "18.2%",
      label: "Click Rate",
      bgColor: "bg-amber-50", // Light amber/orange background
      textColor: "text-amber-900",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl border border-solid border-black/10 my-8">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
        <Mail className="h-5 w-5 text-[#9810FA] mr-2" />
        Email Campaign Performance
      </h2>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`p-6 rounded-lg text-center ${metric.bgColor} transition duration-300 hover:shadow-md`}
          >
            {/* Value */}
            <p className={`text-3xl mb-1 ${metric.textColor}`}>
              {metric.value}
            </p>
            {/* Label */}
            <p className="text-sm font-medium text-gray-500">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailCampaignPerformance;
