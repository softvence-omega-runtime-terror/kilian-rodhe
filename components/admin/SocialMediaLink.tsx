import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Globe, Plus, Trash2, Loader2, Link, Save, Edit2 } from "lucide-react";

import {
  useGetSocialMediaQuery,
  useCreateSocialMediaMutation,
  useUpdateSocialMediaMutation,
  useDeleteSocialMediaMutation,
} from "../../app/store/slices/services/adminService/contentAndCmsApi";

// --- SocialMediaLinksForm Component ---
const SocialMediaLinksForm: React.FC = () => {
  const { data: socialRes, isLoading: isFetching } = useGetSocialMediaQuery();
  const [createSocial, { isLoading: isCreating }] = useCreateSocialMediaMutation();
  const [updateSocial, { isLoading: isUpdating }] = useUpdateSocialMediaMutation();
  const [deleteSocial, { isLoading: isDeleting }] = useDeleteSocialMediaMutation();

  const socialLinks = Array.isArray(socialRes?.data) ? socialRes.data : [];

  // Local state for the "Add New" form
  const [newName, setNewName] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newIcon, setNewIcon] = useState<File | null>(null);

  // Track editing state for existing items
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editIcon, setEditIcon] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink) return toast.error("Social link is required");

    const formData = new FormData();
    if (newName) formData.append("name", newName);
    formData.append("link", newLink);
    if (newIcon) formData.append("icon", newIcon);

    try {
      await createSocial(formData).unwrap();
      toast.success("Social Media Link Added!");
      setNewName("");
      setNewLink("");
      setNewIcon(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to add social link");
    }
  };

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditName(item.name || "");
    setEditLink(item.link || "");
    setEditIcon(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const formData = new FormData();
    if (editName) formData.append("name", editName);
    if (editLink) formData.append("link", editLink);
    if (editIcon) formData.append("icon", editIcon);

    try {
      await updateSocial({ id: editingId, data: formData }).unwrap();
      toast.success("Social Media Link Updated!");
      setEditingId(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update social link");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this social link?")) return;
    try {
      await deleteSocial(id).unwrap();
      toast.success("Social Media Link Removed!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete social link");
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border-2 border-[#e8e3dc]">
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Social Media Links
          </h2>
          <p className="text-sm text-gray-500">
            Manage dynamic social links for your footer
          </p>
        </div>
        <div className="p-3 bg-purple-50 text-purple-500 rounded-lg">
          <Globe className="h-6 w-6" />
        </div>
      </div>

      {/* List Existing Social Links */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Active Links</h3>
        {isFetching ? (
          <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        ) : socialLinks.length === 0 ? (
          <p className="text-gray-500 text-sm italic p-4 bg-gray-50 rounded-xl text-center border-2 border-dashed border-gray-200">No social media links added yet.</p>
        ) : (
          <div className="space-y-4">
            {socialLinks.map((item: any) => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-xl border-2 border-[#e8e3dc] flex flex-col md:flex-row md:items-center justify-between gap-4">
                {editingId === item.id ? (
                  <div className="w-full flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Platform Name (e.g. Facebook)"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="p-2 border rounded-lg text-sm w-full"
                    />
                    <input
                      type="url"
                      placeholder="URL Link"
                      value={editLink}
                      onChange={(e) => setEditLink(e.target.value)}
                      className="p-2 border rounded-lg text-sm w-full"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setEditIcon(e.target.files[0]);
                        }}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                    </div>
                    <div className="flex gap-2 justify-end mt-2">
                      <button onClick={() => setEditingId(null)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                      <button onClick={handleSaveEdit} disabled={isUpdating} className="px-3 py-1 text-sm bg-amber-800 text-white rounded hover:bg-amber-900 flex items-center">
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />} Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      {item.icon ? (
                        <img src={item.icon} alt={item.name || "Icon"} className="w-10 h-10 object-contain rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <Link className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{item.name || "Unnamed Platform"}</p>
                        <a href={item.link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                          {item.link}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Link Form */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center"><Plus className="w-4 h-4 mr-1" /> Add New Platform</h3>
        <form onSubmit={handleAddNew} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Platform Name</label>
              <input
                type="text"
                placeholder="e.g. TikTok"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">URL / Link *</label>
              <input
                type="url"
                placeholder="https://tiktok.com/@thundra"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                required
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Upload Icon Image *</label>
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
            {isCreating ? "Adding..." : "Add Social Link"}
          </button>
        </form>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default SocialMediaLinksForm;
