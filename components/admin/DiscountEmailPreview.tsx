// components/admin/DiscountEmailPreview.tsx
import React from "react";

interface DiscountEmailPreviewProps {
  subject?: string;
  body?: string;
  contentType?: string; // "html" | "text" | "json_stringified" etc
  discountCode?: string;
  discountValue?: string;
  name?: string; // Kept for backward compatibility if needed
}

const DiscountEmailPreview: React.FC<DiscountEmailPreviewProps> = ({
  subject = "No Subject",
  body = "",
  contentType = "text",
  discountCode,
  discountValue,
}) => {

  // Replace placeholders with preview values
  const replacePlaceholders = (text: string): string => {
    if (!text) return text;

    // Create a map of placeholder replacements for preview
    const placeholderMap: Record<string, string> = {
      // Discount code specific
      'codeOfDisc': discountCode || 'SAMPLE-CODE',
      'discount_code': discountCode || 'SAMPLE-CODE',
      'discountSeriesName': 'Sample Series',
      'discAmountSeries': discountValue || '10%',
      'MinimumPurchaseAmountValue': '$50.00',
      'maxDiscValueAmount': '$100.00',
      'expirayDateOfDisc': '2026-12-31',

      // User profile
      'Jahid_Hasan': 'John',
      'LastNameSlug': 'Doe',
      'phone_number': '+1234567890',
    };

    // Replace {{ slug_name }} patterns
    let replacedText = text;
    Object.entries(placeholderMap).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
      replacedText = replacedText.replace(regex, value);
    });

    return replacedText;
  };

  const renderContent = () => {
    const processedBody = replacePlaceholders(body);

    if (contentType === "html") {
      return (
        <div
          className="prose max-w-none text-gray-700 space-y-4 text-base"
          dangerouslySetInnerHTML={{ __html: processedBody }}
        />
      );
    }

    // Default to text
    return (
      <div className="text-gray-700 whitespace-pre-wrap text-base font-sans">
        {processedBody || "No content to preview."}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 border-2 rounded-lg border-[#e5e7eb] p-4">
      {/* Outer Container (Simulates the main content area) */}
      <div className="space-y-4">
        {/* Preview Label */}
        <h3 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Preview</h3>

        {/* Email Content Box */}
        <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-lg shadow-sm space-y-6">
          {/* Email Subject */}
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Subject</span>
            <h1 className="text-xl font-bold text-[#0a0a0a] mt-1">
              {replacePlaceholders(subject)}
            </h1>
          </div>

          <hr className="border-gray-100" />

          {/* Email Body */}
          <div>
            {renderContent()}
          </div>

          {/* Footer showing the code being sent */}
          {(discountCode || discountValue) && (
            <div className="mt-8 pt-4 border-t border-gray-50">
              <p className="text-xs text-gray-400 text-center">
                Attached Code: <span className="font-mono text-purple-600 font-medium">{discountCode}</span> ({discountValue})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountEmailPreview;
