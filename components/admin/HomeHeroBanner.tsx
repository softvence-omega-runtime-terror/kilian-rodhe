"use client";

import React, { useRef, useState, ChangeEvent, useEffect } from "react";
// 1. Importing the Lucide icons
import { UploadCloud, FileText, XCircle, Loader2, Trash2 } from "lucide-react";

import toast, { Toaster } from "react-hot-toast";
import CmsHomePageTitle from "./CmsHomePageTitle";

import {
  useGetHomepageHeroQuery,
  useCreateHomepageHeroMutation,
  useUpdateHomepageHeroMutation,
  useDeleteHomepageHeroMutation,
} from "../../app/store/slices/services/adminService/homepageCmsApi";


const HomeHeroBanner: React.FC = () => {
  const { data: heroRes, isLoading: isFetching } = useGetHomepageHeroQuery();
  const [createHero, { isLoading: isCreating }] = useCreateHomepageHeroMutation();
  const [updateHero, { isLoading: isUpdating }] = useUpdateHomepageHeroMutation();
  const [deleteHero, { isLoading: isDeleting }] = useDeleteHomepageHeroMutation();

  const isSaving = isCreating || isUpdating;

  // Track data to allow editing an existing record or creating a new one
  const [activeHeroId, setActiveHeroId] = useState<number | null>(null);

  // Form State
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("");

  // Image State
  const [heroImage, setHeroImage] = useState<string | null>(null); // URL string or base64
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with API
  useEffect(() => {
    // Handling array wrappers if present
    const heroData = Array.isArray(heroRes?.data) ? heroRes?.data[0] : heroRes?.data;

    if (heroData) {
      setActiveHeroId(heroData.id || null);
      setHeroTitle(heroData.hero_title || "");
      setHeroSubtitle(heroData.hero_subtitle || "");
      setButtonText(heroData.button_text || "");
      setHeroImage(heroData.hero_bgImage || null);
    } else {
      setActiveHeroId(null);
    }
  }, [heroRes]);

  // HANDLER for file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
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

  // HANDLER to remove the image currently loaded in form
  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setHeroImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Image removed from current view.");
  };

  // HANDLER to Save/Submit settings
  const handleSaveSettings = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (heroTitle) formData.append("hero_title", heroTitle);
    if (heroSubtitle) formData.append("hero_subtitle", heroSubtitle);
    if (buttonText) formData.append("button_text", buttonText);

    // Only embed new File parameter if we just selected one
    if (selectedFile) {
      formData.append("hero_bgImage", selectedFile);
    }

    try {
      if (activeHeroId) {
        await updateHero({ id: activeHeroId, data: formData }).unwrap();
        toast.success("Hero Banner Updated Successfully!", { position: "bottom-center" });
      } else {
        await createHero(formData).unwrap();
        toast.success("Hero Banner Created Successfully!", { position: "bottom-center" });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to save Hero Banner", { position: "bottom-center" });
    }
  };

  const handleDeleteBanner = async () => {
    if (!activeHeroId) return;
    if (!confirm("Are you sure you want to delete this Hero Banner?")) return;

    try {
      await deleteHero(activeHeroId).unwrap();
      toast.success("Hero Banner Deleted!", { position: "bottom-center" });
      setActiveHeroId(null);
      setHeroImage(null);
      setHeroTitle("");
      setHeroSubtitle("");
      setButtonText("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete Hero Banner.", { position: "bottom-center" });
    }
  }

  // Custom class for consistent input styling
  const inputClass =
    "w-full p-3 text-base text-gray-700 bg-[#f3f3f5] border-2 border-[#e8e3dc] rounded-lg focus:outline-none placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-800 mb-1";

  if (isFetching) {
    return (
      <div className="flex justify-center p-10 bg-white rounded-xl border-2 border-[#e8e3dc]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 bg-white rounded-xl border-2 border-[#e8e3dc]">
        {/* Banner Headers */}
        <div className="mb-6">
          <header className="mb-8 flex justify-between items-start">
            <CmsHomePageTitle
              title="Hero Banner Section"
              text="Main banner displayed at the top of your homepage"
            />
            {activeHeroId && (
              <button
                onClick={handleDeleteBanner}
                disabled={isDeleting}
                className="px-3 py-2 bg-red-50 text-red-600 rounded flex items-center hover:bg-red-100 transition"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Delete active banner
              </button>
            )}
          </header>

          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Hero Background Image
          </h3>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          {/* Image Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative flex justify-center items-center h-80 border-2 rounded-lg cursor-pointer transition-colors
              ${heroImage
                ? "border-transparent bg-contain bg-center bg-no-repeat"
                : "bg-[linear-gradient(135deg,#faf9f7,rgba(232,227,220,0.3))] border-[#e8e3dc] hover:border-gray-400"
              }
            `}
            style={{ ...(heroImage && { backgroundImage: `url(${heroImage})` }) }}
          >
            {heroImage ? (
              <>
                <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-lg font-bold p-2 bg-black bg-opacity-50 rounded">
                    Click to change image
                  </p>
                </div>
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full hover:bg-red-700 transition"
                  title="Remove Image"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div className="text-center p-4">
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

        {/* Input fields */}
        <div className="mb-6">
          <label className={labelClass}>Hero Title</label>
          <input
            type="text"
            placeholder="Enter the main title"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="mb-6">
          <label className={labelClass}>Hero Subtitle</label>
          <input
            type="text"
            placeholder="Describe your main value proposition... e.g STYLE FOR EVERY CORNER"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="mb-6">
          <label className={labelClass}>Button Text</label>
          <input
            type="text"
            placeholder="Text for the call-to-action button"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full flex items-center justify-center py-3 px-4 mt-8
                      bg-[linear-gradient(180deg,#8b6f47,#7a5f3a)] text-white font-semibold rounded-lg 
                      hover:brightness-110 transition duration-150 ease-in-out disabled:opacity-50
                      "
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
          ) : (
            <FileText className="w-5 h-5 mr-3 " />
          )}
          {isSaving ? "Saving..." : "Save Hero Section"}
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default HomeHeroBanner;
