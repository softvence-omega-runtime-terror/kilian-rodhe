import React from "react";
import LegalCard from "@/components/admin/LegalCard";
import { Loader2, PlusCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  useGetLegalContentQuery,
  useCreateLegalContentMutation,
  useUpdateLegalContentMutation,
  useDeleteLegalContentMutation,
} from "../../app/store/slices/services/adminService/privecyLegalApi";

const Legal = () => {
  const { data: legalRes, isLoading: isFetching } = useGetLegalContentQuery();
  const [createLegal, { isLoading: isCreating }] = useCreateLegalContentMutation();
  const [updateLegal, { isLoading: isUpdating }] = useUpdateLegalContentMutation();
  const [deleteLegal, { isLoading: isDeleting }] = useDeleteLegalContentMutation();
  const [isAdding, setIsAdding] = React.useState(false);

  const policies = Array.isArray(legalRes?.data) ? legalRes?.data : [];

  const handleSave = async (id: number | null, data: FormData) => {
    try {
      if (id) {
        await updateLegal({ id, data }).unwrap();
        toast.success("Policy updated successfully");
      } else {
        await createLegal(data).unwrap();
        toast.success("Policy created successfully");
        setIsAdding(false);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to save policy");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this policy?")) return;
    try {
      await deleteLegal(id).unwrap();
      toast.success("Policy deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete policy");
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="w-10 h-10 animate-spin text-amber-800" />
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Render Existing Policies */}
        {policies.map((policy) => (
          <LegalCard
            key={policy.id}
            legal={policy}
            onSave={handleSave}
            onDelete={handleDelete}
            isSaving={isUpdating}
            isDeleting={isDeleting}
          />
        ))}

        {/* Create New Policy Card */}
        {isAdding ? (
          <div className="relative animate-in fade-in zoom-in duration-300">
            <LegalCard
              onSave={handleSave}
              isSaving={isCreating}
              defaultTitle=""
              defaultSubtitle=""
            />
            <button
              onClick={() => setIsAdding(false)}
              className="absolute -top-2 -right-2 p-1 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-red-500 shadow-sm transition"
            >
              <PlusCircle className="w-6 h-6 rotate-45" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex flex-col items-center justify-center p-10 h-[450px] bg-gray-50/50 border-2 border-dashed border-amber-300 rounded-xl hover:bg-amber-50/50 hover:border-amber-400 hover:shadow-md transition-all group"
          >
            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-amber-100 rounded-full text-amber-600 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-amber-900">Add New Policy</h3>
            <p className="text-sm text-amber-700/70 mt-1 max-w-[200px] text-center">
              Click here to create a new legal document
            </p>
          </button>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Legal;

