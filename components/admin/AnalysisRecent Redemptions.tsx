import React from "react";
import { CheckCircle } from "lucide-react"; // Using CheckCircle icon for "Recent Redemptions"

// --- Sub-Component: RedemptionItem ---
type RedemptionItemProps = {
  code: string;
  email: string;
  savedAmount: string;
  timeAgo: string;
  totalAmount: string;
};

const RedemptionItem: React.FC<RedemptionItemProps> = ({ code, email, savedAmount, timeAgo, totalAmount }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start">
        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2 mr-3"></span>{" "}
        {/* Blue dot */}
        <div>
          <p className="text-gray-800 font-semibold">{code}</p>
          <p className="text-sm text-gray-600">{email}</p>
          <p className="text-xs text-green-600 font-medium">
            Saved {savedAmount}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-gray-800 font-semibold">{totalAmount}</p>
        <p className="text-sm text-gray-500">{timeAgo}</p>
      </div>
    </div>
  );
};

// main component for the remdemptions
const RecentRedemptions = () => {
  const redemptionData = [
    {
      code: "SUMMER-A1B2C3",
      email: "john@example.com",
      savedAmount: "€4.50",
      totalAmount: "€45.00",
      timeAgo: "2 min ago",
    },
    {
      code: "WELCOME-X9Y8Z7",
      email: "sarah@example.com",
      savedAmount: "€3.20",
      totalAmount: "€32.00",
      timeAgo: "5 min ago",
    },
    {
      code: "VIP-V5U4T3",
      email: "mike@example.com",
      savedAmount: "€17.80",
      totalAmount: "€89.00",
      timeAgo: "12 min ago",
    },
    {
      code: "FLASH-F1G2H3",
      email: "emma@example.com",
      savedAmount: "€8.40",
      totalAmount: "€56.00",
      timeAgo: "18 min ago",
    },
  ];

  return (
    <div className="mt-6 h-full bg-gray-50">
      {" "}
      {/* Overall page background */}
      <div className=" bg-white p-6 rounded-xl border-[1.2px] border-solid border-black/10">
        {" "}
        {/* Container for the whole section */}
        {/* Header */}
        <div className="flex items-center mb-6">
          <CheckCircle className="w-6 h-6 mr-2 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Redemptions
          </h2>
        </div>
        {/* List of Redemption Items */}
        <div>
          {redemptionData.map((item, index) => (
            <RedemptionItem
              key={index}
              code={item.code}
              email={item.email}
              savedAmount={item.savedAmount}
              totalAmount={item.totalAmount}
              timeAgo={item.timeAgo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentRedemptions;
