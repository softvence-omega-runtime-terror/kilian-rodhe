"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import CmsAboutUsBeginning from "@/components/admin/CmsAboutUsBeginnig";
import {
  useGetAboutContentSectionQuery,
  useUpdateAboutContentSectionMutation,
  useCreateAboutContentSectionMutation
} from "@/app/store/slices/services/adminService/cmsAboutApi";

// Static Page Title component
type CmsHomePageTitleProps = {
  title: string;
  text?: string;
};

const CmsHomePageTitle: React.FC<CmsHomePageTitleProps> = ({ title, text }) => (
  <header className="mb-8">
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    {text && <p className="text-sm text-gray-500 mt-1">{text}</p>}
  </header>
);

const CmsAboutUs = () => {
  const { data: aboutData, isLoading } = useGetAboutContentSectionQuery();
  const [updateAbout] = useUpdateAboutContentSectionMutation();
  const [createAbout] = useCreateAboutContentSectionMutation();

  const [id, setId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [beginningBanner, setBeginningBanner] = useState<string | File | null>(null);
  const [beginningTitle, setBeginningTitle] = useState("");
  const [beginningDescription, setBeginningDescription] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (aboutData?.success && aboutData.data.length > 0) {
      const firstSection = aboutData.data[0];
      setId(firstSection.id);
      setTitle(firstSection.title);
      setSubtitle(firstSection.subtitle);
      setBeginningBanner(firstSection.beginning_banner);
      setBeginningTitle(firstSection.beginning_title);
      setBeginningDescription(firstSection.beginning_description);
    }
  }, [aboutData]);

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("beginning_title", beginningTitle);
    formData.append("beginning_description", beginningDescription);

    if (beginningBanner instanceof File) {
      formData.append("beginning_banner", beginningBanner);
    }

    try {
      if (id) {
        await updateAbout({ id, data: formData }).unwrap();
        toast.success("About section updated successfully!");
      } else {
        await createAbout(formData).unwrap();
        toast.success("About section created successfully!");
      }
    } catch (error) {
      console.error("Failed to save about section:", error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full p-3 text-base text-gray-700 bg-[#f3f3f5] rounded-lg focus:outline-none placeholder-gray-400";
  const labelClass = "block text-base font-medium text-gray-800 mb-2";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B6F47]"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div>
        <div className="p-6 bg-white rounded-xl border-2 border-[#e8e3dc]">
          <CmsHomePageTitle
            title="About Us Page Content"
            text="Information about your company and values"
          />

          <div className="mb-2">
            <label className={labelClass}>Page Title</label>
            <input
              type="text"
              placeholder="e.g., Our Story of Innovation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="mb-6">
            <label className={labelClass}>Page Subtitle</label>
            <textarea
              rows={2}
              placeholder="Describe your company's mission and values"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <CmsAboutUsBeginning
          beginning_banner={beginningBanner}
          beginning_title={beginningTitle}
          beginning_description={beginningDescription}
          setBeginningBanner={setBeginningBanner}
          setBeginningTitle={setBeginningTitle}
          setBeginningDescription={setBeginningDescription}
        />

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-3 rounded-xl text-white font-semibold transition-all duration-200 ${isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-linear-to-t from-[#7a5f3a] to-[#8b6f47] hover:shadow-lg active:scale-95"
              }`}
          >
            {isSaving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default CmsAboutUs;
