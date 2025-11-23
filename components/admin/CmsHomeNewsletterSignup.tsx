import React, { useState } from "react";
// Lucide icons used for UI elements
import { FileText } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Mock implementation of CmsHomePageTitle for self-contained file
type CmsHomePageTitleProps = {
  title: string;
  text: string;
};

const CmsHomePageTitle: React.FC<CmsHomePageTitleProps> = ({ title, text }) => (
  <header className="mb-6 flex justify-between items-start">
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
        {title}
      </h2>
      <p className="text-sm text-gray-500 mt-1">{text}</p>
    </div>
  </header>
);

const App = () => {
  // State for managing the editable text fields
  const [sectionTitle, setSectionTitle] = useState("Stay Inspired");
  const [sectionSubtitle, setSectionSubtitle] = useState(
    "Encourage users to subscribe..."
  );

  // State for managing the preview text displayed in the newsletter block
  const [previewTitle, setPreviewTitle] = useState("Stay Inspired");
  const [previewDescription, setPreviewDescription] = useState(
    "Subscribe to our newsletter for exclusive deals, design tips, and new product launches"
  );

  // HANDLER for saving settings
  const handleSaveSettings = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Saving Newsletter Section settings...", {
      sectionTitle,
      sectionSubtitle,
      previewTitle,
      previewDescription,
    });
    // In a real application, you would send the data to an API here
    toast.success("Newsletter Section saved successfully!", {
      position: "bottom-center",
    });
  };

  // NEW HANDLER: Shows toast message when mock Subscribe button is clicked
  const handleSubscribeClick = () => {
    toast.success("Subscribed successfully! (Mock Action)", {
      position: "bottom-center",
      icon: "✉️",
    });
  };

  // Custom class for consistent input styling
  const inputClass =
    "w-full p-3 text-base text-gray-700 bg-[#f3f3f5] border-2 border-[#e8e3dc] rounded-lg focus:outline-none placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-800 mb-1";

  // Background color for the preview block
  const previewBgColor = "bg-[#f8f6f3]";

  return (
    <div className=" bg-gray-50 mt-6">
      <div>
        {/* Main Form Container - Matching the image's overall look */}
        <div className="p-6 bg-white rounded-xl border-2 border-[#e8e3dc] ">
          {/* Header Section: Newsletter Signup Section */}
          <CmsHomePageTitle
            title="Newsletter Signup Section"
            text="Encourage visitors to subscribe to your newsletter"
          />

          {/* Section Title Input */}
          <div className="mb-6">
            <label className={labelClass}>Section Title</label>
            <input
              type="text"
              placeholder="e.g., Stay Inspired"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Section Subtitle Input (uses a textarea to match the height in the image) */}
          <div className="mb-8">
            <label className={labelClass}>Section Subtitle</label>
            <textarea
              rows={3}
              placeholder="Encourage users to subscribe..."
              value={sectionSubtitle}
              onChange={(e) => setSectionSubtitle(e.target.value)}
              className={`${inputClass} resize-none h-auto`}
            />
          </div>

          {/* Newsletter Signup Preview Block */}
          <div className={`p-8 rounded-lg text-center ${previewBgColor} mb-8`}>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              {previewTitle}
            </h4>
            <p className="text-sm text-gray-600 mb-6">{previewDescription}</p>

            {/* Mock Signup Form */}
            <div className="flex justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-3 text-base text-gray-700 bg-white rounded-l-lg border-2 border-gray-200 focus:outline-none focus:border-gray-400"
                style={{ flex: 1, maxWidth: "300px" }}
              />
              <button
                type="button"
                onClick={handleSubscribeClick}
                className="px-5 py-3 text-white font-semibold rounded-r-lg transition duration-150 ease-in-out"
                style={{ backgroundColor: "#a49174" }}
              >
                Subscribe
              </button>
            </div>

            {/* Additional fields for editing the preview text */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-left">
              <h5 className="text-sm font-medium text-gray-800 mb-2">
                Newsletter Preview Content Settings
              </h5>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Preview Title
                  </label>
                  <input
                    type="text"
                    value={previewTitle}
                    onChange={(e) => setPreviewTitle(e.target.value)}
                    className="w-full p-2 text-sm bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Preview Description
                  </label>
                  <input
                    type="text"
                    value={previewDescription}
                    onChange={(e) => setPreviewDescription(e.target.value)}
                    className="w-full p-2 text-sm bg-white border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <section className="w-full px-6 py-10">
                <h2 className="text-[14px] font-semibold mb-6">Statistics</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Card */}
                  <div className="bg-[#F7F5F2] border-2 border-[#E8E4DE] rounded-3xl p-6">
                    <div className="space-y-4">
                      <div className="bg-[#F1F1F4] rounded-xl p-2 border-2 border-[#E8E3DC] text-[#717182] text-[14px]">
                        10K+
                      </div>

                      <div className="bg-[#F1F1F4] rounded-xl border-2 border-[#E8E3DC] p-2 text-[#717182] text-[14px]">
                        SUBSCRIBERS
                      </div>
                    </div>
                  </div>

                  {/* Right Card */}
                  <div className="bg-[#F7F5F2] border-2 border-[#E8E3DC] rounded-3xl p-6">
                    <div className="space-y-4">
                      <div className="bg-[#F1F1F4] rounded-xl p-2 border-2 border-[#E8E3DC] text-[#717182] text-[14px]">
                        98%
                      </div>

                      <div className="bg-[#F1F1F4] rounded-xl p-2 border-2 border-[#E8E3DC] text-[#717182] text-[14px]">
                        SATISFACTION
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            type="button"
            className="w-full flex items-center justify-center py-3 px-4 
                                    bg-[linear-gradient(180deg,#8b6f47,#7a5f3a)] text-white font-semibold rounded-lg 
                                    hover:brightness-110 transition duration-150 ease-in-out 
                                     hover:shadow-lg focus:outline-none"
          >
            <FileText className="w-5 h-5 mr-3 " />
            Save Newsletter Section
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
