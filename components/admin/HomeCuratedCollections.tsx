"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import {
  Plus,
  Trash,
  Upload,
  Image as ImageIcon,
  FileText,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import CmsHomePageTitle from "./CmsHomePageTitle"; // Assuming this component exists
import toast, { Toaster } from "react-hot-toast";

// --- Interfaces ---
interface Collection {
  id: number;
  title: string;
  subtitle: string;
  itemCount: number;
  image: string | null;
}

const initialCollections: Collection[] = [
  {
    id: 1,
    title: "Men's Collection",
    subtitle: "Stylish and comfortable apparel for men",
    itemCount: 45,
    image: null,
  },
  {
    id: 2,
    title: "Women's Collection",
    subtitle: "Elegant fashion for modern women",
    itemCount: 62,
    image: null,
  },
  {
    id: 3,
    title: "Kids Collection",
    subtitle: "Fun and colorful designs for children",
    itemCount: 38,
    image: null,
  },
];

interface CollectionItemProps {
  collection: Collection;
  onDelete: (id: number) => void;
  onImageChange: (id: number, imageUrl: string | null) => void;
}

// ---------------------------------------------------------------------
// --- CollectionItem Component ---
// ---------------------------------------------------------------------
const CollectionItem: React.FC<CollectionItemProps> = ({
  collection,
  onDelete,
  onImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageChange(collection.id, reader.result as string);
          toast.success(`Image uploaded for ${collection.title}`);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please select a valid image file (JPG, PNG, etc.).");
      }
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onImageChange(collection.id, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast("Image removed successfully.", { icon: "🗑️" });
  };

  const textInputClass =
    "w-full p-2.5 text-base text-gray-700 bg-gray-100 border-2 border-[#e8e3dc] rounded-lg focus:outline-none placeholder-gray-400";

  const countInputClass =
    "w-20 p-3.5 text-base text-gray-700 bg-gray-100 rounded-lg focus:outline-none border-2 border-[#e8e3dc] text-center";

  return (
    <div className="flex flex-col sm:flex-row py-4 relative">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Left Section: Image and Mobile Actions */}
      <div className="flex-shrink-0 w-full sm:w-32 mb-4 sm:mb-0 flex sm:flex-col items-start sm:items-center">
        <div className="relative w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center border-2 border-[#e8e3dc] overflow-hidden">
          {collection.image ? (
            <>
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-md"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full hover:bg-red-700 transition"
                title="Remove Image"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-400" />
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex flex-row gap-2 justify-start items-center space-y-0 ml-4 sm:hidden mt-2">
          <input
            type="number"
            defaultValue={collection.itemCount}
            className={countInputClass}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="flex items-center px-3 py-3.5 text-sm font-semibold text-gray-700 bg-gray-100 border-2 border-[#e8e3dc] rounded-lg hover:bg-gray-200 transition duration-150 justify-center"
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </button>
        </div>
      </div>

      {/* Middle Section */}
      <div className="w-full flex-grow">
        <div className="flex-grow flex flex-col space-y-3">
          <input
            type="text"
            defaultValue={collection.title}
            placeholder="Collection Title"
            className={textInputClass}
          />
          <input
            type="text"
            defaultValue={collection.subtitle}
            placeholder="Collection Subtitle"
            className={textInputClass}
          />
        </div>

        {/* Desktop/Tablet Actions */}
        <div className="hidden sm:flex flex-row gap-2 justify-start items-center space-y-0 mt-3">
          <input
            type="number"
            defaultValue={collection.itemCount}
            className={countInputClass}
            disabled
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="flex items-center w-auto md:w-1/4 px-3 py-3.5 text-sm font-semibold text-gray-700 bg-gray-100 border-2 border-[#e8e3dc] rounded-lg hover:bg-gray-200 transition duration-150 justify-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 absolute lg:top-4 top-20 right-0 sm:static sm:self-start sm:ml-4">
        <button
          onClick={() => onDelete(collection.id)}
          type="button"
          className="text-gray-400 hover:text-red-500  p-2 transition duration-150 rounded-lg"
          aria-label={`Delete ${collection.title}`}
        >
          <Trash className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// --- CollectionsSection Component ---
// ---------------------------------------------------------------------
const CollectionsSection: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);

  const inputClass =
    "w-full p-3 text-base text-gray-700 bg-white border-2 border-[#e8e3dc] rounded-lg focus:outline-none placeholder-gray-400";

  const handleAddCollection = () => {
    const newCollection: Collection = {
      id: Date.now(),
      title: "New Collection",
      subtitle: "Add a description for this collection",
      itemCount: 0,
      image: null,
    };
    setCollections([...collections, newCollection]);
  };

  const handleDeleteCollection = (id: number) => {
    setCollections(collections.filter((collection) => collection.id !== id));
  };

  const handleImageUpload = (id: number, imageUrl: string | null) => {
    setCollections(
      collections.map((collection) =>
        collection.id === id ? { ...collection, image: imageUrl } : collection
      )
    );
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Saving Collections:", collections);
    toast.success("Collections saved successfully!", { position: "bottom-center" });
  };

  return (
    <div className="bg-[linear-gradient(135deg,#faf9f7,rgba(232,227,220,0.3))] mt-6">
      <div className="p-4 sm:p-6 bg-white rounded-xl border-2 border-[#e8e3dc]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <CmsHomePageTitle
            title="Curated Collections Section"
            text=" Product categories showcased on homepage"
          />

          <button
            onClick={handleAddCollection}
            type="button"
            className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-center px-3 py-2 text-sm font-semibold text-white rounded-lg bg-[linear-gradient(180deg,#8b6f47,#7a5f3a)] hover:bg-gray-700 transition duration-150 flex-shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Collection
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Section Title
          </label>
          <input
            type="text"
            defaultValue="Curated Collections"
            className={inputClass}
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Section Subtitle
          </label>
          <input
            type="text"
            defaultValue="Discover our handpicked collections designed for every style and occasion"
            className={inputClass}
          />
        </div>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Collections</h3>

        <div className="border-2 border-[#e8e3dc] rounded-lg p-2 sm:p-4 divide-y divide-gray-100">
          {collections.map((collection) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              onDelete={handleDeleteCollection}
              onImageChange={handleImageUpload}
            />
          ))}
        </div>

        <button
          onClick={handleSave}
          type="button"
          className="w-full flex items-center justify-center py-3 px-4 mt-8 bg-[linear-gradient(180deg,#8b6f47,#7a5f3a)] text-white font-semibold rounded-lg hover:brightness-110 transition duration-150 ease-in-out"
        >
          <FileText className="w-5 h-5 mr-3" />
          Save Collections
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default CollectionsSection;
