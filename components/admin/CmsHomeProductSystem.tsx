import React, { useState, useEffect } from "react";
import { FileText, Loader2, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import CmsHomePageTitle from "./CmsHomePageTitle";

import {
  useGetHomepageFeatureQuery,
  useCreateHomepageFeatureMutation,
  useUpdateHomepageFeatureMutation,
  useDeleteHomepageFeatureMutation,
} from "../../app/store/slices/services/adminService/homepageCmsApi";

const CmsHomeProductSystem = () => {
  const { data: featureRes, isLoading: isFetching } = useGetHomepageFeatureQuery();
  const [createFeature, { isLoading: isCreating }] = useCreateHomepageFeatureMutation();
  const [updateFeature, { isLoading: isUpdating }] = useUpdateHomepageFeatureMutation();
  const [deleteFeature, { isLoading: isDeleting }] = useDeleteHomepageFeatureMutation();

  const isSaving = isCreating || isUpdating;

  const [activeFeatureId, setActiveFeatureId] = useState<number | null>(null);

  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionSubTitle, setSectionSubTitle] = useState("");

  useEffect(() => {
    const featureData = Array.isArray(featureRes?.data) ? featureRes?.data[0] : featureRes?.data;
    if (featureData) {
      setActiveFeatureId(featureData.id || null);
      setSectionTitle(featureData.sectionTitle || "");
      setSectionSubTitle(featureData.sectionSubTitle || "");
    } else {
      setActiveFeatureId(null);
    }
  }, [featureRes]);

  const handleSaveSettings = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (sectionTitle) formData.append("section_title", sectionTitle);
    if (sectionSubTitle) formData.append("section_subtitle", sectionSubTitle);

    try {
      if (activeFeatureId) {
        await updateFeature({ id: activeFeatureId, data: formData }).unwrap();
        toast.success("Featured Products Section Updated!", { position: "bottom-center" });
      } else {
        await createFeature(formData).unwrap();
        toast.success("Featured Products Section Created!", { position: "bottom-center" });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to save Featured Products configured.", { position: "bottom-center" });
    }
  };

  const handleDeleteSection = async () => {
    if (!activeFeatureId) return;
    if (!confirm("Are you sure you want to delete this Section configuration?")) return;

    try {
      await deleteFeature(activeFeatureId).unwrap();
      toast.success("Section Configuration Deleted!", { position: "bottom-center" });
      setActiveFeatureId(null);
      setSectionTitle("");
      setSectionSubTitle("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete Section.", { position: "bottom-center" });
    }
  }

  const inputClass =
    "w-full p-3 text-base text-gray-700 bg-[#f3f3f5] border-2 border-[#e8e3dc] rounded-lg focus:outline-none placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-800 mb-1";
  const advisoryBoxBg = "bg-gray-50";

  if (isFetching) {
    return (
      <div className="flex justify-center p-10 bg-gray-50 mt-6 rounded-xl border-2 border-[#e8e3dc]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 mt-6">
      <div className="p-6 bg-white rounded-xl border-2 border-[#e8e3dc]">

        <header className="mb-6 flex justify-between items-start">
          <CmsHomePageTitle
            title="Featured Products Section"
            text="Showcase your best products on the homepage"
          />
          {activeFeatureId && (
            <button
              onClick={handleDeleteSection}
              disabled={isDeleting}
              className="px-3 py-2 bg-red-50 text-red-600 rounded flex items-center hover:bg-red-100 transition"
              type="button"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete section config
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={labelClass}>Section Title</label>
            <input
              type="text"
              placeholder="e.g., Featured Products"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Section Subtitle</label>
            <input
              type="text"
              placeholder="e.g., Select your canvas and unleash your creativity..."
              value={sectionSubTitle}
              onChange={(e) => setSectionSubTitle(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className={`p-4 rounded-lg border-2 border-[#e8e3dc] ${advisoryBoxBg} mb-8`}>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-700">
              Featured products are automatically selected from your products
              marked as <strong className="font-semibold">&quot;Featured&quot;</strong>{" "}
              in the Products Management section.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full flex items-center justify-center py-3 px-4 bg-[linear-gradient(180deg,#8b6f47,#7a5f3a)] text-white font-semibold rounded-lg hover:brightness-110 transition duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#8b6f47]/50 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <FileText className="w-5 h-5 mr-3" />}
          {isSaving ? "Saving..." : "Save Featured Section"}
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default CmsHomeProductSystem;
