import React, { useState, useEffect } from "react";
import { DocumentTextIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { ILegalContent } from "../../app/store/slices/services/adminService/privecyLegalApi";

interface LegalCardProps {
  legal?: ILegalContent;
  onSave: (id: number | null, data: FormData) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  isSaving?: boolean;
  isDeleting?: boolean;
  defaultTitle?: string;
  defaultSubtitle?: string;
}

const LegalCard: React.FC<LegalCardProps> = ({
  legal,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
  defaultTitle = "New Policy",
  defaultSubtitle = "Define your legal terms",
}) => {
  const [title, setTitle] = useState(legal?.title || defaultTitle);
  const [subTitle, setSubTitle] = useState(legal?.sub_title || defaultSubtitle);
  const [content, setContent] = useState(legal?.content || "");

  useEffect(() => {
    if (legal) {
      setTitle(legal.title || "");
      setSubTitle(legal.sub_title || "");
      setContent(legal.content || "");
    }
  }, [legal]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("sub_title", subTitle);
    formData.append("content", content);

    await onSave(legal?.id || null, formData);
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-[#e8e3dc] shadow-sm hover:shadow-md transition-shadow">
      {/* --- Header Section --- */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 mr-4">
          <input
            type="text"
            className="w-full text-xl font-semibold text-gray-800 bg-transparent border-b border-transparent focus:border-amber-600 focus:outline-none placeholder-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Policy Name (e.g. Privacy Policy)"
          />
          <input
            type="text"
            className="w-full text-sm text-gray-500 bg-transparent border-b border-transparent focus:border-amber-600 focus:outline-none mt-1 placeholder-gray-400"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            placeholder="Subtitle or description"
          />
        </div>

        {legal?.id && onDelete && (
          <button
            onClick={() => onDelete(legal.id)}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Delete Policy"
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrashIcon className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* --- Textarea Container --- */}
      <div className="mb-6">
        <textarea
          className="w-full h-64 p-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-amber-200 placeholder-gray-400 font-sans"
          placeholder="Enter the full policy content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* --- Save Button --- */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full flex items-center justify-center py-3 px-4 
                   bg-[linear-gradient(180deg,#8b6f47,#7a5f3a)] text-white font-semibold rounded-lg 
                   hover:brightness-110 disabled:opacity-50 transition duration-150 ease-in-out shadow-sm"
      >
        {isSaving ? (
          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
        ) : (
          <DocumentTextIcon className="w-5 h-5 mr-3" />
        )}
        {legal?.id ? "Update Policy" : "Create Policy"}
      </button>
    </div>
  );
};

export default LegalCard;

