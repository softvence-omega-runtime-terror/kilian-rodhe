import { Mail } from "lucide-react";
import React from "react";
import { EmailLogs } from "@/app/store/slices/services/adminService/adminStats/adminStatsApi";

interface EmailCampaignPerformanceProps {
  data?: EmailLogs;
}

const EmailCampaignPerformance: React.FC<EmailCampaignPerformanceProps> = ({ data }) => {
  // define metrics based on api data
  const metrics = [
    {
      value: data?.total_emails_sent?.toLocaleString() ?? "0",
      label: "Emails Sent",
      bgColor: "bg-blue-50",
      textColor: "text-blue-900",
    },
    {
      value: `${data?.email_success_rate ?? 0}%`,
      label: "Delivery Rate",
      bgColor: "bg-green-50",
      textColor: "text-green-900",
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
