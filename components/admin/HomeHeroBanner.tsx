"use client";

import React, { useRef, useState, ChangeEvent } from "react";
// 1. Importing the Lucide icons
import { UploadCloud, FileText, XCircle } from "lucide-react"; // Added XCircle for remove button

import toast, { Toaster } from "react-hot-toast";
import CmsHomePageTitle from "./CmsHomePageTitle";

const handleSaveSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  console.log("Saving settings...");
  // In a real application, you would send the file/data to an API here
  toast.success("Save Quality Settings!", {
    position: "bottom-center",
  });
};

const HomeHeroBanner: React.FC = () => {
  // 1. STATE for Image Upload
  const [heroImage, setHeroImage] = useState<string | null>(null); // Stores the URL for preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Stores the File object
console.log(selectedFile)
  // 2. REF for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. HANDLER for file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image (basic check)
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        // Create a URL for image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setHeroImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please select a valid image file (JPG, PNG, etc.).");
      }
    }
  };

  // HANDLER to remove the image
  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Stop click from propagating to the main upload div
    setHeroImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input value so the same file can be selected again
    }
    toast("Image removed successfully.", { icon: "🗑️" });
  };

  // Custom class for consistent input styling
  const inputClass =
    "w-full p-3 text-base text-gray-700 bg-[#f3f3f5] border-2 border-[#e8e3dc] rounded-lg focus:outline-none placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-800 mb-1";

  return (
    <div>
      {/* Main Form Container - Same shadow/border as the image */}
      <div className="p-6 bg-white rounded-xl border-2 border-[#e8e3dc]">
        {/* Hero Background Image Section */}
        <div className="mb-6">
          <header className="mb-8">
            <CmsHomePageTitle
              title="Hero Banner Section"
              text="Main banner displayed at the top of your homepage"
            />
          </header>
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Hero Background Image
          </h3>

          {/* 2. Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*" // Restrict to image files
            style={{ display: "none" }}
          />

          {/* Image Upload Area - Click handler is added here */}
          <div
            onClick={() => fileInputRef.current?.click()} // Programmatically click the hidden input
            className={`
              relative flex justify-center items-center h-80 border-2 rounded-lg cursor-pointer transition-colors
              ${heroImage
                ? "border-transparent" // No border when an image is loaded
                : "bg-[linear-gradient(135deg,#faf9f7,rgba(232,227,220,0.3))] border-[#e8e3dc] hover:border-gray-400"
              }
            `}
            style={
              heroImage
                ? {
                  backgroundImage: `url(${heroImage})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",

                  backgroundPosition: "center",
                }
                : {}
            }
          >
            {/* 4. Display Logic: Show preview or the default upload message */}
            {heroImage ? (
              // Image Preview state
              <>
                <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-lg font-bold p-2  bg-opacity-50 rounded">
                    Click to change image
                  </p>
                </div>
                {/* Remove Image Button */}
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full hover:bg-red-700 transition"
                  title="Remove Image"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </>
            ) : (
              // Default Upload state
              <div className="text-center p-4">
                {/* Using UploadCloud icon */}
                <UploadCloud className="w-8 h-8 mx-auto text-gray-500" />
                <p className="text-base text-gray-700 font-medium mt-2">
                  Click to upload hero image
                </p>
                <p className="text-sm text-gray-500">
                  Recommended: 1920x800px, high quality
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Input fields remain the same */}
        <div className="mb-6">
          <label className={labelClass}>Hero Title</label>
          <input
            type="text"
            placeholder="Enter the main title"
            defaultValue="STYLE FOR EVERY CORNER"
            className={inputClass}
          />
        </div>

        <div className="mb-6">
          <label className={labelClass}>Hero Subtitle</label>
          <input
            type="text"
            placeholder="Describe your main value proposition"
            defaultValue="Describe your main value proposition"
            className={inputClass}
          />
        </div>

        <div className="mb-6">
          <label className={labelClass}>Button Text</label>
          <input
            type="text"
            placeholder="Text for the call-to-action button"
            defaultValue="Explore Now"
            className={inputClass}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          type="button"
          className="w-full flex items-center justify-center py-3 px-4 mt-8
                      bg-[linear-gradient(180deg,#8b6f47,#7a5f3a)] text-white font-semibold rounded-lg 
                      hover:brightness-110 transition duration-150 ease-in-out 
                      "
        >
          {/* Using FileText icon (or Save) and applying rotation to match design */}
          <FileText className="w-5 h-5 mr-3 " />
          Save Hero Section
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default HomeHeroBanner;
