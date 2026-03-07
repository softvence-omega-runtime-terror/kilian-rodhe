import React, { useState, useRef } from "react";
import { FileText, Plus, Trash2, Loader2, Save, Image as ImageIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import CmsHomePageTitle from "./CmsHomePageTitle";

import {
  useGetHomepageSaveFeatureQuery,
  useCreateHomepageSaveFeatureMutation,
  useUpdateHomepageSaveFeatureMutation,
  useDeleteHomepageSaveFeatureMutation,
} from "../../app/store/slices/services/adminService/homepageCmsApi";

const CmsHomeFeatureIcon = () => {
  const { data: featureRes, isLoading: isFetching } = useGetHomepageSaveFeatureQuery();
  const [createFeature, { isLoading: isCreating }] = useCreateHomepageSaveFeatureMutation();
  const [updateFeature, { isLoading: isUpdating }] = useUpdateHomepageSaveFeatureMutation();
  const [deleteFeature, { isLoading: isDeleting }] = useDeleteHomepageSaveFeatureMutation();

  const featuresList = Array.isArray(featureRes?.data) ? featureRes.data : [];

  // Local State for "Add New Feature"
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newIcon, setNewIcon] = useState<File | null>(null);

  // Track editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editIcon, setEditIcon] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSubtitle) return toast.error("Title and Subtitle are required");

    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("subtitle", newSubtitle);
    if (newIcon) formData.append("icon", newIcon);

    try {
      await createFeature(formData).unwrap();
      toast.success("Feature Added Successfully!");
      setNewTitle("");
      setNewSubtitle("");
      setNewIcon(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to add feature");
    }
  };

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditTitle(item.title || "");
    setEditSubtitle(item.subtitle || "");
    setEditIcon(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const formData = new FormData();
    if (editTitle) formData.append("title", editTitle);
    if (editSubtitle) formData.append("subtitle", editSubtitle);
    if (editIcon) formData.append("icon", editIcon);

    try {
      await updateFeature({ id: editingId, data: formData }).unwrap();
      toast.success("Feature Updated!");
      setEditingId(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update feature");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this feature?")) return;
    try {
      await deleteFeature(id).unwrap();
      toast.success("Feature Removed!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete feature");
    }
  };

  const goldenColor = "#D4AF37";

  return (
    <div className="bg-gray-50 mt-6">
      <div className="p-6 bg-white rounded-xl border-2 border-[#e8e3dc]">

        <header className="mb-6 flex justify-between items-start">
          <CmsHomePageTitle
            title="Save Features Section"
            text="Highlight key features and benefits on your homepage"
          />
        </header>

        {/* Existing Features List */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Active Features</h3>

          {isFetching ? (
            <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-amber-800" /></div>
          ) : featuresList.length === 0 ? (
            <p className="text-gray-500 text-sm italic p-4 bg-gray-50 rounded-xl text-center border-2 border-dashed border-gray-200">No active features found.</p>
          ) : (
            <div className="space-y-4">
              {featuresList.map((feature: any) => (
                <div key={feature.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-4 border border-[#e8e3dc] rounded-lg transition-shadow hover:shadow-md gap-4">

                  {editingId === feature.id ? (
                    <div className="w-full flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Feature Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="p-3 bg-[#f3f3f5] border-none rounded-lg text-sm w-full focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Feature Subtitle"
                        value={editSubtitle}
                        onChange={(e) => setEditSubtitle(e.target.value)}
                        className="p-3 bg-[#f3f3f5] border-none rounded-lg text-sm w-full focus:ring-2 focus:ring-amber-500"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) setEditIcon(e.target.files[0]);
                          }}
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                      </div>
                      <div className="flex gap-2 justify-end mt-2">
                        <button onClick={() => setEditingId(null)} className="px-3 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                        <button onClick={handleSaveEdit} disabled={isUpdating} className="px-3 py-2 text-sm bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition flex items-center">
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />} Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 w-full">
                        <div className="flex items-center justify-center w-14 h-14 rounded-lg border-2 shrink-0 bg-gray-50" style={{ borderColor: goldenColor }}>
                          {feature.icon ? (
                            <img src={feature.icon} alt={feature.title} className="w-8 h-8 object-contain" />
                          ) : (
                            <ImageIcon className="w-7 h-7" style={{ color: goldenColor }} />
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <h4 className="font-semibold text-gray-800">{feature.title || "Untitled"}</h4>
                          <p className="text-sm text-gray-500">{feature.subtitle || "No subtitle provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleStartEdit(feature)}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                          title="Edit Feature"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(feature.id)}
                          disabled={isDeleting}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Remove Feature"
                        >
                          {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Feature Form */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Add New Feature
          </h3>
          <form onSubmit={handleAddNew} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Feature Title *</label>
                <input
                  type="text"
                  placeholder="e.g. AI-POWERED DESIGN"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Feature Subtitle *</label>
                <input
                  type="text"
                  placeholder="e.g. Adobe Firefly Integration"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  required
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Upload Feature Icon (Optional)</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) setNewIcon(e.target.files[0]);
                }}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full mt-4 flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white disabled:opacity-50"
              style={{ background: "linear-gradient(180deg, #8b6f47, #7a5f3a)" }}
            >
              {isCreating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Plus className="h-5 w-5 mr-2" />}
              {isCreating ? "Adding..." : "Add Feature"}
            </button>
          </form>
        </div>

      </div>
      <Toaster />
    </div>
  );
};

export default CmsHomeFeatureIcon;