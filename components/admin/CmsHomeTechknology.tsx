import React, { useState, useEffect } from "react";
import { FileText, Loader2, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import CmsHomePageTitle from "./CmsHomePageTitle";

import {
  useGetHomepageTechnologyQuery,
  useCreateHomepageTechnologyMutation,
  useUpdateHomepageTechnologyMutation,
  useDeleteHomepageTechnologyMutation,
} from "../../app/store/slices/services/adminService/homepageCmsApi";

const CmsHomeTechknology = () => {
  const { data: techRes, isLoading: isFetching } = useGetHomepageTechnologyQuery();
  const [createTech, { isLoading: isCreating }] = useCreateHomepageTechnologyMutation();
  const [updateTech, { isLoading: isUpdating }] = useUpdateHomepageTechnologyMutation();
  const [deleteTech, { isLoading: isDeleting }] = useDeleteHomepageTechnologyMutation();

  const isSaving = isCreating || isUpdating;

  // Track Data
  const [activeTechId, setActiveTechId] = useState<number | null>(null);

  // Form State
  const [techTitle, setTechTitle] = useState("");
  const [techDescription, setTechDescription] = useState("");

  // Statistics Array State
  const [stats, setStats] = useState([
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
  ]);

  // Sync API
  useEffect(() => {
    const techData = Array.isArray(techRes?.data) ? techRes?.data[0] : techRes?.data;
    if (techData) {
      setActiveTechId(techData.id || null);
      setTechTitle(techData.tech_title || "");
      setTechDescription(techData.tech_description || "");

      // Deserialize statistics array string safely
      if (techData.statics) {
        try {
          const parsedStats = JSON.parse(techData.statics);
          if (Array.isArray(parsedStats) && parsedStats.length > 0) {
            // Ensure exactly 3 slots to match UI
            const newStats = [...parsedStats];
            while (newStats.length < 3) newStats.push({ value: "", label: "" });
            setStats(newStats.slice(0, 3));
          }
        } catch (e) {
          console.error("Failed to parse technology statistics", e);
        }
      }
    } else {
      setActiveTechId(null);
    }
  }, [techRes]);


  const handleSaveSettings = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (techTitle) formData.append("tech_title", techTitle);
    if (techDescription) formData.append("tech_description", techDescription);

    // Serialize statistics object into a JSON string
    formData.append("statics", JSON.stringify(stats));

    try {
      if (activeTechId) {
        await updateTech({ id: activeTechId, data: formData }).unwrap();
        toast.success("Technology Section Updated!", { position: "bottom-center" });
      } else {
        await createTech(formData).unwrap();
        toast.success("Technology Section Created!", { position: "bottom-center" });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to save Technology configuration.", { position: "bottom-center" });
    }
  };

  const handleDeleteSection = async () => {
    if (!activeTechId) return;
    if (!confirm("Are you sure you want to delete this Technology Section configuration?")) return;

    try {
      await deleteTech(activeTechId).unwrap();
      toast.success("Technology Section Deleted!", { position: "bottom-center" });
      setActiveTechId(null);
      setTechTitle("");
      setTechDescription("");
      setStats([
        { value: "", label: "" },
        { value: "", label: "" },
        { value: "", label: "" },
      ]);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete Technology Section.", { position: "bottom-center" });
    }
  }

  const handleStatChange = (index: number, field: string, value: string) => {
    setStats((prevStats) =>
      prevStats.map((stat, i) =>
        i === index ? { ...stat, [field]: value } : stat
      )
    );
  };

  const inputClass =
    "w-full p-3 text-base text-gray-700 bg-[#f3f3f5] border-2 border-[#e8e3dc] rounded-lg focus:outline-none placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-800 mb-1";
  const statInputClass =
    "w-full p-3 text-base text-gray-700 bg-[#f3f3f5] rounded-lg focus:outline-none border-none py-2";

  if (isFetching) {
    return (
      <div className="flex justify-center p-10 bg-gray-50 mt-6 rounded-xl border-2 border-[#e8e3dc]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 mt-6">
      <div className="p-6 bg-white rounded-xl border-2 border-[#e8e3dc] ">

        <header className="mb-6 flex justify-between items-start">
          <CmsHomePageTitle
            title="Technology & Statistics Section"
            text="Showcase your technology and key metrics"
          />
          {activeTechId && (
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

        <div className="mb-6">
          <label className={labelClass}>Section Title</label>
          <input
            type="text"
            placeholder="e.g., Where Creativity Meets Technology"
            value={techTitle}
            onChange={(e) => setTechTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="mb-8">
          <label className={labelClass}>Section Description</label>
          <textarea
            rows={3}
            placeholder="Describe your value proposition"
            value={techDescription}
            onChange={(e) => setTechDescription(e.target.value)}
            className={`${inputClass} resize-none h-auto`}
          />
        </div>

        <h3 className="text-base font-medium text-gray-800 mb-4">
          Statistics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-2 border-2 border-[#e8e3dc] rounded-lg bg-white"
            >
              <input
                type="text"
                placeholder="Value (e.g 300+)"
                value={stat.value}
                onChange={(e) => handleStatChange(index, "value", e.target.value)}
                className={statInputClass}
                style={{ backgroundColor: "#f3f3f5", marginBottom: "0.5rem" }}
              />
              <input
                type="text"
                placeholder="Label (e.g Hours)"
                value={stat.label}
                onChange={(e) => handleStatChange(index, "label", e.target.value)}
                className={statInputClass}
                style={{ backgroundColor: "#f3f3f5" }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full flex items-center justify-center py-3 px-4 bg-[linear-gradient(180deg,#8b6f47,#7a5f3a)] text-white font-semibold rounded-lg hover:brightness-110 transition duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#8b6f47]/50 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <FileText className="w-5 h-5 mr-3" />}
          {isSaving ? "Saving..." : "Save Technology Section"}
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default CmsHomeTechknology;
