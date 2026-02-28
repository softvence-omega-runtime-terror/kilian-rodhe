"use client";

import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, FileText, XCircle, Loader2, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import CmsHomePageTitle from "./CmsHomePageTitle";

import {
  useGetHomepagePromotionQuery,
  useCreateHomepagePromotionMutation,
  useUpdateHomepagePromotionMutation,
  useDeleteHomepagePromotionMutation,
} from "../../app/store/slices/services/adminService/homepageCmsApi";

const CmsHomeMidPageBanner = () => {
  const { data: promoRes, isLoading: isFetching } = useGetHomepagePromotionQuery();
  const [createPromo, { isLoading: isCreating }] = useCreateHomepagePromotionMutation();
  const [updatePromo, { isLoading: isUpdating }] = useUpdateHomepagePromotionMutation();
  const [deletePromo, { isLoading: isDeleting }] = useDeleteHomepagePromotionMutation();

  const isSaving = isCreating || isUpdating;

  // Track Data
  const [activePromoId, setActivePromoId] = useState<number | null>(null);

  // Form State
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("");

  // Image State
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync API
  useEffect(() => {
    const promoData = Array.isArray(promoRes?.data) ? promoRes?.data[0] : promoRes?.data;
    if (promoData) {
      setActivePromoId(promoData.id || null);
      setBannerTitle(promoData.bannerTitle || "");
      setBannerSubtitle(promoData.bannerSubtitle || "");
      setButtonText(promoData.buttonText || "");
      setBannerImage(promoData.bannerImage || null);
    } else {
      setActivePromoId(null);
    }
  }, [promoRes]);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG/JPG).");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove Image
  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setBannerImage(null);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.success("Image removed from view.");
  };

  // Save Settings
  const handleSaveSettings = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (bannerTitle) formData.append("banner_title", bannerTitle);
    if (bannerSubtitle) formData.append("banner_subtitle", bannerSubtitle);
    if (buttonText) formData.append("button_text", buttonText);

    if (selectedFile) {
      formData.append("banner_image", selectedFile);
    }

    try {
      if (activePromoId) {
        await updatePromo({ id: activePromoId, data: formData }).unwrap();
        toast.success("Promotion Banner Updated!", { position: "bottom-center" });
      } else {
        await createPromo(formData).unwrap();
        toast.success("Promotion Banner Created!", { position: "bottom-center" });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to save Promotion Banner.", { position: "bottom-center" });
    }
  };

  const handleDeleteBanner = async () => {
    if (!activePromoId) return;
    if (!confirm("Are you sure you want to delete this Promotion Banner?")) return;

    try {
      await deletePromo(activePromoId).unwrap();
      toast.success("Promotion Banner Deleted!", { position: "bottom-center" });
      setActivePromoId(null);
      setBannerImage(null);
      setBannerTitle("");
      setBannerSubtitle("");
      setButtonText("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete Promotion Banner.", { position: "bottom-center" });
    }
  }

  const inputClass =
    "w-full p-3 text-base text-gray-700 bg-[#f3f3f5] border-2 border-[#e8e3dc] rounded-lg focus:outline-none placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-800 mb-1";

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
            title="Mid-Page Promotional Banner"
            text="Secondary banner for promotions or campaigns"
          />
          {activePromoId && (
            <button
              onClick={handleDeleteBanner}
              disabled={isDeleting}
              className="px-3 py-2 bg-red-50 text-red-600 rounded flex items-center hover:bg-red-100 transition"
              type="button"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete active banner
            </button>
          )}
        </header>

        {/* Banner Image Upload */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-800 py-4">
            Banner Image
          </h3>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex justify-center items-center h-[300px] border-2 rounded-xl transition-colors overflow-hidden ${bannerImage
              ? "border-transparent cursor-pointer"
              : "bg-[linear-gradient(135deg,#faf9f7,rgba(232,227,220,0.3))] border-[#e8e3dc] hover:border-gray-400 cursor-pointer"
              }`}
          >
            {bannerImage ? (
              <>
                <div className="relative w-full h-full">
                  <Image
                    src={bannerImage}
                    alt="Uploaded Banner"
                    fill
                    className="object-contain rounded-xl"
                    sizes="100vw"
                  />
                </div>

                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-opacity-0 hover:bg-black/20 transition-all duration-300 group">
                  <p className="text-white text-lg font-bold p-3 bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 transition">
                    Click to change image
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-1 text-white bg-red-600 rounded-full shadow-xl hover:bg-red-700 transition z-10"
                >
                  <XCircle className="w-7 h-7" />
                </button>
              </>
            ) : (
              <div className="text-center p-4">
                <UploadCloud className="w-10 h-10 mx-auto text-gray-500" />
                <p className="text-lg text-gray-700 font-medium mt-3">
                  Upload promotional banner
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  1920x600px recommended
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Inputs Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div>
            <label className={labelClass}>Banner Title</label>
            <input
              type="text"
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              placeholder="e.g. Create Your Own Style"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Button Text</label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="e.g. Start Designing"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mb-8">
          <label className={labelClass}>Banner Subtitle</label>
          <textarea
            rows={3}
            value={bannerSubtitle}
            onChange={(e) => setBannerSubtitle(e.target.value)}
            placeholder="Enter the descriptive subtitle"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full flex items-center justify-center py-3 px-4 bg-[linear-gradient(180deg,#8b6f47,#7a5f3a)] text-white font-semibold rounded-lg hover:brightness-110 transition hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#8b6f47]/50 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <FileText className="w-5 h-5 mr-3" />}
          {isSaving ? "Saving..." : "Save Mid-Page Banner"}
        </button>
      </div>

      <Toaster />
    </div>
  );
};

export default CmsHomeMidPageBanner;
