import React from "react";

import right from "@/public/image/admin/Discount/right.svg";
import mail from "@/public/image/admin/Discount/mail.svg";
import increnent from "@/public/image/admin/Discount/increament.svg";
import Image from "next/image";

const ExportReports = () => {
  //  derfice dummy data for the report cards 
  const reports = [
    {
      title: "Performance Report",
      description: "Detailed analytics CSV",
      icon: <Image src={increnent} alt="icon" height={20} width={20} />,
      iconBgColor: "bg-purple-50",
    },
    {
      title: "Email Report",
      description: "Campaign metrics CSV",
      icon: <Image src={mail} alt="icon" height={20} width={20} />,
      iconBgColor: "bg-blue-50",
    },
    {
      title: "Redemption Report",
      description: "All redemptions CSV",
      icon: <Image src={right} alt="icon" height={20} width={20} />,
      iconBgColor: "bg-green-50",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl border border-solid border-black/10 my-8">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Export Reports
      </h2>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.title}
            className="p-6 bg-white border border-gray-200 rounded-lg text-center flex flex-col items-center justify-center transition duration-300 hover:shadow-md cursor-pointer"
          >
            {/* Icon Container */}
            <div
              className={`w-14 h-14 ${report.iconBgColor} rounded-lg flex items-center justify-center mb-4`}
            >
              {report.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {report.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500">{report.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportReports;
