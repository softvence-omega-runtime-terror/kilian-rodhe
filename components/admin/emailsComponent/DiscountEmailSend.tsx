// components/admin/emailsComponent/DiscountEmailSend.tsx
import { Send, UploadIcon, Users2Icon } from "lucide-react";
import DiscountEmailPreview from "@/components/admin/DiscountEmailPreview";
import React, { useState, useEffect } from "react";
import { useGetAllDiscountCodesQuery } from "@/app/store/slices/services/adminService/adminPromos/adminPromoApi";
import { useGetAdminDiscountUsageStatsQuery } from "@/app/store/slices/services/adminService/adminStats/adminStatsApi";
import { useGetAllTemplatesQuery } from "@/app/store/slices/services/adminService/smtp/createTemplateApi";
import { useSendDiscountEmailMutation } from "@/app/store/slices/services/adminService/smtp/emailSendingApi";
import toast, { Toaster } from "react-hot-toast";

// Define recipient types for easy state management
const RECIPIENT_TYPES = {
  INDIVIDUAL: "individual",
  EMAIL_LIST: "emailList",
  USER_SEGMENT: "userSegment",
};

const SendDiscountCodes = () => {
  // State to track the active recipient type (which card/tab is selected)
  const [activeRecipientType, setActiveRecipientType] = useState(
    RECIPIENT_TYPES.INDIVIDUAL
  );

  // Form State
  const [recipientEmail, setRecipientEmail] = useState("");
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);
  const [emailSubject, setEmailSubject] = useState("Your Exclusive Discount Code is Here! 🎉");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [emailBody, setEmailBody] = useState("");

  // API Hooks
  // Using getAllDiscountCodes to get details (amount, prefix)
  const { data: discountCodes, isLoading: isLoadingCodes } = useGetAllDiscountCodesQuery();
  // Using getAdminDiscountUsageStats to get Series IDs and Names (since getAllDiscountSeries is broken)
  const { data: usageStats, isLoading: isLoadingUsage } = useGetAdminDiscountUsageStatsQuery();



  const { data: templatesData, isLoading: isLoadingTemplates } = useGetAllTemplatesQuery();
  const [sendDiscountEmail, { isLoading: isSending }] = useSendDiscountEmailMutation();

  const templates = templatesData?.data?.email_templates || [];

  // Merge Data: Usage Stats (IDs) + Discount Codes (Metadata)
  const availableSeries = React.useMemo(() => {
    if (!usageStats?.discount_series_usage) return [];

    // Create a lookup for metadata from codes
    // We map series_name -> { amount, prefix }
    const metadataMap = new Map();
    if (discountCodes) {
      discountCodes.forEach(code => {
        if (!metadataMap.has(code.series_name)) {
          metadataMap.set(code.series_name, {
            amount: code.discount,
            prefix: code.code_prefix
          });
        }
      });
    }

    return usageStats.discount_series_usage.map(series => {
      const metadata = metadataMap.get(series.name) || {};
      return {
        id: series.id,
        name: series.name,
        amount: metadata.amount || "Discount", // Fallback if no matching code found (e.g. no codes active)
        prefix: metadata.prefix || ""
      };
    });
  }, [usageStats, discountCodes]);

  const seriesList = availableSeries;

  // Initialize selected series when data loads
  useEffect(() => {
    if (seriesList && seriesList.length > 0 && !selectedSeriesId) {
      setSelectedSeriesId(seriesList[0].id);
    }
  }, [seriesList, selectedSeriesId]);

  // Handle template selection
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplateId) {
      // Set the first template as default if none is selected
      setSelectedTemplateId(templates[0].id);
      setEmailBody(templates[0].body);
      setEmailSubject(templates[0].subject);
    }
  }, [templates, selectedTemplateId]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = Number(e.target.value);
    setSelectedTemplateId(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setEmailBody(template.body);
      setEmailSubject(template.subject);
    }
  };

  // Find the selected template object
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  // Handle Send
  const handleSend = async () => {
    if (activeRecipientType === RECIPIENT_TYPES.INDIVIDUAL && !recipientEmail) {
      toast.error("Please enter a recipient email.");
      return;
    }
    if (!selectedSeriesId) {
      toast.error("Please select a discount code series.");
      return;
    }
    if (!selectedTemplateId) {
      toast.error("Please select an email template.");
      return;
    }

    try {
      const payload: any = {
        discount_code_series_id: selectedSeriesId,
        email_template_id: selectedTemplateId,
        subject: emailSubject,
        email_body: emailBody, // sending the current body state
      };

      if (activeRecipientType === RECIPIENT_TYPES.INDIVIDUAL) {
        // API expects array of emails
        payload.to_emails = [recipientEmail];
      } else {
        // Implement other types if needed, for now restrict to Individual as requested
        toast.error("Only Individual sending is currently implemented.");
        return;
      }

      await sendDiscountEmail(payload).unwrap();
      toast.success("Discount email sent successfully!");
    } catch (error: any) {
      console.error("Failed to send email:", error);
      toast.error(error?.data?.message || "Failed to send email.");
    }
  };


  // Helper function to determine the card's styling
  const getCardClasses = (type: string) => {
    const isSelected = activeRecipientType === type;
    return `p-6 rounded-xl cursor-pointer transition duration-150 ease-in-out ${isSelected
      ? "border-2 border-purple-500 bg-purple-50"
      : "border border-gray-200 hover:border-gray-300"
      }`;
  };

  // Helper function to determine the icon's styling
  const getIconClasses = (type: string) => {
    const isSelected = activeRecipientType === type;
    return `w-6 h-6 mb-3 ${isSelected ? "text-purple-700" : "text-[#9810FA]"}`;
  };

  // Helper function to determine the text's styling
  const getTextClasses = (type: string) => {
    const isSelected = activeRecipientType === type;
    return `font-semibold ${isSelected ? "text-purple-700" : "text-gray-700"}`;
  };

  // --- Conditional Content Rendering ---
  const renderRecipientContent = () => {
    switch (activeRecipientType) {
      case RECIPIENT_TYPES.INDIVIDUAL:
        return (
          // Content for Individual
          <section className="space-y-2 py-6">
            <h3 className="text-sm font-medium text-gray-700">
              Recipient Email
            </h3>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </section>
        );
      case RECIPIENT_TYPES.EMAIL_LIST:
        return (
          // Content for Email List (CSV Upload)
          <section className="space-y-2 py-6">
            <h3 className="text-sm font-medium text-gray-700">
              Upload Email List (CSV)
            </h3>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-50 text-gray-500 hover:border-purple-500 transition duration-150">
              <UploadIcon className="w-6 h-6 mb-2" />
              <p className="text-sm font-medium">
                Drag and drop your CSV file here, or click to select.
              </p>
              <input type="file" accept=".csv" className="sr-only" />
            </div>
            <p className="text-xs text-gray-500">
              The CSV should contain a column named &quot;email&quot;. Optional columns:
              &quot;name&quot;.
            </p>
          </section>
        );
      case RECIPIENT_TYPES.USER_SEGMENT:
        return (
          // Content for User Segment
          <section className="space-y-2 py-6">
            <h3 className="text-sm font-medium text-gray-700">
              Select User Segment
            </h3>
            <div className="relative">
              <select
                defaultValue=""
                className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="" disabled>
                  Select a segment...
                </option>
                <option value="high_spenders">High Spenders (500 users)</option>
                <option value="new_signups">
                  Last 30 days Signups (120 users)
                </option>
                <option value="lapsed_users">
                  Inactive for 6 months (30 users)
                </option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-500">
              Codes will be sent to all users in the selected segment.
            </p>
          </section>
        );
      default:
        return null;
    }
  };

  // Find the selected series representative (any code from that series to get details)
  const selectedSeries = seriesList.find(s => s.id === selectedSeriesId);

  return (
    <div className=" bg-gray-50 ">
      <div className=" bg-white border border-black/10 rounded-xl p-8 ">
        {/* Header */}
        <div className="flex items-center text-xl mb-6 font-semibold text-gray-800">
          <Send className="w-5 h-5 mr-2 text-[#9810FA]" />
          Send Discount Codes
        </div>

        {/* Recipient Type Selection (The Tab Buttons) */}
        <section className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Recipient Type</h3>

          {/* RESPONSIVE GRID IMPLEMENTATION */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Individual Card */}
            <div
              className={getCardClasses(RECIPIENT_TYPES.INDIVIDUAL)}
              onClick={() => setActiveRecipientType(RECIPIENT_TYPES.INDIVIDUAL)}
            >
              <div className="flex flex-col items-start">
                <Users2Icon
                  className={getIconClasses(RECIPIENT_TYPES.INDIVIDUAL)}
                />
                <p className={getTextClasses(RECIPIENT_TYPES.INDIVIDUAL)}>
                  Individual
                </p>
                <p className="text-sm text-gray-500">Send to one person</p>
              </div>
            </div>

            {/* Email List Card */}
            <div
              className={getCardClasses(RECIPIENT_TYPES.EMAIL_LIST)}
              onClick={() => setActiveRecipientType(RECIPIENT_TYPES.EMAIL_LIST)}
            >
              <div className="flex flex-col items-start">
                <UploadIcon
                  className={getIconClasses(RECIPIENT_TYPES.EMAIL_LIST)}
                />
                <p className={getTextClasses(RECIPIENT_TYPES.EMAIL_LIST)}>
                  Email List
                </p>
                <p className="text-sm text-gray-500">Upload CSV list</p>
              </div>
            </div>

            {/* User Segment Card */}
            <div
              className={getCardClasses(RECIPIENT_TYPES.USER_SEGMENT)}
              onClick={() =>
                setActiveRecipientType(RECIPIENT_TYPES.USER_SEGMENT)
              }
            >
              <div className="flex flex-col items-start">
                <Users2Icon
                  className={getIconClasses(RECIPIENT_TYPES.USER_SEGMENT)}
                />
                <p className={getTextClasses(RECIPIENT_TYPES.USER_SEGMENT)}>
                  User Segment
                </p>
                <p className="text-sm text-gray-500">From database</p>
              </div>
            </div>
          </div>
          {/* END OF RESPONSIVE GRID */}
        </section>

        <hr className="border-gray-100 mt-6" />

        {/* Conditional Recipient Input/Selection */}
        {renderRecipientContent()}

        {/* Discount Code Series */}
        <section className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">
            Discount Code Series
          </h3>
          <div className="relative">
            {isLoadingUsage ? (
              <p className="text-sm text-gray-500">Loading series...</p>
            ) : (
              <select
                value={selectedSeriesId || ""}
                onChange={(e) => setSelectedSeriesId(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="" disabled>Select a series...</option>
                {seriesList.map((series) => (
                  <option key={series.id} value={series.id}>
                    {series.name} ({series.amount})
                  </option>
                ))}
              </select>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-500">
            One unique code per recipient will be sent
          </p>
        </section>


        {/* Email Template Selection */}
        <section className="space-y-2 py-6">
          <h3 className="text-sm font-medium text-gray-700">Select Template</h3>
          <div className="relative">
            {isLoadingTemplates ? (
              <p className="text-sm text-gray-500">Loading templates...</p>
            ) : (
              <select
                onChange={handleTemplateChange}
                value={selectedTemplateId || ""}
                className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="" disabled>Select a template...</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.body_type})</option>
                ))}
              </select>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </section>


        {/* Email Subject */}
        <section className="space-y-2 pb-6">
          <h3 className="text-sm font-medium text-gray-700">Email Subject</h3>
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 font-medium focus:ring-purple-500 focus:border-purple-500"
          />
        </section>

        {/* Email Message */}
        <section className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Email Message</h3>
          <textarea
            rows={10}
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm focus:ring-purple-500 focus:border-purple-500"
          />
        </section>

        <div className="mt-6">
          <DiscountEmailPreview
            subject={emailSubject}
            body={emailBody}
            contentType={selectedTemplate?.body_type || "text"}
            discountCode={selectedSeries?.prefix ? `${selectedSeries.prefix}****` : (selectedSeries?.name || "CODE")}
            discountValue={selectedSeries?.amount || "Discount"}
          />
        </div>

        <div className="mt-8">
          <button
            onClick={handleSend}
            disabled={isSending}
            className="w-full py-2 px-6 bg-purple-700 text-white font-semibold text-lg rounded-lg
                            transition duration-200 ease-in-out 
                           hover:bg-purple-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center space-x-2">
              <Send className="w-6 h-6 transform rotate-45 -mt-1 text-[#ffffff]" />
              <span>{isSending ? "Sending..." : "Send Now"}</span>
            </span>
          </button>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};



export default SendDiscountCodes;
