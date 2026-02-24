import React from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

type CmsHomePageTitleProps = {
  title: string;
  text?: string;
};

const CmsHomePageTitle: React.FC<CmsHomePageTitleProps> = ({ title, text }) => (
  <header className="mb-8">
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    <p className="text-sm text-gray-500 mt-1">{text}</p>
  </header>
);

interface CmsAboutUsBeginningProps {
  beginning_banner: string | File | null;
  beginning_title: string;
  beginning_description: string;
  setBeginningBanner: (file: File | string | null) => void;
  setBeginningTitle: (title: string) => void;
  setBeginningDescription: (desc: string) => void;
}

const CmsAboutUsBeginning: React.FC<CmsAboutUsBeginningProps> = ({
  beginning_banner,
  beginning_title,
  beginning_description,
  setBeginningBanner,
  setBeginningTitle,
  setBeginningDescription,
}) => {
  const inputClass =
    "w-full p-3 text-base text-gray-700 bg-[#f3f3f5] border-2 border-[#e8e3dc] rounded-lg focus:outline-none placeholder-gray-400";
  const labelClass = "block text-base font-medium text-gray-800 mb-2";

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setBeginningBanner(file);
    }
    event.target.value = ""; // Reset input
  };

  const bannerUrl = beginning_banner instanceof File
    ? URL.createObjectURL(beginning_banner)
    : beginning_banner;

  return (
    <div className="bg-gray-50 mt-6 font-sans">
      {/* Main Editor Card */}
      <div className="p-6 bg-white rounded-xl border-2 border-[#e8e3dc]">
        {/* Header */}
        <CmsHomePageTitle title="The Beginning Section" text="Banner Image" />

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          id="image-upload-input"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Image Upload / Display Area */}
        <div className="mb-8">
          {bannerUrl ? (
            <div className="relative w-full h-80 rounded-xl overflow-hidden border-2 border-[#8c7457]">
              <Image
                src={bannerUrl}
                alt="Uploaded Banner"
                fill
                style={{ objectFit: "contain" }}
                className="rounded-xl"
              />
              <button
                type="button"
                onClick={() => setBeginningBanner(null)}
                className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition duration-150"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="image-upload-input"
              className="cursor-pointer flex flex-col items-center justify-center h-80 bg-[#fbfbfb] border border-[#e8e3dc] rounded-xl p-8 text-center"
            >
              <Upload className="w-8 h-8 text-amber-800/70" />
              <p className="mt-3 text-base text-gray-800 font-medium">
                Upload Image
              </p>
              <p className="text-xs text-gray-500 mt-1">1920x600px recommended</p>
            </label>
          )}
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className={labelClass}>Title</label>
          <input
            type="text"
            placeholder="e.g., Where It All Started"
            value={beginning_title}
            onChange={(e) => setBeginningTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Description Input */}
        <div className="mb-6">
          <label className={labelClass}>Description</label>
          <textarea
            rows={3}
            placeholder="e.g., Use our AI-powered design studio..."
            value={beginning_description}
            onChange={(e) => setBeginningDescription(e.target.value)}
            className={`${inputClass} resize-none h-auto`}
          />
        </div>
      </div>
    </div>
  );
};

export default CmsAboutUsBeginning;
