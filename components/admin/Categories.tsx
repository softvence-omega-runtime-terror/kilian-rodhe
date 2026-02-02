import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import {
  useGetAllCategoriesQuery,
  useGetAllAgeRangesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteAgeRangeMutation,
  useGetAllSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from "@/app/store/slices/services/adminService/products/productMetadata";
import Image from "next/image";
import { toast } from "sonner";
import { X, Upload, Loader2, Trash2 } from "lucide-react";

/* -----------------------------
    ToggleSwitch Component
----------------------------- */

interface ToggleSwitchProps {
  label: string;
  description: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete?: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  isChecked,
  onChange,
  onDelete,
}) => (
  <div className="flex items-center bg-[#FAF9F7] rounded-xl px-4 justify-between py-4 group">
    <div className="flex items-center space-x-3">
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
      <div>
        <p className="text-gray-900 font-medium">{label}</p>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>

    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div
        className="
          w-11 h-6 bg-gray-200 rounded-full peer
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:w-5 after:h-5 after:bg-white after:border after:border-gray-300
          after:rounded-full after:transition-all
          peer-checked:bg-black peer-checked:after:translate-x-full
        "
      ></div>
    </label>
  </div>
);

/* -----------------------------
    FilterItem Component
----------------------------- */

interface FilterItemProps {
  label: string;
  isChecked: boolean;
  onChange?: () => void;
  onDelete?: () => void;
  description?: string;
}

const FilterItem: React.FC<FilterItemProps> = ({
  label,
  isChecked,
  onChange,
  onDelete,
  description,
}) => {
  return (
    <ToggleSwitch
      label={label}
      description={description || `Filter item for ${label}`}
      isChecked={isChecked}
      onDelete={onDelete}
      onChange={(e) => {
        if (onChange) onChange();
      }}
    />
  );
};

/* -----------------------------
    AddCategoryModal Component
----------------------------- */

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  ageRanges: any[];
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  ageRanges,
}) => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_active: true,
    age_range: [] as number[],
  });

  const [files, setFiles] = useState<{
    image: File | null;
    icon: File | null;
    banner: File | null;
  }>({
    image: null,
    icon: null,
    banner: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleAgeRangeToggle = (id: number) => {
    setFormData((prev) => {
      const exists = prev.age_range.includes(id);
      if (exists) {
        return { ...prev, age_range: prev.age_range.filter((item) => item !== id) };
      } else {
        return { ...prev, age_range: [...prev.age_range, id] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Title is required");

    try {
      await createCategory({
        ...formData,
        image: files.image || undefined,
        icon: files.icon || undefined,
        banner: files.banner || undefined,
      }).unwrap();

      toast.success("Category created successfully!");
      onClose();
      setFormData({ title: "", description: "", is_active: true, age_range: [] });
      setFiles({ image: null, icon: null, banner: null });
    } catch (err: any) {
      console.error("Failed to create category:", err);
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-semibold text-gray-800">Add New Category</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category Name *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all"
              placeholder="e.g., Casual Wear"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all"
              placeholder="Brief description..."
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-[#8B6F47] focus:ring-[#8B6F47]"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active Category</label>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Display Age Ranges</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ageRanges?.map((range) => (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => handleAgeRangeToggle(range.id)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-all ${formData.age_range.includes(range.id)
                    ? "bg-[#8B6F47] text-white border-[#8B6F47]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#8B6F47]"
                    }`}
                >
                  {range.start} - {range.end}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Main Image</label>
              <FileUploader
                file={files.image}
                onChange={(e) => handleFileChange(e, "image")}
                onClear={() => setFiles({ ...files, image: null })}
                label="Image"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Icon</label>
              <FileUploader
                file={files.icon}
                onChange={(e) => handleFileChange(e, "icon")}
                onClear={() => setFiles({ ...files, icon: null })}
                label="Icon"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Banner</label>
              <FileUploader
                file={files.banner}
                onChange={(e) => handleFileChange(e, "banner")}
                onClear={() => setFiles({ ...files, banner: null })}
                label="Banner"
              />
            </div>
          </div>

          <div className="pt-6 flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-xl bg-[#8B6F47] text-white font-medium hover:bg-[#A08169] transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FileUploader = ({ file, onChange, onClear, label }: { file: File | null; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onClear: () => void; label: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative group">
      {file ? (
        <div className="relative h-32 rounded-xl overflow-hidden border border-gray-200">
          <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={(e) => { e.preventDefault(); onClear(); }}
            className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white shadow-sm"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="h-32 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-[#8B6F47] transition-all cursor-pointer"
        >
          <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#8B6F47]" />
          <span className="mt-2 text-xs text-gray-500">Upload {label}</span>
        </div>
      )}
      <input ref={inputRef} type="file" onChange={onChange} className="hidden" accept="image/*" />
    </div>
  );
};

/* -----------------------------
    AddSubCategoryModal Component
----------------------------- */

interface AddSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSubCategoryModal: React.FC<AddSubCategoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [createSubCategory, { isLoading }] = useCreateSubCategoryMutation();
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    try {
      await createSubCategory({ title }).unwrap();
      toast.success("Product Category created successfully!");
      setTitle("");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create product category");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Add Product Category</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none"
              placeholder="e.g., T-Shirts"
            />
          </div>
          <div className="pt-4 flex space-x-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-gray-200">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 px-6 py-3 rounded-xl bg-[#8B6F47] text-white">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -----------------------------
    FilterPage Component
----------------------------- */

const FilterPage: React.FC = () => {
  const { data: categories, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();
  const { data: ageRanges } = useGetAllAgeRangesQuery();
  const { data: subCategories, isLoading: isSubCategoriesLoading } = useGetAllSubCategoriesQuery();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteAgeRange] = useDeleteAgeRangeMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isButtonActive] = useState<boolean>(true);

  const buttonClasses = `w-full py-3 rounded-md text-white font-semibold transition-all duration-200 ${isButtonActive ? "bg-[#8B6F47] hover:opacity-90" : "bg-gray-400 cursor-not-allowed"}`;

  const handleToggleCategory = async (cat: any) => {
    try {
      const newActiveState = !cat.is_active;
      await updateCategory({
        id: cat.id,
        payload: {
          title: cat.title,
          description: cat.description || "",
          is_active: newActiveState,
          age_range: cat.age_range || [],
        }
      }).unwrap();
      toast.success(`${cat.title} ${newActiveState ? "activated" : "deactivated"}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteCategory = async (cat: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${cat.title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#8B6F47",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        await deleteCategory(cat.id).unwrap();
        toast.success("Category deleted successfully!");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete category");
      }
    }
  };

  const handleDeleteAgeRange = async (range: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete age range ${range.start}-${range.end}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#8B6F47",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deleteAgeRange(range.id).unwrap();
        toast.success("Age range deleted successfully!");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete age range");
      }
    }
  };

  const handleDeleteSubCategory = async (sub: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete product category "${sub.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#8B6F47",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deleteSubCategory(sub.id).unwrap();
        toast.success("Product Category deleted successfully!");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete product category");
      }
    }
  };

  return (
    <div className="font-sans">
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Categories Section */}
          <div className="bg-white rounded-xl border border-[#E8E3DC]">
            <h2 className="text-xl p-4 font-medium text-gray-800 border-b border-[#E8E3DC]">Categories</h2>
            <div className="p-4 space-y-3">
              {isCategoriesLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#8B6F47]" /></div>
              ) : (
                categories?.map((category) => (
                  <FilterItem
                    key={category.id}
                    label={category.title}
                    description={category.description}
                    isChecked={category.is_active}
                    onDelete={() => handleDeleteCategory(category)}
                    onChange={() => handleToggleCategory(category)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Age Groups Section */}
          <div className="bg-white rounded-xl border border-[#E8E3DC]">
            <h2 className="text-xl p-4 font-medium text-gray-800 border-b border-[#E8E3DC]">Age Groups</h2>
            <div className="p-4 space-y-3">
              {ageRanges?.map((group) => (
                <div key={group.id} className="flex items-center bg-[#FAF9F7] rounded-xl px-4 py-4 justify-between group">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDeleteAgeRange(group)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <p className="text-gray-900 font-medium">{group.start} - {group.end} Years</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Management Section */}
        <div className="bg-white rounded-xl border border-[#E8E3DC]">
          <h2 className="text-xl p-4 font-medium text-gray-800 border-b border-[#E8E3DC]">Product Management</h2>
          <div className="p-4 text-center">
            <p className="text-gray-500 mb-6">Create and manage your categories and metadata centrally.</p>
            <button className={`${buttonClasses} max-w-sm mx-auto flex items-center justify-center`} onClick={() => setIsModalOpen(true)}>
              Add New Category
            </button>
          </div>
        </div>

        {/* Product Categories Section (Sub-Categories) */}
        <div className="bg-white rounded-xl border border-[#E8E3DC]">
          <h2 className="text-xl p-4 font-medium text-gray-800 border-b border-[#E8E3DC] flex justify-between items-center">
            Product Categories
            <button
              onClick={() => setIsSubModalOpen(true)}
              className="text-sm px-3 py-1 bg-[#8B6F47] text-white rounded-lg hover:opacity-90 transition-all font-medium"
            >
              Add New
            </button>
          </h2>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isSubCategoriesLoading ? (
              <div className="col-span-full flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#8B6F47]" /></div>
            ) : (
              subCategories?.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-4 bg-[#FAF9F7] rounded-xl group transition-all border border-transparent hover:border-[#8B6F47]/10">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDeleteSubCategory(sub)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <span className="text-gray-900 font-medium">{sub.title}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AddCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} ageRanges={ageRanges || []} />
      <AddSubCategoryModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} />
    </div>
  );
};

export default FilterPage;
